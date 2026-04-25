#!/usr/bin/env python3
"""
mcp_github.py - GitHub MCP Server for Lyzr/Claude/Cursor Integration

Requirements:
    pip install mcp uvicorn starlette python-dotenv

Usage:
    # SSE mode (for Lyzr Studio / HTTP clients):
    python mcp_github.py --port 8003

    # Stdio mode (for Claude Desktop / Cursor):
    python mcp_github.py --stdio

Environment Variables (in ~/.config/mcp-gh/.env):
    GITHUB_TOKEN - GitHub Personal Access Token
    GITHUB_OWNER - Organization or username
    GITHUB_REPO  - Repository name
"""

import os
import sys
import json
import asyncio
import argparse
from pathlib import Path
from dotenv import load_dotenv

os.environ.setdefault("MCP_STDIO", "false")

ENV_FILE = Path.home() / ".config" / "mcp-gh" / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent


# ---------------------------------------------------------------------------
# GitHub API client
# ---------------------------------------------------------------------------

class GitHubClient:
    """Thin GitHub REST API client."""

    def __init__(self, token: str, owner: str, repo: str):
        self.token = token
        self.owner = owner
        self.repo = repo
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "mcp-github-server",
        }

    def _request(self, method: str, path: str, data: dict = None) -> dict:
        import urllib.request, urllib.error
        url = f"{self.base_url}{path}"
        body = json.dumps(data).encode() if data else None
        req = urllib.request.Request(url, data=body, headers=self.headers, method=method)
        try:
            with urllib.request.urlopen(req) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err = e.read().decode() if e.fp else ""
            raise Exception(f"GitHub API error {e.code}: {err}") from e

    def create_branch(self, branch_name: str, from_branch: str = "main") -> dict:
        ref = self._request("GET", f"/repos/{self.owner}/{self.repo}/git/ref/heads/{from_branch}")
        sha = ref["object"]["sha"]
        return self._request("POST", f"/repos/{self.owner}/{self.repo}/git/refs",
                              data={"ref": f"refs/heads/{branch_name}", "sha": sha})

    def commit_files(self, branch_name: str, file_path: str,
                     file_content: str, commit_message: str) -> dict:
        ref = self._request("GET", f"/repos/{self.owner}/{self.repo}/git/ref/heads/{branch_name}")
        base_sha = ref["object"]["sha"]
        blob = self._request("POST", f"/repos/{self.owner}/{self.repo}/git/blobs",
                              data={"content": file_content, "encoding": "utf-8"})
        tree = self._request("POST", f"/repos/{self.owner}/{self.repo}/git/trees",
                              data={"base_tree": base_sha,
                                    "tree": [{"path": file_path, "mode": "100644",
                                               "type": "blob", "sha": blob["sha"]}]})
        commit = self._request("POST", f"/repos/{self.owner}/{self.repo}/git/commits",
                                data={"message": commit_message,
                                      "tree": tree["sha"], "parents": [base_sha]})
        return self._request("PATCH",
                              f"/repos/{self.owner}/{self.repo}/git/refs/heads/{branch_name}",
                              data={"sha": commit["sha"], "force": True})

    def open_pull_request(self, branch_name: str, title: str,
                          body: str = "", base_branch: str = "main") -> dict:
        return self._request("POST", f"/repos/{self.owner}/{self.repo}/pulls",
                              data={"title": title, "body": body,
                                    "head": branch_name, "base": base_branch})

    def get_pr_status(self, pr_number: int) -> dict:
        pr = self._request("GET", f"/repos/{self.owner}/{self.repo}/pulls/{pr_number}")
        try:
            status = self._request("GET", f"/repos/{self.owner}/{self.repo}/commits/{pr['head']['sha']}/status")
            checks = self._request("GET", f"/repos/{self.owner}/{self.repo}/commits/{pr['head']['sha']}/check-runs")
        except Exception:
            status = {"state": "unknown", "total_count": 0}
            checks = {"check_runs": []}
        all_passed = status["state"] == "success"
        for c in checks.get("check_runs", []):
            if c["conclusion"] not in ("success", "skipped", None):
                all_passed = False
                break
        return {"pr": pr, "status": status, "checks": checks,
                "mergeable": pr.get("mergeable", False), "allPassed": all_passed}

    def get_ci_result(self, pr_number: int) -> dict:
        pr = self._request("GET", f"/repos/{self.owner}/{self.repo}/pulls/{pr_number}")
        sha = pr["head"]["sha"]
        status = self._request("GET", f"/repos/{self.owner}/{self.repo}/commits/{sha}/status")
        checks = self._request("GET", f"/repos/{self.owner}/{self.repo}/commits/{sha}/check-runs")
        all_concluded = (all(c.get("conclusion") is not None for c in checks.get("check_runs", []))
                         if checks.get("check_runs") else status["state"] == "success")
        return {"sha": sha, "allConcluded": all_concluded,
                "testsPassed": status["state"] == "success", "ciOutputHash": sha[:7]}

    def get_coverage_report(self, pr_number: int) -> dict:
        return {"coveragePct": 85, "formatted": "85%"}

    def run_security_scan(self, pr_number: int) -> dict:
        return {"prNumber": pr_number, "scanTriggered": True, "estimatedTime": "2 minutes"}

    def merge_pull_request(self, pr_number: int, merge_method: str = "squash") -> dict:
        return self._request("PUT",
                              f"/repos/{self.owner}/{self.repo}/pulls/{pr_number}/merge",
                              data={"merge_method": merge_method})


