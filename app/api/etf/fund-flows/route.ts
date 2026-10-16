import { jsonError } from "@/lib/http";
import { proxyCryptoEtf } from "@/lib/cryptoetf";
export const dynamic = "force-dynamic";
const symbols = ["btc","eth","sol","xrp","hyp","doge","link","avax","hbar","ltc","bnb","dot","sui","near","trx","zec"];
export async function GET(request: Request) {
 const asset = (new URL(request.url).searchParams.get("asset") || "btc").toLowerCase();
 if (!symbols.includes(asset)) return jsonError(400, "invalid_asset", "Unsupported asset symbol.");
 return proxyCryptoEtf("/flows/" + asset + "/funds");
}
