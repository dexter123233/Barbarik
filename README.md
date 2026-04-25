# Barbarik

GitHub MCP Server for Lyzr/Claude/Cursor Integration

## Overview

Barbarik is a Model Context Protocol (MCP) server that provides GitHub API operations as tools for AI assistants. It supports both SSE mode (for Lyzr Studio) and stdio mode (for Claude Desktop/Cursor).

## Features

- **Branch Management** - Create branches programmatically
- **File Operations** - Commit files to GitHub repositories
- **Pull Requests** - Open and manage pull requests
- **CI/CD Integration** - Get PR status, CI results, and coverage reports
- **Security Scanning** - Trigger security scans on pull requests
- **Merging** - Merge pull requests with squash, merge, or rebase methods

## Available Tools

| Tool | Description |
|------|-------------|
| `create_branch` | Create a new GitHub branch |
| `commit_files` | Commit files to a branch |
| `open_pull_request` | Open a pull request |
| `get_pr_status` | Get PR status and CI checks |
| `get_ci_result` | Get CI result for a PR |
| `get_coverage_report` | Get coverage report |
| `run_security_scan` | Trigger security scan |
| `merge_pull_request` | Merge a pull request |

## Quick Start

```bash
# Install dependencies
pip install mcp uvicorn starlette python-dotenv

# Configure environment
cp .env.example ~/.config/mcp-gh/.env
# Edit ~/.config/mcp-gh/.env with your credentials

# Start the server
python mcp_github.py --port 8003
```

## Endpoints

- `GET /` - Server info
- `GET /sse` - SSE stream (Lyzr Studio)
- `POST /messages` - RPC calls
- `GET /health` - Health check

## Live Demo

🚀 **Live Site:** https://dexter123233.github.io/Barbarik/

## License

MIT
