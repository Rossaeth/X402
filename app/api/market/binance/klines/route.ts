import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
const intervals = new Set(["1m","3m","5m","15m","30m","1h","2h","4h","6h","8h","12h","1d","3d","1w","1M"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = (url.searchParams.get("symbol") || "BTCUSDT").toUpperCase();
  const interval = url.searchParams.get("interval") || "1h";
  const limit = Number(url.searchParams.get("limit") || "100");
  if (!/^[A-Z0-9]{5,20}$/.test(symbol)) return jsonError(400, "invalid_symbol", "Invalid symbol.");
  if (!intervals.has(interval)) return jsonError(400, "invalid_interval", "Unsupported candlestick interval.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) return jsonError(400, "invalid_limit", "limit must be between 1 and 1000.");
  try {
    const endpoint = new URL("https://data-api.binance.vision/api/v3/klines");
    endpoint.searchParams.set("symbol", symbol);
    endpoint.searchParams.set("interval", interval);
    endpoint.searchParams.set("limit", String(limit));
    const headers: HeadersInit = {};
    if (process.env.BINANCE_API_KEY) headers["X-MBX-APIKEY"] = process.env.BINANCE_API_KEY;
    const response = await fetch(endpoint, { headers, next: { revalidate: 15 } });
    if (!response.ok) return jsonError(502, "binance_provider_error", "Binance returned a non-success status.", { provider_status: response.status });
    const rows = await response.json();
    const candles = rows.map((r: (string | number)[]) => ({ open_time: r[0], open: r[1], high: r[2], low: r[3], close: r[4], volume: r[5], close_time: r[6], quote_volume: r[7], trades: r[8], taker_buy_base_volume: r[9], taker_buy_quote_volume: r[10] }));
    return jsonOk({ source: "Binance Spot Market Data", symbol, interval, data_type: "candlesticks_not_etf_flows", retrieved_at: new Date().toISOString(), candles }, 15);
  } catch {
    return jsonError(502, "binance_unreachable", "Unable to retrieve Binance candlestick data.");
  }
}