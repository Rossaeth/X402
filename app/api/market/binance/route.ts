import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = (url.searchParams.get("symbols") || "BTCUSDT,ETHUSDT").toUpperCase();
  const symbols = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];
  if (!symbols.length || symbols.length > 10 || symbols.some((s) => !/^[A-Z0-9]{5,20}$/.test(s))) {
    return jsonError(400, "invalid_symbols", "Provide 1-10 comma-separated Binance symbols, e.g. BTCUSDT,ETHUSDT.");
  }
  try {
    const headers: HeadersInit = {};
    if (process.env.BINANCE_API_KEY) headers["X-MBX-APIKEY"] = process.env.BINANCE_API_KEY;
    const data = await Promise.all(symbols.map(async (symbol) => {
      const endpoint = new URL("https://data-api.binance.vision/api/v3/ticker/24hr");
      endpoint.searchParams.set("symbol", symbol);
      const response = await fetch(endpoint, { headers, next: { revalidate: 10 } });
      if (!response.ok) return { symbol, status: "provider_error", provider_status: response.status };
      const d = await response.json();
      return { symbol: d.symbol, status: "ok", price_change: d.priceChange, price_change_percent: d.priceChangePercent, weighted_avg_price: d.weightedAvgPrice, last_price: d.lastPrice, open_price: d.openPrice, high_price: d.highPrice, low_price: d.lowPrice, volume: d.volume, quote_volume: d.quoteVolume, open_time: d.openTime, close_time: d.closeTime, count: d.count };
    }));
    return jsonOk({ source: "Binance Spot Market Data", source_url: "https://developers.binance.com/en/docs/products/spot/rest-api", data_type: "exchange_market_data_not_etf_fund_flows", retrieved_at: new Date().toISOString(), data }, 10);
  } catch {
    return jsonError(502, "binance_unreachable", "Unable to retrieve Binance public market data.");
  }
}