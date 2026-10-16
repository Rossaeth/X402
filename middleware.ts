import { NextResponse, type NextRequest } from "next/server";
import { paymentProxy } from "@x402/next";
import { createCdpFacilitatorClient } from "@coinbase/cdp-sdk/x402";
import { HTTPFacilitatorClient, x402ResourceServer, type RoutesConfig } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { registerExactSvmScheme } from "@x402/svm/exact/server";

const BASE_PAY_TO = process.env.BASE_PAY_TO || process.env.X402_BASE_PAY_TO;
const SOLANA_PAY_TO = process.env.SOLANA_PAY_TO || process.env.X402_SOLANA_PAY_TO;
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || "https://facilitator.payai.network";
const BASE_NETWORK = "eip155:8453";
const SOLANA_NETWORK = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

const routeDefinitions: Array<{ path: string; price: string; description: string; queryParams?: Record<string, string> }> = [
  { path: "/api/etf/summary", price: "$0.02", description: "Crypto ETF flow summary" },
  { path: "/api/etf/flows", price: "$0.02", description: "Crypto ETF flows by asset", queryParams: { asset: "BTC", period: "30d" } },
  { path: "/api/etf/fund-flows", price: "$0.02", description: "Crypto ETF fund-level flows", queryParams: { asset: "BTC" } },
  { path: "/api/etf/funds", price: "$0.02", description: "Crypto ETF funds", queryParams: { asset: "BTC" } },
  { path: "/api/etf/cefi", price: "$0.02", description: "CeFi index data" },
  { path: "/api/etf/prices", price: "$0.02", description: "Crypto ETF prices" },
  { path: "/api/etf/weekly", price: "$0.02", description: "Weekly ETF analytics" },
  { path: "/api/etf/tickers", price: "$0.02", description: "Supported ETF tickers" },
  { path: "/api/fmp/commodities-list", price: "$0.01", description: "FMP commodities list" },
  { path: "/api/fmp/biggest-gainers", price: "$0.01", description: "Biggest market gainers" },
  { path: "/api/fmp/biggest-losers", price: "$0.01", description: "Biggest market losers" },
  { path: "/api/fmp/most-actives", price: "$0.01", description: "Most actively traded stocks" },
  { path: "/api/fmp/exchange-market-hours", price: "$0.01", description: "Exchange market hours", queryParams: { exchange: "NASDAQ" } },
  { path: "/api/fmp/holidays-by-exchange", price: "$0.01", description: "Exchange holidays", queryParams: { exchange: "NASDAQ", from: "2026-01-01", to: "2026-03-31" } },
  { path: "/api/fmp/all-exchange-market-hours", price: "$0.01", description: "Market hours for all exchanges" },
  { path: "/api/fmp/economics", price: "$0.01", description: "FMP economics data" },
  { path: "/api/fmp/treasury-rates", price: "$0.01", description: "Treasury rates" },
  { path: "/api/fmp/economic-indicators", price: "$0.01", description: "Economic indicators", queryParams: { name: "GDP" } },
  { path: "/api/fmp/market-risk-premium", price: "$0.01", description: "Market risk premium" },
  { path: "/api/fmp/profile-cik", price: "$0.01", description: "Company profile by CIK", queryParams: { cik: "0000320193" } },
  { path: "/api/fmp/stock-peers", price: "$0.01", description: "Comparable stocks", queryParams: { symbol: "AAPL" } },
  { path: "/api/fmp/search-name", price: "$0.01", description: "Search companies by name", queryParams: { query: "Apple" } },
  { path: "/api/fmp/financial-reports-dates", price: "$0.01", description: "Financial report dates", queryParams: { symbol: "AAPL" } },
  { path: "/api/fmp/sec-filings-company-search/name", price: "$0.01", description: "Search SEC companies by name", queryParams: { company: "Berkshire" } },
  { path: "/api/fmp/sec-filings-company-search/symbol", price: "$0.01", description: "Search SEC companies by ticker", queryParams: { symbol: "AAPL" } },
  { path: "/api/fmp/sec-filings-company-search/cik", price: "$0.01", description: "Search SEC companies by CIK", queryParams: { cik: "0000320193" } },
  { path: "/api/fmp/sec-profile", price: "$0.01", description: "SEC company profile", queryParams: { symbol: "AAPL" } },
  { path: "/api/fmp/standard-industrial-classification-list", price: "$0.01", description: "Industrial classification list" },
  { path: "/api/fmp/crowdfunding-offerings-latest", price: "$0.01", description: "Latest crowdfunding offerings", queryParams: { page: "0", limit: "20" } },
  { path: "/api/fmp/crowdfunding-offerings-search", price: "$0.01", description: "Search crowdfunding offerings", queryParams: { name: "enotap" } },
  { path: "/api/fmp/crowdfunding-offerings", price: "$0.01", description: "Crowdfunding offerings by CIK", queryParams: { cik: "0001916078" } },
  { path: "/api/fmp/fundraising-latest", price: "$0.01", description: "Latest fundraising data", queryParams: { page: "0", limit: "10" } },
  { path: "/api/fmp/fundraising-search", price: "$0.01", description: "Search fundraising data", queryParams: { name: "NJOY" } },
  { path: "/api/fmp/fundraising", price: "$0.01", description: "Fundraising data by CIK", queryParams: { cik: "0001547416" } },
  { path: "/api/macro/calendar", price: "$0.01", description: "Economic calendar", queryParams: { from: "2026-01-01", to: "2026-01-31" } },
  { path: "/api/macro/indicators", price: "$0.01", description: "FRED macro indicators", queryParams: { series: "DFF,DGS10,CPIAUCSL,UNRATE" } }
];

