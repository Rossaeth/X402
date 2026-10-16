import LiveEtfDashboard from "@/app/components/live-etf-dashboard";

const endpointGroups = [
  {
    title: "CryptoETF.today · ETF Data",
    description: "These app routes proxy documented CryptoETF.today REST resources. The provider key stays server-side.",
    endpoints: [
      { method: "GET", path: "/api/etf/summary", label: "Flow summary", note: "Provider: /flows/summary" },
      { method: "GET", path: "/api/etf/flows?asset=BTC", label: "Asset ETF flows", note: "Provider: /flows/{asset}; daily history for a supported asset." },
      { method: "GET", path: "/api/etf/fund-flows?asset=BTC", label: "Flows by fund", note: "Provider: /flows/{asset}/funds" },
      { method: "GET", path: "/api/etf/funds?asset=BTC", label: "ETF funds", note: "Provider: /funds?asset={asset}" },
      { method: "GET", path: "/api/etf/cefi", label: "CEFI index", note: "Provider: /index/cefi" },
      { method: "GET", path: "/api/etf/prices", label: "Prices", note: "Provider: /prices" },
      { method: "GET", path: "/api/etf/weekly", label: "Weekly analytics", note: "Provider: /analytics/weekly" },
      { method: "GET", path: "/api/etf/tickers", label: "Supported tickers", note: "Provider: /tickers" },
    ],
  },
  {
    title: "FMP · Commodities",
    description: "Financial Modeling Prep commodities directory. All data endpoints follow the planned $0.02 USDC per-call price; Base and Solana USDC are intended payment networks. x402 verification is not live yet.",
    endpoints: [
      { method: "GET", path: "/api/fmp/commodities-list", label: "Commodities list", note: "FMP Stable API: /stable/commodities-list. Returns supported commodity symbols and metadata. Planned price: $0.02 USDC per call." },
    ],
  },
  {
    title: "FMP · Company, SEC & Fundraising",
    description: "Company lookup, peer comparisons, report dates, SEC filing search, industry classifications, crowdfunding, and equity offerings. Planned price: $0.01 USDC per call on Base or Solana. x402 verification is not enabled yet.",
    endpoints: [
      { method: "GET", path: "/api/fmp/profile-cik?cik=320193", label: "Company Profile by CIK", note: "FMP: /stable/profile-cik?cik=…" },
      { method: "GET", path: "/api/fmp/stock-peers?symbol=AAPL", label: "Stock Peer Comparison", note: "FMP: /stable/stock-peers?symbol=…" },
      { method: "GET", path: "/api/fmp/search-name?query=Apple", label: "Company Name Search", note: "FMP: /stable/search-name?query=…" },
      { method: "GET", path: "/api/fmp/financial-reports-dates?symbol=AAPL", label: "Financial Reports Dates", note: "FMP: /stable/financial-reports-dates?symbol=…" },
      { method: "GET", path: "/api/fmp/sec-filings-company-search/name?company=Berkshire", label: "SEC Filings By Name", note: "FMP: /stable/sec-filings-company-search/name?company=…" },
      { method: "GET", path: "/api/fmp/sec-filings-company-search/symbol?symbol=AAPL", label: "SEC Filings Company Search By Symbol", note: "FMP: /stable/sec-filings-company-search/symbol?symbol=…" },
      { method: "GET", path: "/api/fmp/sec-filings-company-search/cik?cik=0000320193", label: "SEC Filings Company Search By CIK", note: "FMP: /stable/sec-filings-company-search/cik?cik=…" },
      { method: "GET", path: "/api/fmp/sec-profile?symbol=AAPL", label: "SEC Company Full Profile", note: "FMP: /stable/sec-profile?symbol=…" },
      { method: "GET", path: "/api/fmp/standard-industrial-classification-list", label: "Industry Classification List", note: "FMP: /stable/standard-industrial-classification-list" },
      { method: "GET", path: "/api/fmp/crowdfunding-offerings-latest?page=0&limit=20", label: "Latest Crowdfunding Campaigns", note: "FMP: /stable/crowdfunding-offerings-latest" },
      { method: "GET", path: "/api/fmp/crowdfunding-offerings-search?name=enotap", label: "Crowdfunding Campaign Search", note: "FMP: /stable/crowdfunding-offerings-search?name=…" },
      { method: "GET", path: "/api/fmp/crowdfunding-offerings?cik=0001916078", label: "Crowdfunding By CIK", note: "FMP: /stable/crowdfunding-offerings?cik=…" },
      { method: "GET", path: "/api/fmp/fundraising-latest?page=0&limit=10", label: "Equity Offering Updates", note: "FMP: /stable/fundraising-latest" },
      { method: "GET", path: "/api/fmp/fundraising-search?name=NJOY", label: "Equity Offering Search", note: "FMP: /stable/fundraising-search?name=…" },
      { method: "GET", path: "/api/fmp/fundraising?cik=0001547416", label: "Equity Offering By CIK", note: "FMP: /stable/fundraising?cik=…" },
    ],
  },
  {
    title: "FMP · Market Movers & Exchange Hours",
    description: "Market movers, global exchange schedules and holidays, macro indicators, Treasury rates, and market risk premium. Planned price: $0.01 USDC per call on Base or Solana. x402 payment verification is not enabled yet.",
    endpoints: [
      { method: "GET", path: "/api/fmp/biggest-gainers", label: "Biggest Stock Gainers", note: "FMP: /stable/biggest-gainers" },
      { method: "GET", path: "/api/fmp/biggest-losers", label: "Biggest Stock Losers", note: "FMP: /stable/biggest-losers" },
      { method: "GET", path: "/api/fmp/most-actives", label: "Top Traded Stocks", note: "FMP: /stable/most-actives" },
      { method: "GET", path: "/api/fmp/exchange-market-hours?exchange=NASDAQ", label: "Global Exchange Market Hours", note: "FMP: /stable/exchange-market-hours?exchange=…" },
      { method: "GET", path: "/api/fmp/holidays-by-exchange?exchange=NASDAQ&from=2026-01-01&to=2026-12-31", label: "Holidays By Exchange", note: "FMP: /stable/holidays-by-exchange; requires exchange and date range (maximum 90 days)." },
      { method: "GET", path: "/api/fmp/all-exchange-market-hours", label: "All Exchange Market Hours", note: "FMP: /stable/all-exchange-market-hours" },
      { method: "GET", path: "/api/fmp/economic-indicators?name=GDP", label: "Economics Indicators", note: "FMP: /stable/economic-indicators?name=…; date range optional, maximum 90 days." },
      { method: "GET", path: "/api/fmp/treasury-rates?from=2026-01-01&to=2026-03-31", label: "Treasury Rates", note: "FMP: /stable/treasury-rates; maximum 90-day date range." },
      { method: "GET", path: "/api/fmp/market-risk-premium", label: "Market Risk Premium", note: "FMP: /stable/market-risk-premium" },
    ],
  },
  {
    title: "Economic Calendar",
    description: "Separate provider for scheduled macro releases. Configure FMP_API_KEY in Vercel before using live calendar data.",
    endpoints: [
      { method: "GET", path: "/api/macro/calendar", label: "Economic events", note: "Financial Modeling Prep economic calendar; defaults to the next 30 days. Data access depends on your FMP plan." },
      { method: "GET", path: "/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE", label: "US macro indicators", note: "FRED API; requires FRED_API_KEY." },
    ],
  },
  {
    title: "System",
    description: "Configuration status and service health.",
    endpoints: [
      { method: "GET", path: "/api/health", label: "Health status", note: "Reports whether provider keys are configured; never exposes key values." },
    ],
  },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="top">
        <div>
          <div className="eyebrow">X402 · RESEARCH TERMINAL</div>
          <h1>ETF &amp; Macro Intelligence</h1>
          <div className="muted">Institutional flows. Macro catalysts. Source-first research.</div>
        </div>
        <span className="pill"><span className="status" />Live API dashboard · auto-refresh 60s</span>
      </header>

      <LiveEtfDashboard />

      <section className="cards">
        <article className="panel">
          <h2>Macro watchlist</h2>
          <div className="list">
            <div className="item"><strong>FOMC</strong><div className="small">Federal Reserve meeting schedule and statements</div></div>
            <div className="item"><strong>Inflation</strong><div className="small">CPI and PCE releases from official sources</div></div>
            <div className="item"><strong>Employment</strong><div className="small">Nonfarm payrolls and unemployment rate</div></div>
            <div className="item"><strong>Treasury yields</strong><div className="small">US 10-year yield and policy rate indicators</div></div>
          </div>
        </article>
        <article className="panel">
          <h2>Quick links</h2>
          <div className="list small">
            <a href="/api/health">API health →</a>
            <a href="/api/etf/summary">ETF flow summary →</a>
            <a href="/api/etf/flows?asset=BTC">BTC ETF flows →</a>
            <a href="/api/macro/calendar">Economic calendar →</a>
            <a href="/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE">Macro indicators →</a>
          </div>
        </article>
      </section>

      <section className="endpoint-section">
        <div className="endpoint-heading">
          <div className="eyebrow">API DIRECTORY</div>
          <h2>Agent Endpoints</h2>
          <p className="muted">Use these HTTP routes from an AI agent or script. CryptoETF.today and FMP data endpoints are planned at $0.02 USDC per call, payable on Base or Solana. API keys stay server-side. Important: x402 payment verification is not enabled yet, so these prices are not being charged until payment middleware is integrated and tested.</p>
        </div>
        <div className="endpoint-groups">
          {endpointGroups.map((group) => (
            <article className="panel endpoint-group" key={group.title}>
              <h2>{group.title}</h2>
              <p className="muted small">{group.description}</p>
              <div className="endpoint-list">
                {group.endpoints.map((endpoint) => (
                  <div className="endpoint-row" key={endpoint.path}>
                    <div className="endpoint-info">
                      <div className="endpoint-label">{endpoint.label}</div>
                      <div className="small muted">{endpoint.note}</div>
                      <code className="endpoint-path">{endpoint.path}</code>
                    </div>
                    <a className="endpoint-open" href={endpoint.path} aria-label={`Open ${endpoint.label} endpoint`}>
                      <span>{endpoint.method}</span> Open ↗
                    </a>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="small">Data is for informational research only, not investment advice. Provider access and x402 payments must be configured separately.</footer>
    </main>
  );
}
