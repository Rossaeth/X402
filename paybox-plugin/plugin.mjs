#!/usr/bin/env node
// x402 ETF & Macro Intelligence — PayBox stdio MCP plugin
// No API keys, private keys, or seed phrases are embedded in this bundle.

const BASE_URL = 'https://x402-sand.vercel.app';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MAX_RESPONSE_CHARS = 12000;

const routeRows = [
  ['/api/etf/summary', 0.02, 'Crypto ETF flow summary', {}],
  ['/api/etf/flows', 0.02, 'Crypto ETF flows by asset', {asset:'BTC',period:'30d'}],
  ['/api/etf/fund-flows', 0.02, 'Crypto ETF fund-level flows', {asset:'BTC'}],
  ['/api/etf/funds', 0.02, 'Crypto ETF funds', {asset:'BTC'}],
  ['/api/etf/cefi', 0.02, 'CeFi index data', {}],
  ['/api/etf/prices', 0.02, 'Crypto ETF prices', {}],
  ['/api/etf/weekly', 0.02, 'Weekly ETF analytics', {}],
  ['/api/etf/tickers', 0.02, 'Supported ETF tickers', {}],
  ['/api/fmp/commodities-list', 0.01, 'FMP commodities list', {}],
  ['/api/fmp/biggest-gainers', 0.01, 'Biggest market gainers', {}],
  ['/api/fmp/biggest-losers', 0.01, 'Biggest market losers', {}],
  ['/api/fmp/most-actives', 0.01, 'Most actively traded stocks', {}],
  ['/api/fmp/exchange-market-hours', 0.01, 'Exchange market hours', {exchange:'NASDAQ'}],
  ['/api/fmp/holidays-by-exchange', 0.01, 'Exchange holidays', {exchange:'NASDAQ',from:'2026-01-01',to:'2026-03-31'}],
  ['/api/fmp/all-exchange-market-hours', 0.01, 'Market hours for all exchanges', {}],
  ['/api/fmp/economics', 0.01, 'FMP economics data', {}],
  ['/api/fmp/treasury-rates', 0.01, 'Treasury rates', {}],
  ['/api/fmp/economic-indicators', 0.01, 'Economic indicators', {name:'GDP'}],
  ['/api/fmp/market-risk-premium', 0.01, 'Market risk premium', {}],
  ['/api/fmp/profile-cik', 0.01, 'Company profile by CIK', {cik:'0000320193'}],
  ['/api/fmp/stock-peers', 0.01, 'Comparable stocks', {symbol:'AAPL'}],
  ['/api/fmp/search-name', 0.01, 'Search companies by name', {query:'Apple'}],
  ['/api/fmp/financial-reports-dates', 0.01, 'Financial report dates', {symbol:'AAPL'}],
  ['/api/fmp/sec-filings-company-search/name', 0.01, 'Search SEC companies by name', {company:'Berkshire'}],
  ['/api/fmp/sec-filings-company-search/symbol', 0.01, 'Search SEC companies by ticker', {symbol:'AAPL'}],
  ['/api/fmp/sec-filings-company-search/cik', 0.01, 'Search SEC companies by CIK', {cik:'0000320193'}],
  ['/api/fmp/sec-profile', 0.01, 'SEC company profile', {symbol:'AAPL'}],
  ['/api/fmp/standard-industrial-classification-list', 0.01, 'Industrial classification list', {}],
  ['/api/fmp/crowdfunding-offerings-latest', 0.01, 'Latest crowdfunding offerings', {page:'0',limit:'20'}],
  ['/api/fmp/crowdfunding-offerings-search', 0.01, 'Search crowdfunding offerings', {name:'enotap'}],
  ['/api/fmp/crowdfunding-offerings', 0.01, 'Crowdfunding offerings by CIK', {cik:'0001916078'}],
  ['/api/fmp/fundraising-latest', 0.01, 'Latest fundraising data', {page:'0',limit:'10'}],
  ['/api/fmp/fundraising-search', 0.01, 'Search fundraising data', {name:'NJOY'}],
  ['/api/fmp/fundraising', 0.01, 'Fundraising data by CIK', {cik:'0001547416'}],
  ['/api/macro/calendar', 0.01, 'Economic calendar', {from:'2026-01-01',to:'2026-01-31'}],
  ['/api/macro/indicators', 0.01, 'FRED macro indicators', {series:'DFF,DGS10,CPIAUCSL,UNRATE'}],
  ['/api/bea/gdp', 0.01, 'BEA GDP data', {year:'LAST5'}],
  ['/api/bea/inflation', 0.01, 'BEA PCE inflation', {year:'LAST5'}],
  ['/api/bea/personal-income', 0.01, 'BEA personal income', {year:'LAST5'}],
  ['/api/bea/corporate-profits', 0.01, 'BEA corporate profits', {year:'LAST5'}],
  ['/api/bea/trade', 0.01, 'BEA trade data', {year:'LAST5'}],
  ['/api/bea/international-investment', 0.01, 'BEA international investment', {year:'LAST5'}],
  ['/api/bea/gdp-by-industry', 0.01, 'BEA GDP by industry', {year:'LAST5'}],
  ['/api/bea/regional', 0.01, 'BEA regional data', {year:'LAST5'}],
];
const routes = Object.fromEntries(routeRows.map(([path, price, description, examples]) => [path, {path, price, description, examples}]));
const requiredParams = {
  '/api/etf/flows':['asset'], '/api/etf/fund-flows':['asset'], '/api/etf/funds':['asset'],
  '/api/macro/calendar':['from'], '/api/macro/indicators':['series'],
  '/api/fmp/profile-cik':['cik'], '/api/fmp/stock-peers':['symbol'], '/api/fmp/search-name':['query'],
  '/api/fmp/financial-reports-dates':['symbol'], '/api/fmp/sec-filings-company-search/name':['company'],
  '/api/fmp/sec-filings-company-search/symbol':['symbol'], '/api/fmp/sec-filings-company-search/cik':['cik'],
  '/api/fmp/sec-profile':['symbol'], '/api/fmp/crowdfunding-offerings-search':['name'],
  '/api/fmp/crowdfunding-offerings':['cik'], '/api/fmp/fundraising-search':['name'], '/api/fmp/fundraising':['cik'],
  '/api/fmp/exchange-market-hours':['exchange'], '/api/fmp/holidays-by-exchange':['exchange','from','to'],
  '/api/fmp/economic-indicators':['name']
};
const tool = (name, description, properties = {}, required = [], ui = false) => ({
  name, description,
  inputSchema: {type:'object', properties, required, additionalProperties:false},
  outputSchema: {type:'object', additionalProperties:true},
  ...(ui ? {_meta:{ui:{resourceUri:'ui://x402-research/dashboard.html'}}} : {})
});
const string = (description, extra = {}) => ({type:'string', description, ...extra});
const tools = [
  tool('get_api_health', 'Check the live x402 ETF & Macro Intelligence API health endpoint. This is free and does not make a paid request.'),
  tool('list_research_endpoints', 'List available ETF, macro, and market research endpoints with stated per-request prices and required query parameters.'),
  tool('get_openapi_spec', 'Retrieve the live OpenAPI specification to inspect endpoint documentation. This is a free documentation request.'),
  tool('propose_paid_research', 'Prepare an allowlisted paid-resource URL for PayBox native use_service. After calling this tool, call PayBox use_service with the returned resource_url and an authorized wallet credential; PayBox handles the live x402 V2 challenge, approval, payment, and paid re-fetch. This tool does not pay.', {
    endpoint: {type:'string', enum:routeRows.map(r=>r[0]), description:'Exact paid endpoint path from list_research_endpoints.'},
    query: {type:'object', description:'Query parameters for the selected endpoint. Values must be strings, integers, or booleans; only simple query parameters are accepted.', additionalProperties:{oneOf:[{type:'string'},{type:'integer'},{type:'boolean'}]}},
    network: {type:'string', enum:['base','solana'], default:'base', description:'Payment network for the proposal. Defaults to Base USDC.'}
  }, ['endpoint']),
  tool('propose_etf_summary', 'Prepare the ETF summary resource URL. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds. This tool does not pay.', {network:{type:'string',enum:['base','solana'],default:'base'} }),
  tool('propose_etf_flows', 'Prepare an ETF flow resource URL for an asset and lookback period. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},period:{type:'string',default:'30d',pattern:'^[1-9][0-9]{0,2}d$'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_fund_flows', 'Prepare a fund-level ETF flow resource URL. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_funds', 'Prepare an ETF funds resource URL. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_prices', 'Prepare an ETF prices resource URL. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_macro_calendar', 'Prepare a macroeconomic calendar resource URL using YYYY-MM-DD dates. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {from:string('Start date YYYY-MM-DD'),to:string('Optional end date YYYY-MM-DD'),network:{type:'string',enum:['base','solana'],default:'base'}}, ['from']),
  tool('propose_macro_indicators', 'Prepare a FRED macro-indicator resource URL. Then call PayBox native use_service with resource_url and an authorized wallet credential; PayBox handles x402 V2 payment and retrieval. After use_service returns a successful paid response, call render_research_dashboard with values extracted from that response so the user sees a chart/card widget; never fabricate values or render success before payment succeeds.', {series:string('Comma-separated FRED series IDs',{default:'DFF,DGS10,CPIAUCSL,UNRATE'}),network:{type:'string',enum:['base','solana'],default:'base'}}, ['series']),
  tool('render_research_dashboard', 'Render already-retrieved research data as an interactive ETF/Macro terminal widget when the MCP host supports MCP Apps. Pass only data returned by a successful endpoint call; this tool does not fetch paid data or make payments. In unsupported hosts it returns a readable text dashboard.', {
    title:string('Dashboard title',{default:'ETF & Macro Intelligence'}),
    endpoint:string('Source endpoint path'),
    network:{type:'string',enum:['base','solana','free','unknown'],default:'unknown'},
    paid_usd:{type:'number',minimum:0},
    payment_status:{type:'string',enum:['succeeded','free','pending','failed','unknown'],default:'unknown'},
    as_of:string('Source timestamp or reporting date'),
    metrics:{type:'array',items:{type:'object',properties:{label:string('Metric label'),value:{type:['string','number']},change:{type:['string','number']},unit:string('Optional unit'),direction:{type:'string',enum:['up','down','flat','unknown']}},required:['label','value'],additionalProperties:false}},
    series:{type:'array',items:{type:'object',properties:{label:string('X-axis label, e.g. date'),value:{type:'number'},group:string('Optional series group')},required:['label','value'],additionalProperties:false}},
    rows:{type:'array',items:{type:'object',additionalProperties:{type:['string','number','boolean','null']}}},
    notes:{type:'array',items:{type:'string'}}
  }, ['endpoint'], true),
];

const dashboardHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{color-scheme:dark;font-family:Inter,system-ui,Arial,sans-serif;background:#080d15;color:#e9f0fa}*{box-sizing:border-box}body{margin:0;padding:16px;background:#080d15}.wrap{max-width:980px;margin:auto}.head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px}.kicker{font-size:10px;letter-spacing:.16em;color:#8ba4c3}h1{font-size:22px;margin:6px 0 4px}p{margin:0;color:#92a3b8;font-size:12px}.pill{border:1px solid #285844;border-radius:99px;color:#8be2b4;padding:6px 9px;font-size:11px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.card,.panel{background:#101a28;border:1px solid #26374c;border-radius:12px;padding:13px;min-width:0}.label{font-size:11px;color:#9aabc0}.value{font-size:22px;font-weight:750;margin:9px 0;overflow-wrap:anywhere}.change{font-size:11px;color:#a6b6c9}.up{color:#4cdb9d}.down{color:#ff7885}.panel{margin-top:12px}.panel h2{font-size:13px;margin:0 0 12px}.chart{height:170px;display:flex;align-items:flex-end;gap:4px;border-bottom:1px solid #304056;padding-top:8px}.barwrap{height:100%;flex:1;min-width:0;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px}.bar{width:min(100%,24px);min-height:2px;border-radius:4px 4px 0 0;background:linear-gradient(#5d9bff,#2454a1)}.bar.neg{background:linear-gradient(#ff7f8b,#963746)}.barlabel{font-size:9px;color:#8fa2bb;white-space:nowrap;overflow:hidden}.tablewrap{overflow:auto}table{border-collapse:collapse;width:100%;font-size:11px}td,th{text-align:left;padding:9px;border-bottom:1px solid #26364a;white-space:nowrap}th{color:#91a6c1}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px;max-height:280px;overflow:auto}.foot{margin-top:12px;font-size:10px;color:#7489a3}@media(max-width:600px){body{padding:10px}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}h1{font-size:19px}.value{font-size:20px}.chart{height:145px}}
</style></head><body><main class="wrap"><header class="head"><div><div class="kicker">X402 · RESEARCH TERMINAL</div><h1 id="title">ETF &amp; Macro Intelligence</h1><p id="meta">Awaiting structured research data</p></div><span class="pill" id="pay">PAYMENT · UNKNOWN</span></header><section class="grid" id="metrics"></section><section class="panel" id="chartpanel" hidden><h2>Historical series</h2><div class="chart" id="chart"></div><p id="chartnote" style="margin-top:10px"></p></section><section class="panel" id="tablepanel" hidden><h2>Research data</h2><div class="tablewrap" id="table"></div></section><section class="panel" id="notespanel" hidden><h2>Source notes</h2><div id="notes"></div></section><div class="foot">Source-first research · Values shown as supplied · Not investment advice</div></main>
<script>
(function(){const $=id=>document.getElementById(id);function esc(v){return String(v==null?'—':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function render(d){if(!d||typeof d!=='object')return;$('title').textContent=d.title||'ETF & Macro Intelligence';$('meta').textContent=(d.endpoint||'Source unknown')+' · As of '+(d.as_of||'not supplied')+' · '+(d.network||'network unknown')+(d.paid_usd!=null?' ·  return {jsonrpc:'2.0', id, result:{...result, resultType:'complete'}}; }
function rpcError(id, code, message) { return {jsonrpc:'2.0', id, error:{code, message}}; }
function toolResult(value) {
  const text = value && typeof value === 'object' && typeof value.text_fallback === 'string'
    ? value.text_fallback
    : (typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  return {content:[{type:'text',text}], structuredContent:value && typeof value === 'object' ? value : {result:value}, isError:false};
}
function parseObject(value, label) {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be a JSON object.`);
  return value;
}
function queryUrl(path, query) {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(query)) {
    if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(key)) throw new Error(`Invalid query parameter name: ${key}`);
    if (!['string','number','boolean'].includes(typeof value)) throw new Error(`Query parameter ${key} must be a string, number, or boolean.`);
    const str = String(value);
    if (str.length > 500 || /[\u0000-\u001f\u007f]/.test(str)) throw new Error(`Invalid value for query parameter ${key}.`);
    url.searchParams.set(key, str);
  }
  return url.toString();
}
function makeProposal(path, query, network) {
  const route = routes[path];
  if (!route) throw new Error('Endpoint is not allowlisted. Use list_research_endpoints to see supported paths.');
  const params = parseObject(query, 'query');
  const allowed = new Set(Object.keys(route.examples));
  const commonOptional = new Set(['limit','page','from','to','period','asset','exchange','name','symbol','cik','query','company','series']);
  for (const key of Object.keys(params)) {
    if (allowed.size ? !allowed.has(key) && !commonOptional.has(key) : !commonOptional.has(key)) throw new Error(`Query parameter '${key}' is not supported for ${path}.`);
  }
  for (const key of (requiredParams[path] || [])) {
    if (params[key] === undefined || params[key] === null || String(params[key]).trim() === '') throw new Error(`Missing required query parameter '${key}' for ${path}.`);
  }
  if (path === '/api/etf/flows' || path === '/api/etf/fund-flows' || path === '/api/etf/funds') {
    if (params.asset !== undefined && !/^[A-Z0-9]{2,10}$/.test(String(params.asset))) throw new Error('asset must be an uppercase asset symbol such as BTC or ETH.');
  }
  if (params.period !== undefined && !/^[1-9][0-9]{0,2}d$/.test(String(params.period))) throw new Error('period must look like 7d or 30d.');
  if (network !== 'base' && network !== 'solana') throw new Error('network must be base or solana.');
  const resourceUrl = queryUrl(path, params);
  return {
    resource_url: resourceUrl,
    method: 'GET',
    endpoint: path,
    stated_price_usd: route.price,
    preferred_network: network === 'base' ? 'eip155:8453' : 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    payment_protocol: 'x402 v2',
    next_action: 'Call PayBox native use_service with this exact resource_url and an authorized wallet credential. Let PayBox inspect the live 402 challenge and choose a supported accepted payment rail.',
    paid: false,
    note: 'This tool only prepares the resource URL. No payment was attempted and no paid data was fetched. The live 402 challenge is authoritative for price and accepted networks.'
  };
}
async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {headers:{accept:'application/json'}, signal:controller.signal, redirect:'error'});
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = {raw:raw.slice(0, MAX_RESPONSE_CHARS)}; }
    if (!res.ok) throw new Error(`API returned HTTP ${res.status}: ${JSON.stringify(data).slice(0,1800)}`);
    return data;
  } finally { clearTimeout(timer); }
}
async function callTool(name, args) {
  args = parseObject(args, 'Tool arguments');
  switch(name) {
    case 'get_api_health': return await getJson(`${BASE_URL}/api/health`);
    case 'get_openapi_spec': return await getJson(`${BASE_URL}/openapi.json`);
    case 'list_research_endpoints': return {base_url:BASE_URL, payment_protocol:'x402 v2', networks:['Base USDC (eip155:8453)','Solana USDC (solana:mainnet)'], endpoints:routeRows.map(([path,price,description,examples])=>({path,method:'GET',description,price_usd:price,required_query_parameters:requiredParams[path]||[],example_query:examples})), note:'Prices are stated by this API; the live 402 challenge is authoritative before any payment.'};
    case 'propose_paid_research': return makeProposal(args.endpoint, args.query, args.network ?? 'base');
    case 'propose_etf_summary': return makeProposal('/api/etf/summary', {}, args.network ?? 'base');
    case 'propose_etf_flows': return makeProposal('/api/etf/flows', {asset:args.asset ?? 'BTC',period:args.period ?? '30d'}, args.network ?? 'base');
    case 'propose_etf_fund_flows': return makeProposal('/api/etf/fund-flows', {asset:args.asset ?? 'BTC'}, args.network ?? 'base');
    case 'propose_etf_funds': return makeProposal('/api/etf/funds', {asset:args.asset ?? 'BTC'}, args.network ?? 'base');
    case 'propose_etf_prices': return makeProposal('/api/etf/prices', {}, args.network ?? 'base');
    case 'propose_macro_calendar': return makeProposal('/api/macro/calendar', {from:args.from,...(args.to ? {to:args.to}: {})}, args.network ?? 'base');
    case 'propose_macro_indicators': return makeProposal('/api/macro/indicators', {series:args.series ?? 'DFF,DGS10,CPIAUCSL,UNRATE'}, args.network ?? 'base');
    case 'render_research_dashboard': {
      const metrics = Array.isArray(args.metrics) ? args.metrics.slice(0,12) : [];
      const series = Array.isArray(args.series) ? args.series.slice(0,120) : [];
      const rows = Array.isArray(args.rows) ? args.rows.slice(0,40) : [];
      const notes = Array.isArray(args.notes) ? args.notes.slice(0,12).map(v => String(v).slice(0,500)) : [];
      const dashboard = {
        view:'x402-research-dashboard',
        title:String(args.title || 'ETF & Macro Intelligence').slice(0,120),
        endpoint:String(args.endpoint || 'unknown').slice(0,240),
        network:args.network || 'unknown',
        paid_usd:Number.isFinite(args.paid_usd) ? args.paid_usd : null,
        payment_status:args.payment_status || 'unknown',
        as_of:String(args.as_of || 'Not supplied').slice(0,120),
        metrics:metrics.map(m=>({label:String(m.label||'Metric').slice(0,80),value:m.value,change:m.change,unit:m.unit?String(m.unit).slice(0,24):'',direction:m.direction||'unknown'})),
        series:series.map(p=>({label:String(p.label||'').slice(0,40),value:Number(p.value),group:p.group?String(p.group).slice(0,40):''})).filter(p=>Number.isFinite(p.value)),
        rows,notes
      };
      const lines = [
        '# '+dashboard.title,
        '**Source:** '+dashboard.endpoint+' · **As of:** '+dashboard.as_of,
        '**Payment:** '+dashboard.payment_status+' · **Network:** '+dashboard.network+' · **Cost:** '+(dashboard.paid_usd===null?'not supplied':'
  }
}
async function dispatch(msg) {
  const {id,method,params={}} = msg || {};
  if (method === 'initialize') return rpcResponse(id, {protocolVersion:params.protocolVersion || '2024-11-05',capabilities:{tools:{listChanged:false},resources:{listChanged:false},extensions:{'io.modelcontextprotocol/ui':{}}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.1.0'}});
  if (method === 'ping') return rpcResponse(id, {});
  if (method === 'tools/list') return rpcResponse(id, {tools});
  if (method === 'tools/call') {
    try { return rpcResponse(id, toolResult(await callTool(params.name, params.arguments || {}))); }
    catch(e) { return rpcResponse(id, {content:[{type:'text',text:e instanceof Error ? e.message : 'Tool failed'}],isError:true,resultType:'complete'}); }
  }
  if (method === 'resources/list') return rpcResponse(id, {resources:[{uri:'ui://x402-research/dashboard.html',name:'ETF & Macro Research Dashboard',description:'Interactive terminal view for structured research results',mimeType:'text/html;profile=mcp-app'}]});
  if (method === 'resources/read') {
    const uri = params?.uri;
    if (uri !== 'ui://x402-research/dashboard.html') return rpcError(id,-32602,'Unknown resource URI');
    return rpcResponse(id,{contents:[{uri,mimeType:'text/html;profile=mcp-app',text:dashboardHtml,_meta:{ui:{prefersBorder:true}}}]});
  }
  if (method === 'prompts/list') return rpcResponse(id, {prompts:[]});
  if (method?.startsWith('notifications/')) return null;
  return rpcError(id ?? null, -32601, `Method not found: ${method}`);
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  if (buffer.length > 1024 * 1024) { process.stderr.write('Input buffer exceeded 1 MiB.\n'); process.exit(1); }
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0,index).trim(); buffer = buffer.slice(index+1);
    if (!line) continue;
    (async () => {
      let message;
      try { message = JSON.parse(line); } catch { process.stdout.write(JSON.stringify(rpcError(null,-32700,'Parse error'))+'\n'); return; }
      if (message.id === undefined && message.method?.startsWith('notifications/')) return;
      const result = await dispatch(message);
      if (result) process.stdout.write(JSON.stringify(result)+'\n');
    })().catch(e => process.stderr.write(`Dispatch error: ${e?.message || 'unknown'}\n`));
  }
});
process.stdin.on('end', () => { if (buffer.trim()) process.stderr.write('Ignored incomplete final JSON line.\n'); });
+dashboard.paid_usd.toFixed(2)+' USDC'),
        '',
        ...dashboard.metrics.map(m=>'- **'+m.label+':** '+m.value+(m.unit?' '+m.unit:'')+(m.change!==undefined?' · Change: '+m.change:'')),
        ...(dashboard.series.length?['','**Chart data**',...dashboard.series.slice(-20).map(p=>'- '+p.label+': '+p.value)]:[]),
        ...(dashboard.rows.length?['','**Data table**',JSON.stringify(dashboard.rows.slice(0,12),null,2)]:[]),
        ...(dashboard.notes.length?['','**Notes**',...dashboard.notes.map(n=>'- '+n)]:[]),
        '',
        '_Research information only; not investment advice._'
      ];
      return { ...dashboard, text_fallback:lines.join('\\n') };
    }
    default: throw new Error(`Unknown tool: ${name}`);
  }
}
async function dispatch(msg) {
  const {id,method,params={}} = msg || {};
  if (method === 'initialize') return rpcResponse(id, {protocolVersion:params.protocolVersion || '2024-11-05',capabilities:{tools:{listChanged:false}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.0.0'}});
  if (method === 'ping') return rpcResponse(id, {});
  if (method === 'tools/list') return rpcResponse(id, {tools});
  if (method === 'tools/call') {
    try { return rpcResponse(id, toolResult(await callTool(params.name, params.arguments || {}))); }
    catch(e) { return rpcResponse(id, {content:[{type:'text',text:e instanceof Error ? e.message : 'Tool failed'}],isError:true,resultType:'complete'}); }
  }
  if (method === 'resources/list') return rpcResponse(id, {resources:[]});
  if (method === 'prompts/list') return rpcResponse(id, {prompts:[]});
  if (method?.startsWith('notifications/')) return null;
  return rpcError(id ?? null, -32601, `Method not found: ${method}`);
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  if (buffer.length > 1024 * 1024) { process.stderr.write('Input buffer exceeded 1 MiB.\n'); process.exit(1); }
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0,index).trim(); buffer = buffer.slice(index+1);
    if (!line) continue;
    (async () => {
      let message;
      try { message = JSON.parse(line); } catch { process.stdout.write(JSON.stringify(rpcError(null,-32700,'Parse error'))+'\n'); return; }
      if (message.id === undefined && message.method?.startsWith('notifications/')) return;
      const result = await dispatch(message);
      if (result) process.stdout.write(JSON.stringify(result)+'\n');
    })().catch(e => process.stderr.write(`Dispatch error: ${e?.message || 'unknown'}\n`));
  }
});
process.stdin.on('end', () => { if (buffer.trim()) process.stderr.write('Ignored incomplete final JSON line.\n'); });
+Number(d.paid_usd).toFixed(2)+' USDC':'');$('pay').textContent='PAYMENT · '+String(d.payment_status||'unknown').toUpperCase();$('metrics').innerHTML=(d.metrics||[]).map(m=>'<article class="card"><div class="label">'+esc(m.label)+'</div><div class="value">'+esc(m.value)+(m.unit?' <small>'+esc(m.unit)+'</small>':'')+'</div><div class="change '+(m.direction==='up'?'up':m.direction==='down'?'down':'')+'">'+(m.change!==undefined?'Change: '+esc(m.change):'Latest reported value')+'</div></article>').join('');
const points=(d.series||[]).slice(-60);if(points.length){$('chartpanel').hidden=false;const max=Math.max(1,...points.map(p=>Math.abs(Number(p.value)||0)));$('chart').innerHTML=points.map(p=>{const v=Number(p.value)||0;const h=Math.max(2,Math.abs(v)/max*145);return '<div class="barwrap" title="'+esc(p.label)+': '+esc(v)+'"><div class="bar '+(v<0?'neg':'')+'" style="height:'+h+'px"></div><div class="barlabel">'+esc(String(p.label||'').slice(-8))+'</div></div>'}).join('');$('chartnote').textContent=points.length+' observations · bars scaled to largest absolute value';}
const rows=(d.rows||[]).slice(0,40);if(rows.length){$('tablepanel').hidden=false;const cols=[...new Set(rows.flatMap(r=>Object.keys(r||{})))].slice(0,8);$('table').innerHTML='<table><thead><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+esc(r[c])+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
const notes=d.notes||[];if(notes.length){$('notespanel').hidden=false;$('notes').innerHTML=notes.map(n=>'<p style="margin:7px 0">'+esc(n)+'</p>').join('');}}
function receive(e){const m=e.data;if(!m||typeof m!=='object')return;const p=m.params||{};const r=p.result||p;const d=r.structuredContent||r.data||r;if(d&&d.view==='x402-research-dashboard')render(d);}window.addEventListener('message',receive);try{window.parent.postMessage({jsonrpc:'2.0',method:'ui/notifications/initialized',params:{}},'*')}catch(e){}})();
</script></body></html>`;
function rpcResponse(id, result) { return {jsonrpc:'2.0', id, result:{...result, resultType:'complete'}}; }
function rpcError(id, code, message) { return {jsonrpc:'2.0', id, error:{code, message}}; }
function toolResult(value) {
  const text = value && typeof value === 'object' && typeof value.text_fallback === 'string'
    ? value.text_fallback
    : (typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  return {content:[{type:'text',text}], structuredContent:value && typeof value === 'object' ? value : {result:value}, isError:false};
}
function parseObject(value, label) {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be a JSON object.`);
  return value;
}
function queryUrl(path, query) {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(query)) {
    if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(key)) throw new Error(`Invalid query parameter name: ${key}`);
    if (!['string','number','boolean'].includes(typeof value)) throw new Error(`Query parameter ${key} must be a string, number, or boolean.`);
    const str = String(value);
    if (str.length > 500 || /[\u0000-\u001f\u007f]/.test(str)) throw new Error(`Invalid value for query parameter ${key}.`);
    url.searchParams.set(key, str);
  }
  return url.toString();
}
function makeProposal(path, query, network) {
  const route = routes[path];
  if (!route) throw new Error('Endpoint is not allowlisted. Use list_research_endpoints to see supported paths.');
  const params = parseObject(query, 'query');
  const allowed = new Set(Object.keys(route.examples));
  const commonOptional = new Set(['limit','page','from','to','period','asset','exchange','name','symbol','cik','query','company','series']);
  for (const key of Object.keys(params)) {
    if (allowed.size ? !allowed.has(key) && !commonOptional.has(key) : !commonOptional.has(key)) throw new Error(`Query parameter '${key}' is not supported for ${path}.`);
  }
  for (const key of (requiredParams[path] || [])) {
    if (params[key] === undefined || params[key] === null || String(params[key]).trim() === '') throw new Error(`Missing required query parameter '${key}' for ${path}.`);
  }
  if (path === '/api/etf/flows' || path === '/api/etf/fund-flows' || path === '/api/etf/funds') {
    if (params.asset !== undefined && !/^[A-Z0-9]{2,10}$/.test(String(params.asset))) throw new Error('asset must be an uppercase asset symbol such as BTC or ETH.');
  }
  if (params.period !== undefined && !/^[1-9][0-9]{0,2}d$/.test(String(params.period))) throw new Error('period must look like 7d or 30d.');
  if (network !== 'base' && network !== 'solana') throw new Error('network must be base or solana.');
  const resourceUrl = queryUrl(path, params);
  return {
    resource_url: resourceUrl,
    method: 'GET',
    endpoint: path,
    stated_price_usd: route.price,
    preferred_network: network === 'base' ? 'eip155:8453' : 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    payment_protocol: 'x402 v2',
    next_action: 'Call PayBox native use_service with this exact resource_url and an authorized wallet credential. Let PayBox inspect the live 402 challenge and choose a supported accepted payment rail.',
    paid: false,
    note: 'This tool only prepares the resource URL. No payment was attempted and no paid data was fetched. The live 402 challenge is authoritative for price and accepted networks.'
  };
}
async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(url, {headers:{accept:'application/json'}, signal:controller.signal, redirect:'error'});
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = {raw:raw.slice(0, MAX_RESPONSE_CHARS)}; }
    if (!res.ok) throw new Error(`API returned HTTP ${res.status}: ${JSON.stringify(data).slice(0,1800)}`);
    return data;
  } finally { clearTimeout(timer); }
}
async function callTool(name, args) {
  args = parseObject(args, 'Tool arguments');
  switch(name) {
    case 'get_api_health': return await getJson(`${BASE_URL}/api/health`);
    case 'get_openapi_spec': return await getJson(`${BASE_URL}/openapi.json`);
    case 'list_research_endpoints': return {base_url:BASE_URL, payment_protocol:'x402 v2', networks:['Base USDC (eip155:8453)','Solana USDC (solana:mainnet)'], endpoints:routeRows.map(([path,price,description,examples])=>({path,method:'GET',description,price_usd:price,required_query_parameters:requiredParams[path]||[],example_query:examples})), note:'Prices are stated by this API; the live 402 challenge is authoritative before any payment.'};
    case 'propose_paid_research': return makeProposal(args.endpoint, args.query, args.network ?? 'base');
    case 'propose_etf_summary': return makeProposal('/api/etf/summary', {}, args.network ?? 'base');
    case 'propose_etf_flows': return makeProposal('/api/etf/flows', {asset:args.asset ?? 'BTC',period:args.period ?? '30d'}, args.network ?? 'base');
    case 'propose_etf_fund_flows': return makeProposal('/api/etf/fund-flows', {asset:args.asset ?? 'BTC'}, args.network ?? 'base');
    case 'propose_etf_funds': return makeProposal('/api/etf/funds', {asset:args.asset ?? 'BTC'}, args.network ?? 'base');
    case 'propose_etf_prices': return makeProposal('/api/etf/prices', {}, args.network ?? 'base');
    case 'propose_macro_calendar': return makeProposal('/api/macro/calendar', {from:args.from,...(args.to ? {to:args.to}: {})}, args.network ?? 'base');
    case 'propose_macro_indicators': return makeProposal('/api/macro/indicators', {series:args.series ?? 'DFF,DGS10,CPIAUCSL,UNRATE'}, args.network ?? 'base');
    case 'render_research_dashboard': {
      const metrics = Array.isArray(args.metrics) ? args.metrics.slice(0,12) : [];
      const series = Array.isArray(args.series) ? args.series.slice(0,120) : [];
      const rows = Array.isArray(args.rows) ? args.rows.slice(0,40) : [];
      const notes = Array.isArray(args.notes) ? args.notes.slice(0,12).map(v => String(v).slice(0,500)) : [];
      const dashboard = {
        view:'x402-research-dashboard',
        title:String(args.title || 'ETF & Macro Intelligence').slice(0,120),
        endpoint:String(args.endpoint || 'unknown').slice(0,240),
        network:args.network || 'unknown',
        paid_usd:Number.isFinite(args.paid_usd) ? args.paid_usd : null,
        payment_status:args.payment_status || 'unknown',
        as_of:String(args.as_of || 'Not supplied').slice(0,120),
        metrics:metrics.map(m=>({label:String(m.label||'Metric').slice(0,80),value:m.value,change:m.change,unit:m.unit?String(m.unit).slice(0,24):'',direction:m.direction||'unknown'})),
        series:series.map(p=>({label:String(p.label||'').slice(0,40),value:Number(p.value),group:p.group?String(p.group).slice(0,40):''})).filter(p=>Number.isFinite(p.value)),
        rows,notes
      };
      const lines = [
        '# '+dashboard.title,
        '**Source:** '+dashboard.endpoint+' · **As of:** '+dashboard.as_of,
        '**Payment:** '+dashboard.payment_status+' · **Network:** '+dashboard.network+' · **Cost:** '+(dashboard.paid_usd===null?'not supplied':'
  }
}
async function dispatch(msg) {
  const {id,method,params={}} = msg || {};
  if (method === 'initialize') return rpcResponse(id, {protocolVersion:params.protocolVersion || '2024-11-05',capabilities:{tools:{listChanged:false},resources:{listChanged:false},extensions:{'io.modelcontextprotocol/ui':{}}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.1.0'}});
  if (method === 'ping') return rpcResponse(id, {});
  if (method === 'tools/list') return rpcResponse(id, {tools});
  if (method === 'tools/call') {
    try { return rpcResponse(id, toolResult(await callTool(params.name, params.arguments || {}))); }
    catch(e) { return rpcResponse(id, {content:[{type:'text',text:e instanceof Error ? e.message : 'Tool failed'}],isError:true,resultType:'complete'}); }
  }
  if (method === 'resources/list') return rpcResponse(id, {resources:[{uri:'ui://x402-research/dashboard.html',name:'ETF & Macro Research Dashboard',description:'Interactive terminal view for structured research results',mimeType:'text/html;profile=mcp-app'}]});
  if (method === 'resources/read') {
    const uri = params?.uri;
    if (uri !== 'ui://x402-research/dashboard.html') return rpcError(id,-32602,'Unknown resource URI');
    return rpcResponse(id,{contents:[{uri,mimeType:'text/html;profile=mcp-app',text:dashboardHtml,_meta:{ui:{prefersBorder:true}}}]});
  }
  if (method === 'prompts/list') return rpcResponse(id, {prompts:[]});
  if (method?.startsWith('notifications/')) return null;
  return rpcError(id ?? null, -32601, `Method not found: ${method}`);
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  if (buffer.length > 1024 * 1024) { process.stderr.write('Input buffer exceeded 1 MiB.\n'); process.exit(1); }
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0,index).trim(); buffer = buffer.slice(index+1);
    if (!line) continue;
    (async () => {
      let message;
      try { message = JSON.parse(line); } catch { process.stdout.write(JSON.stringify(rpcError(null,-32700,'Parse error'))+'\n'); return; }
      if (message.id === undefined && message.method?.startsWith('notifications/')) return;
      const result = await dispatch(message);
      if (result) process.stdout.write(JSON.stringify(result)+'\n');
    })().catch(e => process.stderr.write(`Dispatch error: ${e?.message || 'unknown'}\n`));
  }
});
process.stdin.on('end', () => { if (buffer.trim()) process.stderr.write('Ignored incomplete final JSON line.\n'); });
+dashboard.paid_usd.toFixed(2)+' USDC'),
        '',
        ...dashboard.metrics.map(m=>'- **'+m.label+':** '+m.value+(m.unit?' '+m.unit:'')+(m.change!==undefined?' · Change: '+m.change:'')),
        ...(dashboard.series.length?['','**Chart data**',...dashboard.series.slice(-20).map(p=>'- '+p.label+': '+p.value)]:[]),
        ...(dashboard.rows.length?['','**Data table**',JSON.stringify(dashboard.rows.slice(0,12),null,2)]:[]),
        ...(dashboard.notes.length?['','**Notes**',...dashboard.notes.map(n=>'- '+n)]:[]),
        '',
        '_Research information only; not investment advice._'
      ];
      return { ...dashboard, text_fallback:lines.join('\\n') };
    }
    default: throw new Error(`Unknown tool: ${name}`);
  }
}
async function dispatch(msg) {
  const {id,method,params={}} = msg || {};
  if (method === 'initialize') return rpcResponse(id, {protocolVersion:params.protocolVersion || '2024-11-05',capabilities:{tools:{listChanged:false}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.0.0'}});
  if (method === 'ping') return rpcResponse(id, {});
  if (method === 'tools/list') return rpcResponse(id, {tools});
  if (method === 'tools/call') {
    try { return rpcResponse(id, toolResult(await callTool(params.name, params.arguments || {}))); }
    catch(e) { return rpcResponse(id, {content:[{type:'text',text:e instanceof Error ? e.message : 'Tool failed'}],isError:true,resultType:'complete'}); }
  }
  if (method === 'resources/list') return rpcResponse(id, {resources:[]});
  if (method === 'prompts/list') return rpcResponse(id, {prompts:[]});
  if (method?.startsWith('notifications/')) return null;
  return rpcError(id ?? null, -32601, `Method not found: ${method}`);
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  if (buffer.length > 1024 * 1024) { process.stderr.write('Input buffer exceeded 1 MiB.\n'); process.exit(1); }
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0,index).trim(); buffer = buffer.slice(index+1);
    if (!line) continue;
    (async () => {
      let message;
      try { message = JSON.parse(line); } catch { process.stdout.write(JSON.stringify(rpcError(null,-32700,'Parse error'))+'\n'); return; }
      if (message.id === undefined && message.method?.startsWith('notifications/')) return;
      const result = await dispatch(message);
      if (result) process.stdout.write(JSON.stringify(result)+'\n');
    })().catch(e => process.stderr.write(`Dispatch error: ${e?.message || 'unknown'}\n`));
  }
});
process.stdin.on('end', () => { if (buffer.trim()) process.stderr.write('Ignored incomplete final JSON line.\n'); });
