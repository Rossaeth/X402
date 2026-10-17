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
