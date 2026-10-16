import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

function validDate(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)));
}

export async function GET(request: Request) {
  const key = process.env.FMP_API_KEY;
  if (!key) {
    return jsonError(503, "api_key_required", "Set FMP_API_KEY in Vercel to enable live economic calendar data.", {
      provider: "Financial Modeling Prep",
      signup_url: "https://site.financialmodelingprep.com/developer/docs",
    });
  }

  const url = new URL(request.url);
  const today = new Date();
  const defaultFrom = today.toISOString().slice(0, 10);
  const defaultToDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const defaultTo = defaultToDate.toISOString().slice(0, 10);
  const from = url.searchParams.get("from") || defaultFrom;
  const to = url.searchParams.get("to") || defaultTo;
  const country = url.searchParams.get("country");

  if (!validDate(from) || !validDate(to) || Date.parse(to) < Date.parse(from)) {
    return jsonError(400, "invalid_date_range", "Use valid YYYY-MM-DD dates; to must be on or after from.");
  }
  const days = (Date.parse(to) - Date.parse(from)) / 86400000;
  if (days > 90) return jsonError(400, "date_range_too_large", "The economic calendar supports at most a 90-day date range.");

  const upstream = new URL("https://financialmodelingprep.com/stable/economic-calendar");
  upstream.searchParams.set("from", from);
  upstream.searchParams.set("to", to);
  upstream.searchParams.set("apikey", key);
  if (country) upstream.searchParams.set("country", country);

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return jsonError(response.status === 401 || response.status === 403 ? 502 : response.status, "economic_calendar_provider_error", "Financial Modeling Prep returned an error. Check the API key and plan access.", {
        provider: "Financial Modeling Prep",
        provider_status: response.status,
        details: payload,
      });
    }
    return jsonOk({ source: "Financial Modeling Prep", retrieved_at: new Date().toISOString(), range: { from, to, country: country || "all" }, data: payload }, 300);
  } catch {
    return jsonError(502, "provider_unreachable", "Could not reach the economic calendar provider.", { provider: "Financial Modeling Prep" });
  }
}
