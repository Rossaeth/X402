import { jsonError } from "@/lib/http";
import { proxyCryptoEtf } from "@/lib/cryptoetf";

export const dynamic = "force-dynamic";
const supported = ["btc","eth","sol","xrp","hyp","doge","link","avax","hbar","ltc","bnb","dot","sui","near","trx","zec"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const asset = (url.searchParams.get("asset") || "BTC").toLowerCase();
  const period = (url.searchParams.get("period") || "30d").toLowerCase();
  if (!supported.includes(asset)) return jsonError(400, "invalid_asset", "Unsupported asset symbol.");
  if (!period.endsWith("d") || !Number.isInteger(Number(period.slice(0, -1))) || Number(period.slice(0, -1)) < 1 || Number(period.slice(0, -1)) > 999) {
    return jsonError(400, "invalid_period", "period must look like 7d or 30d.");
  }
  return proxyCryptoEtf("/flows/" + asset);
}
