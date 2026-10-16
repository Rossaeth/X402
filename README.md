# x402 ETF & Macro Intelligence

Next.js API and dashboard starter for ETF flows (BTC, ETH, SOL, XRP), Binance market data, BlackRock/iShares fund data, Federal Reserve events, US macro indicators, and research summaries.

## Status

This is an initial scaffold. Macro indicator data uses FRED when `FRED_API_KEY` is configured; the FOMC endpoints link to official sources. Binance endpoints provide exchange prices and candlesticks, **not ETF fund flows**. ETF flow and BlackRock endpoints require a verified provider configured by environment variable and intentionally return `503 provider_not_configured` rather than inventing data. **x402 payment verification is not enabled yet.** Do not expose this as a paid production API until official x402 middleware and Base/Solana settlement paths are integrated and tested.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Endpoints

- `GET /api/health`
- `GET /api/market/binance?symbols=BTCUSDT,ETHUSDT` — 24-hour ticker data
- `GET /api/market/binance/klines?symbol=BTCUSDT&interval=1h&limit=100` — candlesticks
- `GET /api/etf/flows?asset=BTC|ETH|SOL|XRP&period=30d`
- `GET /api/etf/btc`, `/api/etf/eth`, `/api/etf/sol`, `/api/etf/xrp`
- `GET /api/institutions/blackrock`
- `GET /api/macro/calendar`
- `GET /api/macro/fed`
- `GET /api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE`
- `GET /api/research/market-outlook`

## Binance key

`BINANCE_API_KEY` is optional for public market-data endpoints; no secret key or trading permissions are needed for the endpoints above. If configured, the API key is sent from the server only. Never commit credentials or expose them to browser code.

## Data integrity

Responses include source and retrieval timestamps where available. Missing sources are reported explicitly. ETF flows are never inferred from token prices. Check provider licensing and redistribution terms before monetizing data.

## Next: x402

Use current official x402 V2 Next.js middleware/SDK. Configure separate payment requirements for Base and Solana, validate network and USDC asset/mint, and test on Base Sepolia and Solana Devnet before mainnet. Protect paid routes at the server boundary; never trust a client-provided payment-success flag. Keep private keys out of this repository and client-side environment variables.