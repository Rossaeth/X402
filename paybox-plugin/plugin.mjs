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
const tool = (name, description, properties = {}, required = []) => ({
  name, description,
  inputSchema: {type:'object', properties, required, additionalProperties:false},
  outputSchema: {type:'object', additionalProperties:true}
});
const string = (description, extra = {}) => ({type:'string', description, ...extra});
const tools = [
  tool('get_api_health', 'Check the live x402 ETF & Macro Intelligence API health endpoint. This is free and does not make a paid request.'),
  tool('list_research_endpoints', 'List available ETF, macro, and market research endpoints with stated per-request prices and required query parameters.'),
  tool('get_openapi_spec', 'Retrieve the live OpenAPI specification to inspect endpoint documentation. This is a free documentation request.'),
  tool('propose_paid_research', 'Prepare a PayBox x402 payment proposal for one allowlisted paid ETF, macro, or FMP endpoint. PayBox must inspect the live HTTP 402 challenge and obtain the required user approval before payment. Choose Base or Solana explicitly. This tool does not itself pay or fetch the paid result.', {
    endpoint: {type:'string', enum:routeRows.map(r=>r[0]), description:'Exact paid endpoint path from list_research_endpoints.'},
    query: {type:'object', description:'Query parameters for the selected endpoint. Values must be strings, integers, or booleans; only simple query parameters are accepted.', additionalProperties:{oneOf:[{type:'string'},{type:'integer'},{type:'boolean'}]}},
    network: {type:'string', enum:['base','solana'], default:'base', description:'Payment network for the proposal. Defaults to Base USDC.'}
  }, ['endpoint']),
  tool('propose_etf_summary', 'Propose a paid request for a cross-asset crypto ETF flow summary ($0.02 USDC). Does not itself pay or fetch the result.', {network:{type:'string',enum:['base','solana'],default:'base'} }),
  tool('propose_etf_flows', 'Propose a paid ETF flow research request for an asset and lookback period ($0.02 USDC).', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},period:{type:'string',default:'30d',pattern:'^[1-9][0-9]{0,2}d$'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_fund_flows', 'Propose a paid fund-level ETF flow request ($0.02 USDC).', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_funds', 'Propose a paid ETF fund data request ($0.02 USDC).', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_prices', 'Propose a paid crypto ETF price data request ($0.02 USDC).', {network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_macro_calendar', 'Propose a paid macroeconomic calendar request ($0.01 USDC). Use YYYY-MM-DD dates.', {from:string('Start date YYYY-MM-DD'),to:string('Optional end date YYYY-MM-DD'),network:{type:'string',enum:['base','solana'],default:'base'}}, ['from']),
  tool('propose_macro_indicators', 'Propose a paid FRED macro-indicator request ($0.01 USDC). Example series: DFF,DGS10,CPIAUCSL,UNRATE.', {series:string('Comma-separated FRED series IDs',{default:'DFF,DGS10,CPIAUCSL,UNRATE'}),network:{type:'string',enum:['base','solana'],default:'base'}}, ['series']),
];

function rpcResponse(id, result) { return {jsonrpc:'2.0', id, result:{...result, resultType:'complete'}}; }
function rpcError(id, code, message) { return {jsonrpc:'2.0', id, error:{code, message}}; }
function toolResult(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
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
  const amount = String(Math.round(route.price * 1_000_000));
  const proposal = {
    version:'1', kind:'x402', expiresAt:new Date(Date.now() + 4 * 60 * 1000).toISOString(),
    chain:network === 'base' ? 'eip155:8453' : 'solana:mainnet',
    request:{url:queryUrl(path, params), method:'GET'},
    payment:{asset:network === 'base' ? USDC_BASE : USDC_SOLANA, maxAmount:amount}
  };
  return {'io.paybox/transactionProposal':proposal, endpoint:path, stated_price_usd:route.price, network, note:'Proposal only. PayBox must validate the live HTTP 402 challenge and obtain approval; this tool has not paid or fetched paid data.'};
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