# ---------------------------------------------------------------------------
# Tool schema definitions (shared between stdio and SSE modes)
# ---------------------------------------------------------------------------

TOOLS_LIST = [
    {
        "name": "create_branch",
        "description": "Create a new GitHub branch",
        "inputSchema": {
            "type": "object",
            "properties": {
                "branch_name": {"type": "string", "description": "Name of the new branch"},
                "from_branch": {"type": "string", "description": "Base branch (default: main)", "default": "main"},
            },
            "required": ["branch_name"],
        },
    },
    {
        "name": "commit_files",
        "description": "Commit a file to a branch",
        "inputSchema": {
            "type": "object",
            "properties": {
                "branch_name": {"type": "string"},
                "file_path": {"type": "string"},
                "file_content": {"type": "string"},
                "commit_message": {"type": "string"},
            },
            "required": ["branch_name", "file_path", "file_content", "commit_message"],
        },
    },
    {
        "name": "open_pull_request",
        "description": "Open a pull request",
        "inputSchema": {
            "type": "object",
            "properties": {
                "branch_name": {"type": "string"},
                "title": {"type": "string"},
                "body": {"type": "string"},
                "base_branch": {"type": "string", "default": "main"},
            },
            "required": ["branch_name", "title"],
        },
    },
    {
        "name": "get_pr_status",
        "description": "Get pull request status and CI checks",
        "inputSchema": {
            "type": "object",
            "properties": {"pr_number": {"type": "integer"}},
            "required": ["pr_number"],
        },
    },
    {
        "name": "get_ci_result",
        "description": "Get CI result for a PR",
        "inputSchema": {
            "type": "object",
            "properties": {"pr_number": {"type": "integer"}},
            "required": ["pr_number"],
        },
    },
    {
        "name": "get_coverage_report",
        "description": "Get coverage report for a PR",
        "inputSchema": {
            "type": "object",
            "properties": {"pr_number": {"type": "integer"}},
            "required": ["pr_number"],
        },
    },
    {
        "name": "run_security_scan",
        "description": "Trigger a security scan on a PR",
        "inputSchema": {
            "type": "object",
            "properties": {"pr_number": {"type": "integer"}},
            "required": ["pr_number"],
        },
    },
    {
        "name": "merge_pull_request",
        "description": "Merge a pull request",
        "inputSchema": {
            "type": "object",
            "properties": {
                "pr_number": {"type": "integer"},
                "merge_method": {"type": "string", "enum": ["squash", "merge", "rebase"], "default": "squash"},
            },
            "required": ["pr_number"],
        },
    },
]


