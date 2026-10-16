import { jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

const issuers = [
  { name: "BlackRock / iShares", slug: "blackrock", endpoint: "/api/institutions/blackrock", exampleProducts: ["IBIT", "ETHA"] },
  { name: "Fidelity", slug: "fidelity", endpoint: "/api/institutions/fidelity", exampleProducts: ["FBTC", "FETH"] },
  { name: "Grayscale", slug: "grayscale", endpoint: "/api/institutions/grayscale", exampleProducts: ["GBTC", "ETHE", "BTC"] },
  { name: "Bitwise", slug: "bitwise", endpoint: "/api/institutions/bitwise", exampleProducts: ["BITB", "ETHW"] },
  { name: "VanEck", slug: "vaneck", endpoint: "/api/institutions/vaneck", exampleProducts: ["HODL", "ETHV"] },
];

export async function GET() {
  return jsonOk({
    issuers,
    note: "Directory entries are informational. Per-issuer live analysis requires a verified provider configured for that issuer.",
    retrieved_at: new Date().toISOString(),
  });
}
