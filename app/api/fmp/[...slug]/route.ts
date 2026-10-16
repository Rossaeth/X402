import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

type EndpointConfig = {
  upstream: string;
  required: string[];
  allowed: string[];
};

const endpoints: Record<string, EndpointConfig> = {
  "biggest-gainers": { upstream: "biggest-gainers", required: [], allowed: [] },
  "biggest-losers": { upstream: "biggest-losers", required: [], allowed: [] },
  "most-actives": { upstream: "most-actives", required: [], allowed: [] },
  "exchange-market-hours": { upstream: "exchange-market-hours", required: ["exchange"], allowed: ["exchange"] },
  "holidays-by-exchange": { upstream: "holidays-by-exchange", required: ["exchange", "from", "to"], allowed: ["exchange", "from", "to"] },
  "all-exchange-market-hours": { upstream: "all-exchange-market-hours", required: [], allowed: [] },
  economics: { upstream: "economics", required: [], allowed: ["from", "to"] },
  "treasury-rates": { upstream: "treasury-rates", required: [], allowed: ["from", "to"] },
  "economic-indicators": { upstream: "economic-indicators", required: ["name"], allowed: ["name", "from", "to"] },
  "market-risk-premium": { upstream: "market-risk-premium", required: [], allowed: ["country"] },
  "profile-cik": { upstream: "profile-cik", required: ["cik"], allowed: ["cik"] },
  "stock-peers": { upstream: "stock-peers", required: ["symbol"], allowed: ["symbol"] },
  "search-name": { upstream: "search-name", required: ["query"], allowed: ["query", "limit", "exchange"] },
  "financial-reports-dates": { upstream: "financial-reports-dates", required: ["symbol"], allowed: ["symbol"] },
  "sec-filings-company-search/name": { upstream: "sec-filings-company-search/name", required: ["company"], allowed: ["company"] },
  "sec-filings-company-search/symbol": { upstream: "sec-filings-company-search/symbol", required: ["symbol"], allowed: ["symbol"] },
  "sec-filings-company-search/cik": { upstream: "sec-filings-company-search/cik", required: ["cik"], allowed: ["cik"] },
  "sec-profile": { upstream: "sec-profile", required: ["symbol"], allowed: ["symbol", "cik"] },
  "standard-industrial-classification-list": { upstream: "standard-industrial-classification-list", required: [], allowed: ["industryTitle", "sicCode"] },
  "crowdfunding-offerings-latest": { upstream: "crowdfunding-offerings-latest", required: [], allowed: ["page", "limit"] },
  "crowdfunding-offerings-search": { upstream: "crowdfunding-offerings-search", required: ["name"], allowed: ["name"] },
  "crowdfunding-offerings": { upstream: "crowdfunding-offerings", required: ["cik"], allowed: ["cik"] },
  "fundraising-latest": { upstream: "fundraising-latest", required: [], allowed: ["page", "limit", "cik"] },
  "fundraising-search": { upstream: "fundraising-search", required: ["name"], allowed: ["name"] },
  fundraising: { upstream: "fundraising", required: ["cik"], allowed: ["cik"] },
};

export async function GET(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const endpointKey = slug.join("/");
  const config = endpoints[endpointKey];
  if (!config) {
    return jsonError(404, "unknown_fmp_endpoint", "This FMP endpoint is not enabled on this gateway.", {
      available_endpoints: Object.keys(endpoints),
    });
  }

  const key = process.env.FMP_API_KEY;
  if (!key) {
    return jsonError(503, "api_key_required", "Set FMP_API_KEY in Vercel to enable FMP endpoints.", {
      provider: "Financial Modeling Prep",
      signup_url: "https://site.financialmodelingprep.com/developer/docs",
    });
  }

  const incoming = new URL(request.url);
  for (const name of config.required) {
    if (!incoming.searchParams.get(name)?.trim()) {
      return jsonError(400, "missing_parameter", `Missing required query parameter: ${name}`, {
        endpoint: endpointKey,
        required: config.required,
      });
    }
  }

  const upstream = new URL(`https://financialmodelingprep.com/stable/${config.upstream}`);
  for (const name of config.allowed) {
    const value = incoming.searchParams.get(name);
    if (value !== null && value.trim() !== "") upstream.searchParams.set(name, value.trim());
  }
  if (upstream.searchParams.has("from") || upstream.searchParams.has("to")) {
    const from = upstream.searchParams.get("from");
    const to = upstream.searchParams.get("to");
    const datePattern = /^\\d{4}-\\d{2}-\\d{2}$/;
    if ((from && !datePattern.test(from)) || (to && !datePattern.test(to))) {
      return jsonError(400, "invalid_date", "Dates must use YYYY-MM-DD format.");
    }
    if (from && to) {
      const fromTime = Date.parse(from);
      const toTime = Date.parse(to);
      if (!Number.isFinite(fromTime) || !Number.isFinite(toTime) || toTime < fromTime) {
        return jsonError(400, "invalid_date_range", "to must be a valid date on or after from.");
      }
      if ((toTime - fromTime) / 86400000 > 90) {
        return jsonError(400, "date_range_too_large", "Date range must not exceed 90 days.");
      }
    }
  }
  if (upstream.searchParams.has("limit")) {
    const limit = Number(upstream.searchParams.get("limit"));
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return jsonError(400, "invalid_limit", "limit must be an integer between 1 and 100.");
    }
  }
  if (upstream.searchParams.has("page")) {
    const page = Number(upstream.searchParams.get("page"));
    if (!Number.isInteger(page) || page < 0 || page > 100) {
      return jsonError(400, "invalid_page", "page must be an integer between 0 and 100.");
    }
  }
  upstream.searchParams.set("apikey", key);

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return jsonError(
        response.status === 401 || response.status === 403 ? 502 : response.status,
        "fmp_provider_error",
        "Financial Modeling Prep returned an error. Check the API key and plan access.",
        { provider: "Financial Modeling Prep", provider_status: response.status, endpoint: endpointKey, details: payload },
      );
    }
    return jsonOk({
      source: "Financial Modeling Prep",
      endpoint: config.upstream,
      retrieved_at: new Date().toISOString(),
      pricing: { planned_usdc_per_call: "0.01", networks: ["Base", "Solana"], x402_enabled: false },
      data: payload,
    }, 60);
  } catch {
    return jsonError(502, "provider_unreachable", "Could not reach Financial Modeling Prep.", {
      provider: "Financial Modeling Prep",
      endpoint: endpointKey,
    });
  }
}
