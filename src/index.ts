interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * deno.land/x registry MCP.
 *
 * Auth: none. Uses apiland.deno.dev backing service.
 */


const BASE = 'https://apiland.deno.dev/v2/modules';
const UA = 'pipeworx-mcp-deno-land/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'module', description: 'Module metadata + latest version.', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
  { name: 'versions', description: 'List versions.', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } },
  { name: 'version', description: 'Single version metadata.', inputSchema: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'string' } }, required: ['name', 'version'] } },
  { name: 'search', description: 'Name + description search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] } },
  { name: 'dependencies', description: 'Best-effort dependency list from version metadata.', inputSchema: { type: 'object', properties: { name: { type: 'string' }, version: { type: 'string' } }, required: ['name', 'version'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'module':
      return denoGet(`/${encodeURIComponent(reqStr(args, 'name', '"oak"'))}`);
    case 'versions':
      return denoGet(`/${encodeURIComponent(reqStr(args, 'name', '"oak"'))}/versions`);
    case 'version':
      return denoGet(`/${encodeURIComponent(reqStr(args, 'name', '"oak"'))}/${encodeURIComponent(reqStr(args, 'version', '"v17.0.0"'))}`);
    case 'search': {
      const p = new URLSearchParams({
        query: reqStr(args, 'query', '"oak"'),
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
      });
      return denoGet(`?${p}`);
    }
    case 'dependencies': {
      const data = (await denoGet(`/${encodeURIComponent(reqStr(args, 'name', '"oak"'))}/${encodeURIComponent(reqStr(args, 'version', '"v17.0.0"'))}`)) as { upload_options?: { dependencies?: unknown } };
      return { dependencies: data.upload_options?.dependencies ?? null };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function denoGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('deno.land/x: not found');
  if (!res.ok) throw new Error(`deno.land/x: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
