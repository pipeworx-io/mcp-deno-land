# @pipeworx/deno-land

[deno.land/x](https://deno.land/x) MCP — third-party Deno module registry. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `module(name)` — module metadata + latest version
- `versions(name)` — list versions
- `version(name, version)` — single version metadata
- `search(query, limit?)` — name + description search
- `dependencies(name, version)` — module dependencies (best-effort scrape from version meta)

## Data source

`https://apiland.deno.dev/v2/modules/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "deno-land": {
      "url": "https://gateway.pipeworx.io/deno-land/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Deno Land data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
