import { jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const basePayTo = process.env.BASE_PAY_TO || process.env.X402_BASE_PAY_TO;
  const solanaPayTo = process.env.SOLANA_PAY_TO || process.env.X402_SOLANA_PAY_TO;
  const facilitatorUrl = process.env.X402_FACILITATOR_URL || "https://facilitator.payai.network";
  const paymentConfigured = Boolean(basePayTo || solanaPayTo);

  return jsonOk({
    name: "x402-etf-macro-intelligence",
    status: "ok",
    payment: {
      enabled: paymentConfigured,
      configuredNetworks: [
        ...(basePayTo ? ["eip155:8453"] : []),
        ...(solanaPayTo ? ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"] : [])
      ],
      facilitatorUrl,
      note: paymentConfigured
        ? "Payment middleware is configured. Verify an unpaid request returns HTTP 402 and test a paid settlement before treating payments as production-ready."
        : "Set BASE_PAY_TO and/or SOLANA_PAY_TO to configure x402 payment middleware."
    },
    providers: {
      fred: Boolean(process.env.FRED_API_KEY),
      bls: Boolean(process.env.BLS_API_KEY),
      bea: Boolean(process.env.BEA_API_KEY),
      cryptoEtf: Boolean(process.env.CRYPTOETF_API_KEY),
      economicCalendar: Boolean(process.env.FMP_API_KEY),
      blackrock: Boolean(process.env.BLACKROCK_DATA_API_URL)
    },
    timestamp: new Date().toISOString()
  }, 0);
}
