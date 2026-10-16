import { proxyCryptoEtf } from "@/lib/cryptoetf";
export const dynamic = "force-dynamic";
export async function GET() { return proxyCryptoEtf("/tickers"); }