const requiredQueryParams: Record<string, string[]> = {
  "/api/fmp/profile-cik": ["cik"],
  "/api/fmp/stock-peers": ["symbol"],
  "/api/fmp/search-name": ["query"],
  "/api/fmp/financial-reports-dates": ["symbol"],
  "/api/fmp/sec-filings-company-search/name": ["company"],
  "/api/fmp/sec-filings-company-search/symbol": ["symbol"],
  "/api/fmp/sec-filings-company-search/cik": ["cik"],
  "/api/fmp/sec-profile": ["symbol"],
  "/api/fmp/crowdfunding-offerings-search": ["name"],
  "/api/fmp/crowdfunding-offerings": ["cik"],
  "/api/fmp/fundraising-search": ["name"],
  "/api/fmp/fundraising": ["cik"],
  "/api/fmp/exchange-market-hours": ["exchange"],
  "/api/fmp/holidays-by-exchange": ["exchange", "from", "to"],
  "/api/fmp/economic-indicators": ["name"]
};

function makeRouteConfig() {
  if (!BASE_PAY_TO && !SOLANA_PAY_TO) return null;
  return Object.fromEntries(routeDefinitions.map((route) => {
    const accepts = [
      ...(BASE_PAY_TO ? [{ scheme: "exact", price: route.price, network: BASE_NETWORK, payTo: BASE_PAY_TO }] : []),
      ...(SOLANA_PAY_TO ? [{ scheme: "exact", price: route.price, network: SOLANA_NETWORK, payTo: SOLANA_PAY_TO }] : [])
    ];
    return [route.path, {
      accepts,
      description: route.description,
      mimeType: "application/json",
      extensions: {
        bazaar: {
          info: {
            input: { type: "http", method: "GET", queryParams: route.queryParams || {} },
            output: { type: "json" }
          },
          schema: {
            type: "object",
            properties: Object.fromEntries(Object.keys(route.queryParams || {}).map((key) => [key, { type: "string" }])),
            required: Object.keys(route.queryParams || {}),
            additionalProperties: false
          }
        }
      }
    }];
  })) as unknown as RoutesConfig;
}

const routes = makeRouteConfig();
let paidMiddleware: ((request: NextRequest) => Promise<Response> | Response) | null = null;
if (routes) {
  const hasCdpCredentials = Boolean(process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET);
  // x402ResourceServer accepts one facilitator client. Prefer the authenticated CDP facilitator when configured; otherwise use PayAI.
  const facilitator = hasCdpCredentials
    ? createCdpFacilitatorClient()
    : new HTTPFacilitatorClient({ url: FACILITATOR_URL });
  const server = new x402ResourceServer(facilitator);
  if (BASE_PAY_TO) registerExactEvmScheme(server);
  if (SOLANA_PAY_TO) registerExactSvmScheme(server);
  paidMiddleware = paymentProxy(routes, server);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/api/health" || path.startsWith("/_next/") || path === "/openapi.json" || path.startsWith("/.well-known/")) {
    return NextResponse.next();
  }
  if (!routeDefinitions.some((route) => route.path === path)) return NextResponse.next();
  if (!routes || !paidMiddleware) {
    return NextResponse.json({ error: { code: "x402_not_configured", message: "Set BASE_PAY_TO and/or SOLANA_PAY_TO before enabling paid API routes." } }, { status: 503 });
  }
  return await paidMiddleware(request);
}

export const config = {
  matcher: ["/api/:path*"]
};
