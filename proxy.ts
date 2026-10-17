import { NextResponse, type NextRequest } from "next/server";
import { HTTPFacilitatorClient, x402ResourceServer, type RoutesConfig } from "@x402/core/server";

// x402scan requires Bazaar discovery metadata in the live HTTP 402 challenge;
// OpenAPI parameters alone are not enough for its endpoint-level registration probe.
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
  { path: "/api/macro/calendar", price: "$0.01", description: "Economic calendar", queryParams: { from: "2026-01-01", to: "2026-01-31" } },
  { path: "/api/macro/indicators", price: "$0.01", description: "FRED macro indicators", queryParams: { series: "DFF,DGS10,CPIAUCSL,UNRATE" } },
  { path: "/api/bea/gdp", price: "$0.01", description: "BEA GDP data", queryParams: { year: "2026" } },
  { path: "/api/bea/inflation", price: "$0.01", description: "BEA PCE inflation", queryParams: { year: "2026" } },
  { path: "/api/bea/personal-income", price: "$0.01", description: "BEA personal income", queryParams: { year: "2026" } },
  { path: "/api/bea/corporate-profits", price: "$0.01", description: "BEA corporate profits", queryParams: { year: "2026" } },
  { path: "/api/bea/trade", price: "$0.01", description: "BEA trade data", queryParams: { year: "2026", indicator: "BalGds" } },
  { path: "/api/bea/international-investment", price: "$0.01", description: "BEA international investment", queryParams: { year: "2026" } },
  { path: "/api/bea/gdp-by-industry", price: "$0.01", description: "BEA GDP by industry", queryParams: { year: "2026", tableid: "1", frequency: "A", industry: "ALL" } },
  { path: "/api/bea/regional", price: "$0.01", description: "BEA regional data", queryParams: { year: "2026", geofips: "00000", linecode: "1" } }
];

const requiredQueryParams: Record<string, string[]> = {
  "/api/etf/flows": ["asset"],
  "/api/etf/fund-flows": ["asset"],
  "/api/etf/funds": ["asset"],
  "/api/macro/calendar": ["from"],
  "/api/macro/indicators": ["series"],
};

function makeBazaarExtension(route: (typeof routeDefinitions)[number]) {
  const exampleQueryParams = route.queryParams ?? {};
  const requiredParams = requiredQueryParams[route.path] ?? [];
  const queryParamProperties = Object.fromEntries(
    Object.entries(exampleQueryParams).map(([name, example]) => [
      name,
      { type: "string", description: `Example value: ${example}` }
    ])
  );
  const inputSchema = {
    type: "object",
    properties: {
      type: { type: "string", const: "http" },
      method: { type: "string", const: "GET" },
      queryParams: {
        type: "object",
        properties: queryParamProperties,
        additionalProperties: { type: "string" },
        ...(requiredParams.length ? { required: requiredParams } : {})
      }
    },
    required: ["type", "method", "queryParams"],
    additionalProperties: false
  };
  return {
    bazaar: {
      info: {
        input: {
          type: "http",
          method: "GET",
          queryParams: exampleQueryParams
        },
        output: {
          type: "json",
          example: {
            success: true,
            data: [],
            endpoint: route.path
          }
        }
      },
      schema: {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        type: "object",
        properties: {
          input: inputSchema,
          output: {
            type: "object",
            properties: {
              type: { type: "string", const: "json" },
              example: {}
            },
            required: ["type"],
            additionalProperties: false
          }
        },
        required: ["input", "output"],
        additionalProperties: false
      }
    }
  };
}

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
      extensions: makeBazaarExtension(route),
    }];
  })) as unknown as RoutesConfig;
}

const routes = makeRouteConfig();
let paidMiddleware: ((request: NextRequest) => Promise<Response> | Response) | null = null;
if (routes) {
  const facilitator = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
  const server = new x402ResourceServer(facilitator);
  if (BASE_PAY_TO) registerExactEvmScheme(server);
  if (SOLANA_PAY_TO) registerExactSvmScheme(server);
  // Next.js 16 uses proxy.ts (middleware.ts must not exist). Payment verification uses PayAI.
  paidMiddleware = async (request: NextRequest) => {
    const { paymentProxy } = await import("@x402/next");
    return paymentProxy(routes, server)(request);
  };
}

export async function proxy(request: NextRequest) {
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