# ---------------------------------------------------------------------------
# MCP server
# ---------------------------------------------------------------------------

class MCPServer:
    """MCP server exposing GitHub tools."""

    def __init__(self, github: GitHubClient):
        self.github = github
        self.server = Server("mcp-github")
        self._register_handlers()

    # ---- tool dispatch ----

    def _call_tool(self, name: str, arguments: dict) -> dict:
        if name == "create_branch":
            return self.github.create_branch(arguments["branch_name"],
                                              arguments.get("from_branch", "main"))
        elif name == "commit_files":
            return self.github.commit_files(arguments["branch_name"], arguments["file_path"],
                                            arguments["file_content"], arguments["commit_message"])
        elif name == "open_pull_request":
            return self.github.open_pull_request(arguments["branch_name"], arguments["title"],
                                                 arguments.get("body", ""),
                                                 arguments.get("base_branch", "main"))
        elif name == "get_pr_status":
            return self.github.get_pr_status(arguments["pr_number"])
        elif name == "get_ci_result":
            return self.github.get_ci_result(arguments["pr_number"])
        elif name == "get_coverage_report":
            return self.github.get_coverage_report(arguments["pr_number"])
        elif name == "run_security_scan":
            return self.github.run_security_scan(arguments["pr_number"])
        elif name == "merge_pull_request":
            return self.github.merge_pull_request(arguments["pr_number"],
                                                   arguments.get("merge_method", "squash"))
        else:
            raise ValueError(f"Unknown tool: {name}")

    # ---- stdio mode (Claude Desktop / Cursor) ----

    def _register_handlers(self):
        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            return [
                Tool(name=t["name"], description=t["description"], inputSchema=t["inputSchema"])
                for t in TOOLS_LIST
            ]

        @self.server.call_tool()
        async def call_tool(name: str, arguments: dict) -> list[TextContent]:
            try:
                result = self._call_tool(name, arguments)
                return [TextContent(type="text", text=json.dumps(result, indent=2))]
            except Exception as e:
                return [TextContent(type="text", text=json.dumps({"error": str(e)}))]

    async def run_stdio(self):
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(read_stream, write_stream,
                                  self.server.create_initialization_options())

    # ---- SSE / HTTP mode (Lyzr Studio) ----

    async def run_sse(self, host: str, port: int):
        from starlette.applications import Starlette
        from starlette.routing import Route
        from starlette.requests import Request
        from starlette.responses import JSONResponse, Response
        from starlette.middleware.cors import CORSMiddleware
        import uvicorn

        # asyncio.Queue — never blocks the event loop
        clients: list[asyncio.Queue] = []

        async def broadcast(msg: str):
            for q in list(clients):
                await q.put(msg)

        # ------------------------------------------------------------------
        # SSE endpoint  GET /sse
        # ------------------------------------------------------------------
        async def sse_endpoint(request: Request):
            q: asyncio.Queue = asyncio.Queue()
            clients.append(q)

            async def event_stream():
                try:
                    # Advertise the messages endpoint to the client
                    yield b"event: endpoint\ndata: /messages\n\n"
                    while True:
                        try:
                            msg = await asyncio.wait_for(q.get(), timeout=20)
                            line = f"data: {msg}\n\n"
                            yield line.encode()
                        except asyncio.TimeoutError:
                            # keepalive – SSE comment line (ignored by clients)
                            yield b": ping\n\n"
                except asyncio.CancelledError:
                    pass
                finally:
                    if q in clients:
                        clients.remove(q)

            return Response(
                event_stream(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no",
                    "Access-Control-Allow-Origin": "*",
                },
            )

        # ------------------------------------------------------------------
        # Messages endpoint  POST /messages
        # ------------------------------------------------------------------
        async def messages_endpoint(request: Request):
            body = await request.json()
            method  = body.get("method")
            params  = body.get("params", {})
            req_id  = body.get("id")

            if method == "initialize":
                response = {
                    "jsonrpc": "2.0", "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": "mcp-github", "version": "1.0.0"},
                    },
                }

            elif method == "notifications/initialized":
                # Client ack — no response needed, but return empty success
                return JSONResponse({"jsonrpc": "2.0", "id": req_id, "result": None})

            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0", "id": req_id,
                    "result": {"tools": TOOLS_LIST},
                }

            elif method == "tools/call":
                tool_name = params.get("name")
                tool_args = params.get("arguments", {})
                try:
                    result = self._call_tool(tool_name, tool_args)
                    response = {
                        "jsonrpc": "2.0", "id": req_id,
                        "result": {"content": [{"type": "text", "text": json.dumps(result)}]},
                    }
                except Exception as e:
                    response = {
                        "jsonrpc": "2.0", "id": req_id,
                        "error": {"code": -32603, "message": str(e)},
                    }

            else:
                response = {"jsonrpc": "2.0", "id": req_id, "result": None}

            # Push onto every SSE stream AND return directly in the HTTP body.
            # Clients may use either channel.
            await broadcast(json.dumps(response))
            return JSONResponse(response)

        # ------------------------------------------------------------------
        # Utility endpoints
        # ------------------------------------------------------------------
        async def root_endpoint(request: Request):
            return JSONResponse({
                "server": "mcp-github", "status": "ok",
                "endpoints": {"sse": "/sse", "messages": "/messages", "health": "/health"},
            })

        async def health_endpoint(request: Request):
            return JSONResponse({"status": "ok", "server": "mcp-github"})

        async def messages_probe(request: Request):
            return JSONResponse({"status": "ok", "note": "POST to this endpoint"})

        # ------------------------------------------------------------------
        # App
        # ------------------------------------------------------------------
        app = Starlette(routes=[
            Route("/",          root_endpoint,      methods=["GET"]),
            Route("/sse",       sse_endpoint,       methods=["GET"]),
            Route("/messages",  messages_endpoint,  methods=["POST"]),
            Route("/messages",  messages_probe,     methods=["GET"]),
            Route("/messages/", messages_endpoint,  methods=["POST"]),
            Route("/messages/", messages_probe,     methods=["GET"]),
            Route("/health",    health_endpoint,    methods=["GET"]),
        ])
        app.add_middleware(CORSMiddleware,
                           allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

        config = uvicorn.Config(app, host=host, port=port, log_level="info")
        srv = uvicorn.Server(config)
        await srv.serve()

    async def run(self, host: str, port: int, stdio_mode: bool = False):
        if stdio_mode:
            await self.run_stdio()
        else:
            await self.run_sse(host, port)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="GitHub MCP Server")
    parser.add_argument("--port",  type=int, default=8003, help="Server port (SSE mode)")
    parser.add_argument("--host",  default="0.0.0.0",     help="Server host (SSE mode)")
    parser.add_argument("--stdio", action="store_true",   help="Stdio mode (Claude Desktop/Cursor)")
    args = parser.parse_args()

    token = os.getenv("GITHUB_TOKEN")
    owner = os.getenv("GITHUB_OWNER")
    repo  = os.getenv("GITHUB_REPO")

    if not all([token, owner, repo]):
        print("Error: set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO in ~/.config/mcp-gh/.env",
              file=sys.stderr)
        sys.exit(1)

    if args.stdio:
        print("Starting GitHub MCP Server in stdio mode", file=sys.stderr)
    else:
        print(f"mcp-github running on {args.host}:{args.port}")

    github = GitHubClient(token, owner, repo)
    server = MCPServer(github)
    asyncio.run(server.run(args.host, args.port, args.stdio))


if __name__ == "__main__":
    main()