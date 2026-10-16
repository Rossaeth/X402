import { jsonError, jsonOk } from "@/lib/http";

const BASE_URL = "https://api.cryptoetf.today/api/v1";

export async function proxyCryptoEtf(path: string) {
  const key = process.env.CRYPTOETF_API_KEY;
  if (!key) {
    return jsonError(503, "provider_not_configured", "Set CRYPTOETF_API_KEY in the deployment environment to enable CryptoETF REST data.", { provider: "CryptoETF.today" });
  }
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return jsonError(response.status === 401 ? 502 : response.status, "cryptoetf_provider_error", "CryptoETF.today returned an error.", { providerStatus: response.status, provider: "CryptoETF.today", details: payload });
    }
    return jsonOk({ source: "CryptoETF.today", retrieved_at: new Date().toISOString(), data: payload }, 60);
  } catch {
    return jsonError(502, "provider_unreachable", "Could not reach CryptoETF.today.", { provider: "CryptoETF.today" });
  }
}
