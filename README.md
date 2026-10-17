# x402 ETF & Macro Intelligence

Next.js API and dashboard for crypto ETF flows, ETF sentiment, institutional fund research, Federal Reserve events, US macro indicators, and research summaries.

## Data providers

- **FRED** — macroeconomic time series; configure `FRED_API_KEY`.
- **FMP** — market and economic data; configure `FMP_API_KEY`.
- **Crypto ETF provider** — configure `CRYPTOETF_API_KEY` and any required provider settings.
- **BEA** — optional economic data provider if used by enabled routes.

BLS and BlackRock-specific integrations have been removed from this project. Missing upstream providers should be reported explicitly; the API must not invent data.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## x402 payment and discovery

Paid routes are configured for Base mainnet (`eip155:8453`) and Solana mainnet (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`) using `BASE_PAY_TO` and `SOLANA_PAY_TO` (or the `X402_BASE_PAY_TO` / `X402_SOLANA_PAY_TO` aliases). The facilitator defaults to `https://facilitator.payai.network`.

Discovery documents: `/openapi.json` and `/.well-known/x402`.

Do not advertise paid production access until unpaid requests return a valid HTTP 402 challenge and a paid request has successfully settled. Never commit credentials or expose secrets in browser code.
