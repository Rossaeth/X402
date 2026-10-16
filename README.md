# x402 ETF & Macro Intelligence

Next.js API and dashboard starter for crypto ETF flows (BTC, ETH, SOL, XRP), ETF sentiment, institutional fund data, Federal Reserve events, US macro indicators, and research summaries.

## Status

This is an initial scaffold. Macro indicator data uses FRED when `FRED_API_KEY` is configured; the FOMC endpoints currently link to official sources. ETF flow and BlackRock endpoints require a verified provider configured by environment variable and intentionally return `503 provider_not_configured` rather than inventing data. **x402 payment verification is not enabled yet.** Do not expose this as a paid production API until official x402 middleware and Base/Solana settlement paths are integrated and tested.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Endpoints currently in the repository

- `GET /api/health`
- `GET /api/etf/flows?asset=BTC|ETH|SOL|XRP&period=30d`
- `GET /api/etf/btc`, `/api/etf/eth`, `/api/etf/sol`, `/api/etf/xrp`
- `GET /api/institutions/blackrock`
- `GET /api/macro/calendar`
- `GET /api/macro/fed`
- `GET /api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE`
- `GET /api/research/market-outlook`

## Provider configuration

- `FRED_API_KEY`: official US macroeconomic series.
- `ETF_FLOW_API_URL` and `ETF_FLOW_API_KEY`: configure only with a verified ETF provider endpoint and documented authentication.
- `BLACKROCK_DATA_API_URL` and `BLACKROCK_DATA_API_KEY`: optional verified institutional-data provider.

Never commit credentials or expose them to browser code. Do not assume an ETF provider's web dashboard endpoints are part of its public API; check documentation and redistribution terms first.

## Data integrity

Responses include source and retrieval timestamps where available. Missing sources are reported explicitly. ETF flows must never be inferred from token prices. Check provider licensing and redistribution terms before monetizing data.

## Next: x402

Use current official x402 V2 Next.js middleware/SDK. Configure separate payment requirements for Base and Solana, validate network and USDC asset/mint, and test on Base Sepolia and Solana Devnet before mainnet. Protect paid routes at the server boundary; never trust a client-provided payment-success flag. Keep private keys out of this repository and client-side environment variables.


## x402 payment and discovery

- Paid ETF routes: planned price $0.02 USDC per call.
- Paid FMP and macro routes: planned price $0.01 USDC per call.
- Networks: Base mainnet (`eip155:8453`) and Solana mainnet (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`).
- The x402 middleware uses `BASE_PAY_TO` and `SOLANA_PAY_TO` (or the `X402_BASE_PAY_TO` / `X402_SOLANA_PAY_TO` aliases). It defaults to the PayAI facilitator URL configured by `X402_FACILITATOR_URL`.
- To switch facilitators, set `X402_FACILITATOR_URL` only to a compatible x402 v2 facilitator. CDP facilitator access may require server-side CDP API key authentication; `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET` are placeholders and are not automatically applied by the generic HTTP facilitator client yet.
- Discovery documents: `/openapi.json` and `/.well-known/x402`.
- Do not set `X402_ENABLED=true` as a substitute for installing and verifying middleware. Confirm that an unpaid request returns a valid HTTP 402 challenge and a paid request settles before advertising live payments.
