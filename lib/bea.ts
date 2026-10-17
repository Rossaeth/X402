import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

type BeaTopic = "gdp" | "inflation" | "personal-income" | "corporate-profits" | "trade" | "international-investment" | "gdp-by-industry" | "regional";

type TopicConfig = {
  dataset: string;
  table?: string;
  frequency?: string;
  description: string;
  defaults?: Record<string, string>;
};

const topics: Record<BeaTopic, TopicConfig> = {
  gdp: { dataset: "NIPA", table: "T10101", frequency: "Q", description: "Real GDP growth and gross domestic product" },
  inflation: { dataset: "NIPA", table: "T20304", frequency: "Q", description: "Personal consumption expenditures price indexes" },
  "personal-income": { dataset: "NIPA", table: "T20100", frequency: "Q", description: "Personal income and its disposition" },
  "corporate-profits": { dataset: "NIPA", table: "T11200", frequency: "Q", description: "National income by type of income, including corporate income" },
  trade: { dataset: "ITA", description: "International transactions and trade-related data", defaults: { Indicator: "BalGds" } },
  "international-investment": { dataset: "IIP", description: "International investment position" },
  "gdp-by-industry": { dataset: "GDPbyIndustry", description: "Gross domestic product and value added by industry", defaults: { TableID: "1", Frequency: "Q", Industry: "ALL" } },
  regional: { dataset: "Regional", table: "CAINC1", description: "Regional personal income and related economic measures", defaults: { GeoFIPS: "00000", LineCode: "1" } }
};

const allowedParameters: Record<string, string> = {
  linecode: "LineCode",
  geofips: "GeoFIPS",
  industry: "Industry",
  indicator: "Indicator",
  areaorcountry: "AreaOrCountry",
  directionofinvestment: "DirectionOfInvestment",
  classification: "Classification",
  component: "Component",
  typeofinvestment: "TypeOfInvestment",
  tableid: "TableID",
  tablename: "TableName",
  frequency: "Frequency"
};

function normalizeYear(value: string | null): string {
  const year = value?.trim();
  // BEA does not support the former LAST2/LAST5 aliases. X asks BEA for all available years.
  if (!year || /^LAST\d+$/i.test(year)) return year?.toUpperCase() === "LAST2" || year?.toUpperCase() === "LAST5" ? "X" : "2026";
  return year;
}

export async function getBeaData(request: Request, topic: BeaTopic) {
  const key = process.env.BEA_API_KEY;
  if (!key) return jsonError(503, "api_key_required", "Set BEA_API_KEY in Vercel to enable BEA data.", {
    provider: "U.S. Bureau of Economic Analysis",
    signup_url: "https://apps.bea.gov/api/signup/"
  });

  const config = topics[topic];
  const input = new URL(request.url);
  const upstream = new URL("https://apps.bea.gov/api/data/");
  upstream.searchParams.set("UserID", key);
  upstream.searchParams.set("method", "GetData");
  upstream.searchParams.set("datasetname", config.dataset);
  upstream.searchParams.set("ResultFormat", "JSON");
  upstream.searchParams.set("Year", normalizeYear(input.searchParams.get("year")));

  const table = input.searchParams.get("table") || config.table;
  if (table) upstream.searchParams.set(config.dataset === "GDPbyIndustry" ? "TableID" : "TableName", table);
  if (config.frequency) upstream.searchParams.set("Frequency", input.searchParams.get("frequency") || config.frequency);

  for (const [queryName, apiName] of Object.entries(allowedParameters)) {
    const value = input.searchParams.get(queryName);
    if (value) upstream.searchParams.set(apiName, value);
  }
  for (const [name, value] of Object.entries(config.defaults ?? {})) {
    if (!upstream.searchParams.has(name)) upstream.searchParams.set(name, value);
  }

  // ITA requires a specific Indicator or AreaOrCountry; do not send both by default.
  if (config.dataset === "ITA" && upstream.searchParams.has("Indicator") && upstream.searchParams.has("AreaOrCountry")) {
    return jsonError(400, "invalid_bea_parameters", "For BEA ITA data, provide either indicator or areaorcountry, not both.", {
      provider: "BEA", parameters: ["indicator", "areaorcountry"]
    });
  }

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    const api = payload?.BEAAPI;
    const result = api?.Results;
    const providerError = api?.Error ?? (result && !Array.isArray(result) ? result?.Error ?? result?.ErrorMsg : null);
    if (!response.ok || providerError || !result) {
      return jsonError(502, "bea_provider_error", "BEA rejected the query or has no data for the requested period. Check dataset parameters and data availability.", {
        provider: "BEA",
        provider_status: response.status,
        details: providerError || result || api || payload
      });
    }
    return jsonOk({
      success: true,
      source: "U.S. Bureau of Economic Analysis",
      topic,
      dataset: config.dataset,
      description: config.description,
      retrieved_at: new Date().toISOString(),
      parameters: Object.fromEntries([...upstream.searchParams.entries()].filter(([name]) => name !== "UserID")),
      data: result
    }, 900);
  } catch {
    return jsonError(502, "bea_provider_unreachable", "Could not reach the BEA API.", { provider: "BEA" });
  }
}
