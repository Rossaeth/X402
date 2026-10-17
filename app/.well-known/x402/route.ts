import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const resources = [
  "https://x402-sand.vercel.app/api/etf/summary",
  "https://x402-sand.vercel.app/api/etf/flows",
  "https://x402-sand.vercel.app/api/etf/fund-flows",
  "https://x402-sand.vercel.app/api/etf/funds",
  "https://x402-sand.vercel.app/api/etf/cefi",
  "https://x402-sand.vercel.app/api/etf/prices",
  "https://x402-sand.vercel.app/api/etf/weekly",
  "https://x402-sand.vercel.app/api/etf/tickers",
  "https://x402-sand.vercel.app/api/fmp/commodities-list",
  "https://x402-sand.vercel.app/api/fmp/biggest-gainers",
  "https://x402-sand.vercel.app/api/fmp/biggest-losers",
  "https://x402-sand.vercel.app/api/fmp/most-actives",
  "https://x402-sand.vercel.app/api/fmp/exchange-market-hours",
  "https://x402-sand.vercel.app/api/fmp/holidays-by-exchange",
  "https://x402-sand.vercel.app/api/fmp/all-exchange-market-hours",
  "https://x402-sand.vercel.app/api/fmp/economics",
  "https://x402-sand.vercel.app/api/fmp/treasury-rates",
  "https://x402-sand.vercel.app/api/fmp/economic-indicators",
  "https://x402-sand.vercel.app/api/fmp/market-risk-premium",
  "https://x402-sand.vercel.app/api/fmp/profile-cik",
  "https://x402-sand.vercel.app/api/fmp/stock-peers",
  "https://x402-sand.vercel.app/api/fmp/search-name",
  "https://x402-sand.vercel.app/api/fmp/financial-reports-dates",
  "https://x402-sand.vercel.app/api/fmp/sec-filings-company-search/name",
  "https://x402-sand.vercel.app/api/fmp/sec-filings-company-search/symbol",
  "https://x402-sand.vercel.app/api/fmp/sec-filings-company-search/cik",
  "https://x402-sand.vercel.app/api/fmp/sec-profile",
  "https://x402-sand.vercel.app/api/fmp/standard-industrial-classification-list",
  "https://x402-sand.vercel.app/api/fmp/crowdfunding-offerings-latest",
  "https://x402-sand.vercel.app/api/fmp/crowdfunding-offerings-search",
  "https://x402-sand.vercel.app/api/fmp/crowdfunding-offerings",
  "https://x402-sand.vercel.app/api/fmp/fundraising-latest",
  "https://x402-sand.vercel.app/api/fmp/fundraising-search",
  "https://x402-sand.vercel.app/api/fmp/fundraising",
  "https://x402-sand.vercel.app/api/macro/calendar",
  "https://x402-sand.vercel.app/api/macro/indicators",
  "https://x402-sand.vercel.app/api/bea/gdp",
  "https://x402-sand.vercel.app/api/bea/inflation",
  "https://x402-sand.vercel.app/api/bea/personal-income",
  "https://x402-sand.vercel.app/api/bea/corporate-profits",
  "https://x402-sand.vercel.app/api/bea/trade",
  "https://x402-sand.vercel.app/api/bea/international-investment",
  "https://x402-sand.vercel.app/api/bea/gdp-by-industry",
  "https://x402-sand.vercel.app/api/bea/regional"
];

export async function GET() {
  return NextResponse.json({
    version: 1,
    resources,
    instructions: "OpenAPI: https://x402-sand.vercel.app/openapi.json. Paid resources must return valid x402 v2 HTTP 402 challenges after payment middleware is enabled.",
  }, { headers: { "Cache-Control": "public, s-maxage=300" } });
}
