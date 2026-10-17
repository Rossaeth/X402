import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

const supported: Record<string, string> = {
  DFF: "Federal Funds Effective Rate",
  DGS10: "10-Year Treasury Constant Maturity Rate",
  CPIAUCSL: "Consumer Price Index for All Urban Consumers",
  PCEPI: "Personal Consumption Expenditures Price Index",
  UNRATE: "Unemployment Rate",
  GDP: "Gross Domestic Product",
};

type FredObservation = { date: string; value: string; realtime_start?: string; realtime_end?: string };

export async function GET(request: Request) {
  const key = process.env.FRED_API_KEY?.trim();
  if (!key) {
    return jsonError(503, "api_key_required", "FRED_API_KEY is missing in the deployed environment.", {
      provider: "FRED",
      signup_url: "https://fred.stlouisfed.org/docs/api/api_key.html",
      supported_series: supported,
    });
  }

  const url = new URL(request.url);
  const rawSeries = url.searchParams.get("series") || "DFF,DGS10,CPIAUCSL,UNRATE";
  const requested = [...new Set(rawSeries.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean))];
  if (requested.length === 0) {
    return jsonError(400, "missing_series", "Provide at least one FRED series ID in the series query parameter.", {
      example: "/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,UNRATE",
      supported_series: supported,
    });
  }

  const invalid = requested.filter((series) => !supported[series]);
  if (invalid.length) {
    return jsonError(400, "unsupported_series", "One or more series are not supported.", {
      invalid,
      supported_series: supported,
    });
  }

  try {
    const results = await Promise.all(requested.map(async (series) => {
      const upstream = new URL("https://api.stlouisfed.org/fred/series/observations");
      upstream.searchParams.set("series_id", series);
      upstream.searchParams.set("api_key", key);
      upstream.searchParams.set("file_type", "json");
      upstream.searchParams.set("sort_order", "desc");
      upstream.searchParams.set("limit", "2");

      const response = await fetch(upstream, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      const payload = await response.json().catch(() => null) as
        | { observations?: FredObservation[]; error_code?: number; error_message?: string }
        | null;

      if (!response.ok || !Array.isArray(payload?.observations)) {
        throw new Error(
          `FRED rejected series ${series} (HTTP ${response.status})${payload?.error_message ? `: ${payload.error_message}` : ""}`,
        );
      }

      const observations = payload.observations
        .filter((item) => item.value !== ".")
        .map((item) => ({ date: item.date, value: Number(item.value), realtime_start: item.realtime_start, realtime_end: item.realtime_end }))
        .filter((item) => Number.isFinite(item.value));

      return { series, name: supported[series], status: "ok", observations };
    }));

    return jsonOk({
      source: "FRED",
      source_url: "https://fred.stlouisfed.org/",
      retrieved_at: new Date().toISOString(),
      requested_series: requested,
      data: results,
    }, 3600);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown FRED provider error";
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    return jsonError(502, isTimeout ? "fred_timeout" : "fred_provider_error",
      isTimeout ? "FRED did not respond within 10 seconds. Try again shortly." : "FRED API request failed. Check that FRED_API_KEY is valid and enabled.",
      { provider: "FRED", details: message });
  }
}
