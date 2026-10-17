#!/usr/bin/env node
// x402 ETF & Macro Intelligence — PayBox stdio MCP plugin
// No API keys, private keys, or seed phrases are embedded in this bundle.

const BASE_URL = 'https://x402-sand.vercel.app';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const MAX_RESPONSE_CHARS = 12000;
const UI_RESOURCE_URI = 'ui://x402-etf-macro-intelligence/research-dashboard';
const DASHBOARD_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Treasury & Macro Intelligence</title>\n<style>\n:root{color-scheme:dark;--bg:#0b1017;--panel:#121b27;--line:#273446;--muted:#98a8bb;--text:#eef4fb;--accent:#f7931a;--green:#38d996;--red:#ff6b78}\n*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}main{padding:16px;max-width:1100px;margin:auto}.top{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}.brand{display:flex;gap:10px;align-items:center}.mark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#382717;color:var(--accent);font-size:21px;font-weight:800}.eyebrow{color:var(--muted);font-size:11px;letter-spacing:.12em;text-transform:uppercase}.title{font-size:20px;font-weight:750;letter-spacing:-.02em}.pill{border:1px solid var(--line);border-radius:999px;padding:5px 9px;color:var(--muted);font-size:11px}.pill.ok{color:var(--green);border-color:#1f6d54}.hero{margin:16px 0;padding:15px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(120deg,#172434,#111923)}.hero h2{font-size:17px;margin:3px 0 6px}.hero p{margin:0;color:var(--muted);overflow-wrap:anywhere}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:12px 0}.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;min-width:0}.label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.value{font-size:17px;font-weight:750;margin-top:7px;overflow-wrap:anywhere}.sub{font-size:11px;color:var(--muted);margin-top:4px}.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0}.tab{border:1px solid var(--line);background:#101823;color:var(--muted);border-radius:8px;padding:8px 12px;cursor:pointer}.tab.active{background:#2b2117;color:#ffbd69;border-color:#77502a}.panel{border:1px solid var(--line);background:var(--panel);border-radius:13px;padding:12px;overflow:hidden}.panelhead{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px}.panelhead strong{font-size:13px}.search{background:#0b1119;border:1px solid var(--line);border-radius:8px;color:var(--text);padding:8px;min-width:150px;max-width:100%}.tablewrap{overflow:auto;max-height:390px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border-bottom:1px solid var(--line);padding:9px;text-align:left;vertical-align:top;max-width:300px;overflow-wrap:anywhere}th{color:var(--muted);font-weight:600;position:sticky;top:0;background:var(--panel)}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:480px;overflow:auto;font-size:12px;color:#c5d5e7;margin:0}.bars{display:flex;flex-direction:column;gap:8px}.barrow{display:grid;grid-template-columns:minmax(70px,1fr) 3fr auto;gap:9px;align-items:center;font-size:12px}.track{height:7px;background:#263446;border-radius:99px;overflow:hidden}.fill{height:100%;background:var(--accent);border-radius:99px}.empty{padding:28px 12px;text-align:center;color:var(--muted)}footer{color:var(--muted);font-size:10px;margin:12px 2px 0}@media(max-width:620px){main{padding:11px}.cards{grid-template-columns:repeat(2,minmax(0,1fr))}.title{font-size:17px}.barrow{grid-template-columns:80px 1fr auto}}\n</style>\n</head>\n<body><main>\n<header class=\"top\"><div class=\"brand\"><div class=\"mark\">↗</div><div><div class=\"eyebrow\">Research terminal</div><div class=\"title\">Treasury &amp; Macro Intelligence</div></div></div><span id=\"status\" class=\"pill\">Waiting for tool result</span></header>\n<section class=\"hero\"><div class=\"eyebrow\" id=\"endpoint\">X402 RESEARCH</div><h2 id=\"headline\">Interactive research dashboard</h2><p id=\"summary\">When a connected MCP client supplies the tool result, metrics, tables, and charts will appear here.</p></section>\n<section id=\"cards\" class=\"cards\"><div class=\"card\"><div class=\"label\">Data</div><div class=\"value\">Awaiting</div><div class=\"sub\">Tool result</div></div><div class=\"card\"><div class=\"label\">View</div><div class=\"value\">Interactive</div><div class=\"sub\">Overview + raw data</div></div></section>\n<nav class=\"tabs\"><button class=\"tab active\" data-tab=\"overview\">Overview</button><button class=\"tab\" data-tab=\"latestflows\">Latest ETF widget</button><button class=\"tab\" data-tab=\"table\">Data table</button><button class=\"tab\" data-tab=\"json\">Raw JSON</button></nav>\n<section id=\"latestflows\" class=\"panel\" hidden><div class=\"panelhead\"><strong>Latest daily ETF flows · CryptoETF</strong><span class=\"pill\">Public widget</span></div><iframe src=\"https://cryptoetf.today/embed/flows?asset=all&amp;theme=dark\" title=\"Crypto ETF flows — CryptoETF\" loading=\"lazy\" style=\"width:100%;height:260px;border:0;border-radius:10px;background:#0b1017\" sandbox=\"allow-scripts allow-same-origin allow-popups\"></iframe><p class=\"sub\">Latest published day across supported assets. Figures may be revised during the day; source: CryptoETF.</p></section>\n<section id=\"overview\" class=\"panel\"><div class=\"panelhead\"><strong>Data overview</strong><span class=\"pill\">Auto-detected</span></div><div id=\"bars\" class=\"bars\"><div class=\"empty\">No result loaded yet.</div></div></section>\n<section id=\"table\" class=\"panel\" hidden><div class=\"panelhead\"><strong>Records</strong><input id=\"filter\" class=\"search\" placeholder=\"Filter records…\"></div><div id=\"tablebody\" class=\"tablewrap\"><div class=\"empty\">No records loaded yet.</div></div></section>\n<section id=\"json\" class=\"panel\" hidden><div class=\"panelhead\"><strong>Complete response</strong><button id=\"copy\" class=\"tab\">Copy JSON</button></div><pre id=\"raw\">{}</pre></section>\n<footer>Source data is provided by the selected research endpoint. Figures are not inferred; only values present in the tool result are shown. Payment state is shown only when supplied by the result.</footer>\n</main>\n<script>\n(function(){\nlet payload=null, rows=[];\nconst $=id=>document.getElementById(id);\nfunction fmt(v){if(v===null)return 'null';if(typeof v==='object')return Array.isArray(v)?'['+v.length+' items]':'{object}';if(typeof v==='number')return Number.isFinite(v)?v.toLocaleString(undefined,{maximumFractionDigits:6}):String(v);return String(v)}\nfunction esc(v){return String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]))}\nfunction flatten(obj,prefix='',out=[]){if(obj&&typeof obj==='object'&&!Array.isArray(obj)){for(const [k,v] of Object.entries(obj)){const key=prefix?prefix+'.'+k:k;if(v&&typeof v==='object'&&!Array.isArray(v))flatten(v,key,out);else out.push([key,v])}}else out.push([prefix||'value',obj]);return out}\nfunction findData(m){if(!m||typeof m!=='object')return null;const candidates=[m.params?.result,m.params?.content?.[0],m.result?.structuredContent,m.result?.content?.[0],m.params?.data,m];for(const c of candidates){if(c&&typeof c==='object'){if(typeof c.text==='string'){try{return JSON.parse(c.text)}catch{return {message:c.text}}}if(c.structuredContent)return c.structuredContent;if(c.data&&typeof c.data==='object')return c.data;if(!c.method&&!c.jsonrpc)return c}}return null}\nfunction render(data){payload=data||{};const meta=payload.endpoint||payload.path||payload.resource_url||payload.name||'Research response';const root=payload.data&&typeof payload.data==='object'?payload.data:payload;$('endpoint').textContent=String(meta).toUpperCase();$('headline').textContent=payload.title||payload.description||'Research results';$('summary').textContent=payload.summary||payload.note||'Interactive view of the returned data. Values below come from the tool result.';$('status').textContent=payload.paid===true?'Paid result':payload.stated_price_usd!=null?'Payment proposal':'Data loaded';$('status').className='pill '+(payload.paid===true?'ok':'');\nconst fields=flatten(root).filter(([k,v])=>!['raw','content','structuredContent'].includes(k)&&v!==undefined).slice(0,8);$('cards').innerHTML=fields.length?fields.slice(0,8).map(([k,v])=>'<div class=\"card\"><div class=\"label\">'+esc(k)+'</div><div class=\"value\">'+esc(fmt(v))+'</div><div class=\"sub\">From response</div></div>').join(''):'<div class=\"card\"><div class=\"label\">Response</div><div class=\"value\">Loaded</div></div>';\nlet list=Array.isArray(root)?root:(Array.isArray(root.data)?root.data:Array.isArray(root.results)?root.results:Array.isArray(root.records)?root.records:Array.isArray(root.items)?root.items:null);if(!list)list=fields.map(([key,value])=>({field:key,value}));rows=list.map(x=>x&&typeof x==='object'?x:{value:x});\n$('raw').textContent=JSON.stringify(payload,null,2);renderTable();renderBars();setTab('overview')}\nfunction renderTable(){const q=$('filter').value.toLowerCase();const filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));const cols=[...new Set(filtered.flatMap(r=>Object.keys(r||{})))].slice(0,12);$('tablebody').innerHTML=filtered.length?'<table><thead><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+filtered.slice(0,250).map(r=>'<tr>'+cols.map(c=>'<td>'+esc(fmt(r?.[c]))+'</td>').join('')+'</tr>').join('')+'</tbody></table>':'<div class=\"empty\">No matching records.</div>'}\nfunction renderBars(){const numeric=flatten(payload).filter(([k,v])=>typeof v==='number'&&Number.isFinite(v)).slice(0,12);if(!numeric.length){$('bars').innerHTML='<div class=\"empty\">No numeric fields in this response. Open Data table or Raw JSON to inspect the full result.</div>';return}const max=Math.max(1,...numeric.map(x=>Math.abs(x[1])));$('bars').innerHTML=numeric.map(([k,v])=>'<div class=\"barrow\"><span title=\"'+esc(k)+'\">'+esc(k.length>26?k.slice(0,24)+'…':k)+'</span><div class=\"track\"><div class=\"fill\" style=\"width:'+Math.max(2,Math.abs(v)/max*100)+'%\"></div></div><strong>'+esc(fmt(v))+'</strong></div>').join('')}\nfunction setTab(name){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));['overview','latestflows','table','json'].forEach(id=>$(id).hidden=id!==name)}\ndocument.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));$('filter').addEventListener('input',renderTable);$('copy').addEventListener('click',()=>{try{navigator.clipboard?.writeText(JSON.stringify(payload,null,2));$('copy').textContent='Copied'}catch{$('copy').textContent='Select JSON to copy'}});\nwindow.addEventListener('message',event=>{const d=event.data;if(!d)return;const msg=d.jsonrpc?d:d.message;if(!msg)return;if(msg.method==='ui/notifications/tool-result'||msg.method==='notifications/tool-result'){const p=findData(msg);if(p)render(p)}else{const p=findData(msg);if(p&&Object.keys(p).length>0)render(p)}});\ntry{if(window.parent!==window)window.parent.postMessage({jsonrpc:'2.0',method:'ui/notifications/initialized',params:{}},'*')}catch(e){}\n})();\n</script></body></html>";

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
const tool = (name, description, properties = {}, required = []) => ({
  name, description,
  inputSchema: {type:'object', properties, required, additionalProperties:false},
  outputSchema: {type:'object', additionalProperties:true},
  _meta: {ui:{resourceUri:UI_RESOURCE_URI, visibility:['model','app']}}
});
const string = (description, extra = {}) => ({type:'string', description, ...extra});
const tools = [
  tool('get_api_health', 'Check the live x402 ETF & Macro Intelligence API health endpoint. This is free and does not make a paid request.'),
  tool('list_research_endpoints', 'List available ETF, macro, and market research endpoints with stated per-request prices and required query parameters.'),
  tool('get_openapi_spec', 'Retrieve the live OpenAPI specification to inspect endpoint documentation. This is a free documentation request.'),
  tool('propose_paid_research', 'For a buyer request, complete the whole flow autonomously when the host exposes PayBox native use_service: prepare the allowlisted resource URL, call use_service with that exact URL and the authorized wallet credential, wait for terminal status, and only after payment.status is succeeded pass the actual resource body to show_research_dashboard. Do not ask the buyer to call show_research_dashboard manually. The final user-visible result must be the interactive research dashboard, not a prose summary or raw JSON. Never claim paid=true unless PayBox confirms payment success. This proposal tool itself does not pay.', {
    endpoint: {type:'string', enum:routeRows.map(r=>r[0]), description:'Exact paid endpoint path from list_research_endpoints.'},
    query: {type:'object', description:'Query parameters for the selected endpoint. Values must be strings, integers, or booleans; only simple query parameters are accepted.', additionalProperties:{oneOf:[{type:'string'},{type:'integer'},{type:'boolean'}]}},
    network: {type:'string', enum:['base','solana'], default:'base', description:'Payment network for the proposal. Defaults to Base USDC.'}
  }, ['endpoint']),
  tool('propose_etf_summary', 'For a buyer request, autonomously prepare this ETF summary URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {network:{type:'string',enum:['base','solana'],default:'base'} }),
  tool('propose_etf_flows', 'For a buyer request, autonomously prepare this ETF flow URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},period:{type:'string',default:'30d',pattern:'^[1-9][0-9]{0,2}d$'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_fund_flows', 'For a buyer request, autonomously prepare this fund-level ETF flow URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_funds', 'For a buyer request, autonomously prepare this ETF funds URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {asset:{type:'string',enum:['BTC','ETH','SOL','XRP','DOGE','LINK','AVAX','BNB','DOT','SUI'],default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_etf_prices', 'For a buyer request, autonomously prepare this ETF prices URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {network:{type:'string',enum:['base','solana'],default:'base'}}),
  tool('propose_macro_calendar', 'For a buyer request, autonomously prepare this macro calendar URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {from:string('Start date YYYY-MM-DD'),to:string('Optional end date YYYY-MM-DD'),network:{type:'string',enum:['base','solana'],default:'base'}}, ['from']),
  tool('propose_macro_indicators', 'For a buyer request, autonomously prepare this FRED macro-indicator URL, call PayBox native use_service with the exact URL and authorized wallet credential, wait for confirmed payment success, then call show_research_dashboard with the actual returned resource body. Do not ask the buyer to invoke the dashboard tool manually. The final result should be the interactive UI, not prose or raw JSON. This tool alone does not pay.', {series:string('Comma-separated FRED series IDs',{default:'DFF,DGS10,CPIAUCSL,UNRATE'}),network:{type:'string',enum:['base','solana'],default:'base'}}, ['series']),

  tool('show_research_dashboard', 'Render a paid research result as an interactive dashboard in MCP Apps-capable buyer clients. ETF dashboards also include a CryptoETF latest-daily-flows embed. Call this after the buyer client has fetched the actual endpoint result and payment is confirmed; pass the returned data without inventing or changing values. This tool does not fetch data or make payment.', {
    endpoint: string('Endpoint path or research category'),
    title: string('Optional dashboard title'),
    summary: string('Optional short factual summary based on the result'),
    source: string('Optional data source label'),
    paid_usd: {type:'number',minimum:0},
    paid: {type:'boolean',default:false},
    data: {type:'object',description:'The actual JSON response returned by the paid endpoint.',additionalProperties:true}
  }, ['endpoint','data']),
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
    case 'show_research_dashboard': {
      const data = parseObject(args.data, 'data');
      return {endpoint:args.endpoint,title:args.title || args.endpoint,summary:args.summary || 'Interactive visualization of the paid endpoint response.',source:args.source || 'x402 ETF & Macro Intelligence',paid:args.paid === true,paid_usd:args.paid_usd, data};
    }
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
  if (method === 'initialize') return rpcResponse(id, {protocolVersion:params.protocolVersion || '2024-11-05',capabilities:{tools:{listChanged:false},resources:{listChanged:false}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.0.0'}});
  if (method === 'ping') return rpcResponse(id, {});
  if (method === 'tools/list') return rpcResponse(id, {tools});
  if (method === 'tools/call') {
    try { return rpcResponse(id, toolResult(await callTool(params.name, params.arguments || {}))); }
    catch(e) { return rpcResponse(id, {content:[{type:'text',text:e instanceof Error ? e.message : 'Tool failed'}],isError:true,resultType:'complete'}); }
  }
  if (method === 'resources/list') return rpcResponse(id, {resources:[{uri:UI_RESOURCE_URI,name:'Research Dashboard',description:'Interactive dashboard shared by all ETF, macro, Treasury, FMP, and BEA research tools.',mimeType:'text/html;profile=mcp-app',_meta:{ui:{prefersBorder:true}}}]});
  if (method === 'resources/read') {
    const uri = params?.uri;
    if (uri !== UI_RESOURCE_URI) return rpcError(id, -32602, `Unknown resource URI: ${uri}`);
    return rpcResponse(id, {contents:[{uri:UI_RESOURCE_URI,mimeType:'text/html;profile=mcp-app',text:DASHBOARD_HTML,_meta:{ui:{csp:{connectDomains:[],resourceDomains:[],frameDomains:['https://cryptoetf.today'],baseUriDomains:[]},prefersBorder:true}}}]});
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
