#!/usr/bin/env node
// x402 ETF & Macro Intelligence — PayBox stdio MCP plugin
// No API keys, private keys, or seed phrases are embedded in this bundle.
const BASE_URL = 'https://x402-sand.vercel.app';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const routeRows = [
 ['/api/etf/summary',0.02,'Crypto ETF flow summary',{}],
 ['/api/etf/flows',0.02,'Crypto ETF flows by asset',{asset:'BTC',period:'30d'}],
 ['/api/etf/fund-flows',0.02,'Crypto ETF fund-level flows',{asset:'BTC'}],
 ['/api/etf/funds',0.02,'Crypto ETF funds',{asset:'BTC'}],
 ['/api/etf/cefi',0.02,'CeFi index data',{}],
 ['/api/etf/prices',0.02,'Crypto ETF prices',{}],
 ['/api/etf/weekly',0.02,'Weekly ETF analytics',{}],
 ['/api/etf/tickers',0.02,'Supported ETF tickers',{}],
 ['/api/etf/[asset]',0.02,'ETF data for a specified asset',{asset:'BTC'}],
 ['/api/bea/gdp',0.01,'US GDP data from BEA',{}],
 ['/api/bea/inflation',0.01,'US inflation and price data from BEA',{}],
 ['/api/bea/personal-income',0.01,'US personal income data from BEA',{year:'2026'}],
 ['/api/bea/corporate-profits',0.01,'US corporate profits from BEA',{}],
 ['/api/bea/trade',0.01,'US international trade data from BEA',{}],
 ['/api/bea/international-investment',0.01,'US international investment data from BEA',{}],
 ['/api/bea/gdp-by-industry',0.01,'GDP by industry from BEA',{}],
 ['/api/macro/calendar',0.01,'Economic calendar',{from:'2026-10-01',to:'2026-10-31'}],
 ['/api/macro/fed',0.01,'Federal Reserve and FRED macro data',{}],
 ['/api/macro/indicators',0.01,'FRED macro indicators',{series:'DFF,DGS10,CPIAUCSL,UNRATE'}],
 ['/api/research/market-outlook',0.01,'Market outlook research',{}]
];
const requiredParams = {'/api/etf/[asset]':['asset'],'/api/etf/flows':['asset'],'/api/etf/fund-flows':['asset'],'/api/etf/funds':['asset'],'/api/bea/personal-income':['year'],'/api/macro/calendar':['from','to'],'/api/macro/indicators':['series']};
const tool = (name,description,properties={},required=[])=>({name,description,inputSchema:{type:'object',properties,required,additionalProperties:false},outputSchema:{type:'object',additionalProperties:true}});
const str = (description,extra={})=>({type:'string',description,...extra});
const tools = [
 tool('get_api_health','Check live API health. Free request.'),
 tool('list_research_endpoints','List available ETF, BEA, macro and market research endpoints with stated prices and required parameters.'),
 tool('get_openapi_spec','Retrieve the live OpenAPI specification. Free documentation request.'),
 tool('propose_paid_research','Prepare a PayBox x402 payment proposal for an allowlisted endpoint. PayBox must validate the live HTTP 402 challenge and obtain approval; this tool does not itself pay or fetch paid data.',{endpoint:{type:'string',enum:routeRows.map(r=>r[0])},query:{type:'object',additionalProperties:{oneOf:[{type:'string'},{type:'integer'},{type:'boolean'}]}},network:{type:'string',enum:['base','solana'],default:'base'}},['endpoint']),
 tool('propose_etf_summary','Propose a paid crypto ETF summary request ($0.02 USDC).',{network:{type:'string',enum:['base','solana'],default:'base'}}),
 tool('propose_etf_flows','Propose a paid ETF flow request ($0.02 USDC).',{asset:{type:'string',default:'BTC'},period:{type:'string',default:'30d'},network:{type:'string',enum:['base','solana'],default:'base'}}),
 tool('propose_etf_fund_flows','Propose a paid fund-level ETF flow request ($0.02 USDC).',{asset:{type:'string',default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
 tool('propose_etf_funds','Propose a paid ETF funds request ($0.02 USDC).',{asset:{type:'string',default:'BTC'},network:{type:'string',enum:['base','solana'],default:'base'}}),
 tool('propose_etf_prices','Propose a paid ETF prices request ($0.02 USDC).',{network:{type:'string',enum:['base','solana'],default:'base'}}),
 tool('propose_macro_calendar','Propose a paid macro calendar request ($0.01 USDC).',{from:str('Start date YYYY-MM-DD'),to:str('End date YYYY-MM-DD'),network:{type:'string',enum:['base','solana'],default:'base'}},['from']),
 tool('propose_macro_indicators','Propose a paid FRED indicators request ($0.01 USDC).',{series:str('Comma-separated FRED series IDs',{default:'DFF,DGS10,CPIAUCSL,UNRATE'}),network:{type:'string',enum:['base','solana'],default:'base'}},['series'])
];
function response(id,result){return {jsonrpc:'2.0',id,result:Object.assign({},result,{resultType:'complete'})};}
function errorResponse(id,code,message){return {jsonrpc:'2.0',id,error:{code,message}};}
function resultText(value){return {content:[{type:'text',text:JSON.stringify(value,null,2)}],structuredContent:value,isError:false};}
function obj(v,label){if(v===undefined||v===null)return {};if(typeof v!=='object'||Array.isArray(v))throw new Error(label+' must be a JSON object.');return v;}
function makeProposal(path,query,network){
 const route=routeRows.find(r=>r[0]===path);if(!route)throw new Error('Endpoint is not allowlisted.');
 const params=obj(query,'query');const examples=route[3];const allowed=new Set(Object.keys(examples));const optional=new Set(['limit','page','from','to','period','asset','exchange','name','symbol','cik','query','company','series']);
 Object.keys(params).forEach(k=>{if(allowed.size?!allowed.has(k)&&!optional.has(k):!optional.has(k))throw new Error('Unsupported query parameter: '+k);});
 (requiredParams[path]||[]).forEach(k=>{if(params[k]===undefined||String(params[k]).trim()==='')throw new Error('Missing required query parameter: '+k);});
 if(network!=='base'&&network!=='solana')throw new Error('network must be base or solana.');
 if(params.period!==undefined&&!/^[1-9][0-9]{0,2}d$/.test(String(params.period)))throw new Error('period must look like 7d or 30d.');
 let targetPath=path;if(path==='/api/etf/[asset]'){const asset=String(params.asset||'').toUpperCase();if(!/^[A-Z0-9]{2,10}$/.test(asset))throw new Error('asset must be an uppercase symbol such as BTC.');targetPath='/api/etf/'+encodeURIComponent(asset);delete params.asset;}
 const url=new URL(targetPath,BASE_URL);Object.keys(params).forEach(k=>url.searchParams.set(k,String(params[k])));
 return {'io.paybox/transactionProposal':{version:'1',kind:'x402',expiresAt:new Date(Date.now()+240000).toISOString(),chain:network==='base'?'eip155:8453':'solana:mainnet',request:{url:url.toString(),method:'GET'},payment:{asset:network==='base'?USDC_BASE:USDC_SOLANA,maxAmount:String(Math.round(route[1]*1000000))}},endpoint:path,stated_price_usd:route[1],network,note:'Proposal only; PayBox must validate the live HTTP 402 challenge and obtain approval. No payment was made by this tool.'};
}
async function getJson(url){const r=await fetch(url,{headers:{accept:'application/json'},redirect:'error'});const t=await r.text();let data;try{data=JSON.parse(t);}catch{data={raw:t.slice(0,12000)};}if(!r.ok)throw new Error('API returned HTTP '+r.status+': '+JSON.stringify(data).slice(0,1800));return data;}
async function call(name,args){
 args=obj(args,'Tool arguments');
 if(name==='get_api_health')return getJson(BASE_URL+'/api/health');
 if(name==='get_openapi_spec')return getJson(BASE_URL+'/openapi.json');
 if(name==='list_research_endpoints')return {base_url:BASE_URL,payment_protocol:'x402 v2',networks:['Base USDC (eip155:8453)','Solana USDC (solana:mainnet)'],endpoints:routeRows.map(r=>({path:r[0],method:'GET',description:r[2],price_usd:r[1],required_query_parameters:requiredParams[r[0]]||[],example_query:r[3]})),note:'The live HTTP 402 challenge is authoritative before payment.'};
 if(name==='propose_paid_research')return makeProposal(args.endpoint,args.query,args.network||'base');
 if(name==='propose_etf_summary')return makeProposal('/api/etf/summary',{},args.network||'base');
 if(name==='propose_etf_flows')return makeProposal('/api/etf/flows',{asset:args.asset||'BTC',period:args.period||'30d'},args.network||'base');
 if(name==='propose_etf_fund_flows')return makeProposal('/api/etf/fund-flows',{asset:args.asset||'BTC'},args.network||'base');
 if(name==='propose_etf_funds')return makeProposal('/api/etf/funds',{asset:args.asset||'BTC'},args.network||'base');
 if(name==='propose_etf_prices')return makeProposal('/api/etf/prices',{},args.network||'base');
 if(name==='propose_macro_calendar')return makeProposal('/api/macro/calendar',{from:args.from,...(args.to?{to:args.to}:{})},args.network||'base');
 if(name==='propose_macro_indicators')return makeProposal('/api/macro/indicators',{series:args.series||'DFF,DGS10,CPIAUCSL,UNRATE'},args.network||'base');
 throw new Error('Unknown tool: '+name);
}
async function dispatch(m){const id=m&&m.id,method=m&&m.method,params=(m&&m.params)||{};if(method==='initialize')return response(id,{protocolVersion:params.protocolVersion||'2024-11-05',capabilities:{tools:{listChanged:false}},serverInfo:{name:'x402-etf-macro-intelligence',version:'1.1.0'}});if(method==='ping')return response(id,{});if(method==='tools/list')return response(id,{tools});if(method==='tools/call'){try{return response(id,resultText(await call(params.name,params.arguments||{})));}catch(e){return response(id,{content:[{type:'text',text:e instanceof Error?e.message:'Tool failed'}],isError:true,resultType:'complete'});}}if(method==='resources/list')return response(id,{resources:[]});if(method==='prompts/list')return response(id,{prompts:[]});if(method&&method.startsWith('notifications/'))return null;return errorResponse(id===undefined?null:id,-32601,'Method not found: '+method);}
let buffer='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{buffer+=chunk;if(buffer.length>1048576){process.stderr.write('Input buffer exceeded 1 MiB.\n');process.exit(1);}let i;while((i=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,i).trim();buffer=buffer.slice(i+1);if(!line)continue;(async()=>{let m;try{m=JSON.parse(line);}catch{process.stdout.write(JSON.stringify(errorResponse(null,-32700,'Parse error'))+'\n');return;}if(m.id===undefined&&m.method&&m.method.startsWith('notifications/'))return;const out=await dispatch(m);if(out)process.stdout.write(JSON.stringify(out)+'\n');})().catch(e=>process.stderr.write('Dispatch error: '+(e&&e.message||'unknown')+'\n'));}});
process.stdin.on('end',()=>{if(buffer.trim())process.stderr.write('Ignored incomplete final JSON line.\n');});
