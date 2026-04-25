# Barbarik Setup Guide

## Prerequisites

- Python 3.10+
- GitHub Personal Access Token (PAT)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dexter123233/Barbarik.git
cd Barbarik
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install mcp uvicorn starlette python-dotenv
```

### 4. Configure Credentials

Create `~/.config/mcp-gh/.env`:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-org-or-username
GITHUB_REPO=your-repository-name
MCP_PORT=8003
MCP_HOST=localhost
```

### 5. Generate GitHub PAT

1. Go to github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Generate new token with these permissions:
   - **Contents**: Read & Write
   - **Pull requests**: Read & Write
   - **Checks**: Read
   - **Actions**: Read & Write
   - **Metadata**: Read

## Running the Server

### SSE Mode (for Lyzr Studio)

```bash
python mcp_github.py --port 8003
```

### Stdio Mode (for Claude Desktop/Cursor)

```bash
python mcp_github.py --stdio
```

## Testing

```bash
# Health check
curl http://localhost:8003/health

# SSE endpoint
curl -N http://localhost:8003/sse
```

## Remote Access (ngrok)

If Lyzr Studio can't reach localhost:

```bash
ngrok http 8003
# Use: https://abc123.ngrok-free.app/sse
```

## Troubleshooting

### "Missing credentials" error
- Ensure `~/.config/mcp-gh/.env` exists with all required variables

### "Cannot connect" error
- Verify the server is running: `ps aux | grep mcp_github`
- Check firewall settings

### Token permission denied
- Regenerate PAT with required permissions
- Verify token hasn't expired
