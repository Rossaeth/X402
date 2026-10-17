import LiveEtfDashboard from "@/app/components/live-etf-dashboard";

const endpointGroups = [
  {
    title: "ETF DATA",
    description: "Crypto ETF flows, fund breakdowns, prices, and sentiment from the configured ETF data provider.",
    endpoints: [
      { method: "GET", path: "/api/etf/summary", label: "ETF Flow Summary", note: "Latest net flows across supported assets." },
      { method: "GET", path: "/api/etf/flows?asset=BTC", label: "Asset ETF Flows", note: "Daily flow history for a supported asset." },
      { method: "GET", path: "/api/etf/fund-flows?asset=BTC", label: "Flows by Fund", note: "ETF flow breakdown by fund." },
      { method: "GET", path: "/api/etf/funds?asset=BTC", label: "ETF Funds", note: "Funds available for a selected asset." },
      { method: "GET", path: "/api/etf/cefi", label: "CEFI Sentiment Index", note: "Market-wide ETF flow sentiment indicator." },
      { method: "GET", path: "/api/etf/prices", label: "Asset Prices", note: "Latest supported spot price data." },
      { method: "GET", path: "/api/etf/weekly", label: "Weekly Analytics", note: "Weekly ETF flow analytics." },
      { method: "GET", path: "/api/etf/tickers", label: "Supported Tickers", note: "List of supported asset symbols." },
    ],
  },
  {
    title: "MACRO INDICATORS",
    description: "Macroeconomic series sourced from the Federal Reserve Economic Data (FRED) API.",
    endpoints: [
      { method: "GET", path: "/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE", label: "US Macro Indicators", note: "Policy rate, Treasury yield, CPI, PCE, and unemployment series. Requires FRED_API_KEY." },
    ],
  },
  {
    title: "SYSTEM STATUS",
    description: "Service configuration and health checks.",
    endpoints: [
      { method: "GET", path: "/api/health", label: "API Health", note: "Reports provider configuration status without exposing secrets." },
    ],
  },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="top terminal-header">
        <div className="brand-lockup">
          <div className="brand-mark">X</div>
          <div>
            <div className="eyebrow">X402 / MARKET INTELLIGENCE</div>
            <h1>ETF &amp; Macro Intelligence</h1>
            <div className="muted header-subtitle">Institutional flows. Macro catalysts. Source-first research.</div>
          </div>
        </div>
        <div className="header-meta">
          <span className="pill"><span className="status" /> RESEARCH TERMINAL</span>
          <span className="small">DATA REFRESH · 60 SEC</span>
        </div>
      </header>

      <div className="market-strip">
        <span><i /> ETF FLOW MONITOR</span><span>MACRO WATCHLIST</span><span>AGENT API</span><span className="market-strip-right">BASE / USDC · x402 READY-TO-INTEGRATE</span>
      </div>

      <LiveEtfDashboard />

      <section className="cards">
        <article className="panel macro-panel">
          <div className="section-kicker">01 / MACRO</div>
          <h2>Macro watchlist</h2>
          <p className="muted small">Key catalysts monitored by macro and ETF researchers.</p>
          <div className="list">
            <div className="item"><div><strong>FOMC</strong><div className="small">Federal Reserve meetings, policy decisions, and statements</div></div><span className="watch-tag">POLICY</span></div>
            <div className="item"><div><strong>Inflation</strong><div className="small">CPI and PCE releases from official statistical series</div></div><span className="watch-tag">PRICES</span></div>
            <div className="item"><div><strong>Employment</strong><div className="small">Nonfarm payrolls and unemployment rate</div></div><span className="watch-tag">LABOR</span></div>
            <div className="item"><div><strong>Treasury yields</strong><div className="small">US 10-year yield and policy-rate indicators</div></div><span className="watch-tag">RATES</span></div>
          </div>
        </article>
        <article className="panel quick-panel">
          <div className="section-kicker">02 / QUICK ACCESS</div>
          <h2>Data shortcuts</h2>
          <p className="muted small">Open live project endpoints directly.</p>
          <div className="list quick-links">
            <a href="/api/health"><span>API health</span><b>↗</b></a>
            <a href="/api/etf/summary"><span>ETF flow summary</span><b>↗</b></a>
            <a href="/api/etf/flows?asset=BTC"><span>BTC ETF flows</span><b>↗</b></a>
            <a href="/api/macro/indicators?series=DFF,DGS10,CPIAUCSL,PCEPI,UNRATE"><span>US macro indicators</span><b>↗</b></a>
          </div>
        </article>
      </section>

      <section className="endpoint-section" id="api-directory">
        <div className="endpoint-heading">
          <div className="section-kicker">03 / CONNECTIVITY</div>
          <h2>Agent API Directory</h2>
          <p className="muted">A concise route catalog for applications and AI agents. Provider credentials remain server-side. Only ETF, FRED macro-indicator, and system routes are listed here; legacy FMP routes are intentionally omitted from this directory.</p>
        </div>
        <div className="endpoint-groups">
          {endpointGroups.map((group) => (
            <article className="panel endpoint-group" key={group.title}>
              <div className="group-topline"><h3>{group.title}</h3><span>{String(group.endpoints.length).padStart(2, "0")} ROUTE{group.endpoints.length === 1 ? "" : "S"}</span></div>
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

      <section className="panel paybox-guide" id="paybox-guide">
        <div className="section-kicker">04 / AGENT COMMERCE</div>
        <h2>PayBox &amp; x402 integration guide</h2>
        <p className="muted">Designed for agent-driven research workflows. Connect the API routes through your PayBox-compatible plugin or MCP server, then verify payment behavior before advertising an endpoint as paid.</p>
        <div className="guide-grid">
          <div><span className="guide-number">01</span><strong>Connect the tool</strong><p className="small">Expose the required routes in your PayBox plugin or MCP tool manifest.</p></div>
          <div><span className="guide-number">02</span><strong>Configure x402</strong><p className="small">Set the accepted network, USDC asset, recipient, price, and facilitator on the server.</p></div>
          <div><span className="guide-number">03</span><strong>Test the challenge</strong><p className="small">Confirm an unpaid request returns HTTP 402 and a compatible agent can complete payment.</p></div>
        </div>
        <div className="guide-notice"><strong>Integration status</strong><span>This website section is guidance only. Do not assume any route charges USDC unless its live x402 middleware has been verified end to end.</span></div>
      </section>

      <footer className="terminal-footer"><span>ETF &amp; MACRO INTELLIGENCE</span><span>RESEARCH USE ONLY · NOT INVESTMENT ADVICE</span><span>POWERED BY x402</span></footer>
    </main>
  );
}
