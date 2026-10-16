import LiveEtfDashboard from "@/app/components/live-etf-dashboard";

const assets = ["BTC", "ETH", "SOL", "XRP"];

const endpointGroups = [
  {
    title: "ETF Data",
    description: "CryptoETF.today REST endpoints. Set CRYPTOETF_API_KEY in Vercel to enable authenticated live data.",
    endpoints: [
      { method: "GET", path: "/api/etf/summary", label: "All-asset flow summary", note: "Latest net flows for 16 tracked assets." },
      { method: "GET", path: "/api/etf/flows?asset=BTC&period=30d", label: "Asset flow history", note: "30-day daily flow series; supported assets include BTC, ETH, SOL, XRP and 12 others." },
      { method: "GET", path: "/api/etf/fund-flows?asset=btc", label: "Fund-by-fund flows", note: "Daily flows for individual funds such as IBIT and FBTC." },
      { method: "GET", path: "/api/etf/funds?asset=btc", label: "ETF fund directory", note: "Fund metadata, current AUM and available coin holdings." },
      { method: "GET", path: "/api/etf/cefi", label: "CEFI sentiment index", note: "Composite Crypto ETF Flow Index and recent history." },
      { method: "GET", path: "/api/etf/prices", label: "Crypto spot prices", note: "Last prices and rolling 24-hour changes." },
      { method: "GET", path: "/api/etf/weekly", label: "Weekly flow analytics", note: "Seven-day totals, inflow days and outflow days." },
      { method: "GET", path: "/api/etf/tickers", label: "Tracked asset tickers", note: "List all 16 supported assets." },
    ],
  },
  {
    title: "Institutional Issuers",
    description: "Issuer directory and issuer-specific data routes. Live analysis requires a verified provider for each issuer.",
    endpoints: [
      { method: "GET", path: "/api/institutions/issuers", label: "ETF Issuer Directory", note: "List supported issuers and product examples." },
      { method: "GET", path: "/api/institutions/blackrock", label: "BlackRock / iShares", note: "Issuer data; provider configuration required." },
      { method: "GET", path: "/api/institutions/fidelity", label: "Fidelity", note: "Issuer data; provider configuration required." },
      { method: "GET", path: "/api/institutions/grayscale", label: "Grayscale", note: "Issuer data; provider configuration required." },
      { method: "GET", path: "/api/institutions/bitwise", label: "Bitwise", note: "Issuer data; provider configuration required." },
      { method: "GET", path: "/api/institutions/vaneck", label: "VanEck", note: "Issuer data; provider configuration required." },
    ],
  },
  {
    title: "Macro & Federal Reserve",
    description: "US macroeconomic indicators and official Fed references.",
    endpoints: [
      { method: "GET", path: "/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE", label: "Macro indicators", note: "FRED series; requires FRED_API_KEY for live data." },
      { method: "GET", path: "/api/macro/calendar", label: "Macro calendar", note: "Calendar information and official-source links." },
      { method: "GET", path: "/api/macro/fed", label: "Federal Reserve", note: "Fed information and official-source links." },
    ],
  },
  {
    title: "Research & System",
    description: "Research summary and service health.",
    endpoints: [
      { method: "GET", path: "/api/research/market-outlook", label: "Market outlook", note: "Research summary; currently a starter template." },
      { method: "GET", path: "/api/health", label: "Health status", note: "Shows provider configuration and x402 status." },
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
            <div className="item"><strong>Inflation</strong><div className="small">CPI and PCE from official statistical sources</div></div>
            <div className="item"><strong>Employment</strong><div className="small">Nonfarm payrolls and unemployment rate</div></div>
            <div className="item"><strong>Treasury yields</strong><div className="small">US 10-year yield and policy rate indicators</div></div>
          </div>
        </article>
        <article className="panel">
          <h2>Institutional tracker</h2>
          <div className="item"><strong>BlackRock / iShares</strong><div className="small">Fund data will appear after a verified source is configured.</div></div>
          <h2 style={{ marginTop: 22 }}>Quick links</h2>
          <div className="list small">
            <a href="/api/health">API health →</a>
            <a href="/api/etf/summary">All-asset ETF flows →</a>
            <a href="/api/etf/flows?asset=BTC&period=30d">BTC ETF flows →</a>
            <a href="/api/etf/cefi">CEFI index →</a>
            <a href="/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE">Macro indicators →</a>
          </div>
        </article>
      </section>

      <section className="endpoint-section">
        <div className="endpoint-heading">
          <div className="eyebrow">API DIRECTORY</div>
          <h2>Available Endpoints</h2>
          <p className="muted">Each endpoint shows its HTTP method, path and purpose. Open a route to inspect JSON; use the cURL example above for scripts and AI-agent tool wrappers. ETF provider keys remain server-side.</p>
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
                    <a className="endpoint-open" href={endpoint.path} aria-label={`Open ${endpoint.label} endpoint`} target={endpoint.path.startsWith("https://") ? "_blank" : undefined} rel={endpoint.path.startsWith("https://") ? "noreferrer" : undefined}>
                      <span>{endpoint.method}</span> Open ↗
                    </a>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="small">CryptoETF data is informational research, not investment advice. x402 payment verification is not enabled yet.</footer>
    </main>
  );
}
