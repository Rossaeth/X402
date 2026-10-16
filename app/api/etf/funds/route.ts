import { jsonError } from "@/lib/http";
import { proxyCryptoEtf } from "@/lib/cryptoetf";
export const dynamic = "force-dynamic";
const supported = new Set(["btc","eth","sol","xrp","hyp","doge","link","avax","hbar","ltc","bnb","dot","sui","near","trx","zec"]);
export async function GET(request: Request) {
  const asset = (new URL(request.url).searchParams.get("asset") || "").toLowerCase();
  if (asset && !supported.has(asset)) return jsonError(400, "invalid_asset", "Unsupported asset symbol.");
  return proxyCryptoEtf(asset ? `/funds?asset=${encodeURIComponent(asset)}` : "/funds");
}
