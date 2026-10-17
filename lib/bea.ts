import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

type BeaTopic = "gdp" | "inflation" | "personal-income" | "corporate-profits" | "trade" | "international-investment" | "gdp-by-industry" | "regional";

const topics: Record<BeaTopic, { dataset: string; table?: string; frequency?: string; description: string }> = {
  gdp: { dataset: "NIPA", table: "T10101", frequency: "Q", description: "Real GDP growth and gross domestic product" },
  inflation: { dataset: "NIPA", table: "T20304", frequency: "Q", description: "Personal consumption expenditures price indexes" },
  "personal-income": { dataset: "NIPA", table: "T20100", frequency: "Q", description: "Personal income and its disposition" },
  "corporate-profits": { dataset: "NIPA", table: "T11200", frequency: "Q", description: "National income by type of income, including corporate income" },
  trade: { dataset: "ITA", description: "International transactions and trade-related data" },
  "international-investment": { dataset: "IIP", description: "International investment position" },
  "gdp-by-industry": { dataset: "GDPbyIndustry", description: "Gross domestic product and value added by industry" },
  regional: { dataset: "Regional", table: "CAINC1", description: "Regional personal income and related economic measures" }
};

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
  upstream.searchParams.set("Year", input.searchParams.get("year") || "LAST5");

  const table = input.searchParams.get("table") || config.table;
  const frequency = input.searchParams.get("frequency") || config.frequency;
  if (table) {
    if (config.dataset === "Regional") upstream.searchParams.set("TableName", table);
    else upstream.searchParams.set("TableName", table);
  }
  if (frequency) upstream.searchParams.set("Frequency", frequency);

  // Dataset-specific filters are forwarded only when explicitly supplied.
  const allowed = ["LineCode", "GeoFIPS", "Industry", "Indicator", "AreaOrCountry", "DirectionOfInvestment", "Classification", "Component", "TypeOfInvestment"];
  for (const name of allowed) {
    const value = input.searchParams.get(name.toLowerCase());
    if (value) upstream.searchParams.set(name, value);
  }

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return jsonError(502, "bea_provider_error", "BEA returned an upstream HTTP error.", {
      provider: "BEA", provider_status: response.status
    });
    const result = payload?.BEAAPI?.Results;
    const errors = payload?.BEAAPI?.Error;
    if (errors || !result) return jsonError(502, "bea_provider_error", "BEA rejected the query. Check the API key and dataset-specific parameters.", {
      provider: "BEA", details: errors || payload?.BEAAPI
    });
    return jsonOk({
      success: true, source: "U.S. Bureau of Economic Analysis", topic,
      dataset: config.dataset, description: config.description,
      retrieved_at: new Date().toISOString(),
      parameters: Object.fromEntries([...upstream.searchParams.entries()].filter(([name]) => name !== "UserID")),
      data: result
    }, 900);
  } catch {
    return jsonError(502, "bea_provider_unreachable", "Could not reach the BEA API.", { provider: "BEA" });
  }
}
