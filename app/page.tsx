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
    title: "BEA ECONOMIC DATA",
    description: "US national accounts and economic statistics from the Bureau of Economic Analysis (BEA).",
    endpoints: [
      { method: "GET", path: "/api/bea/inflation", label: "Inflation & Prices", note: "BEA price and inflation indicators." },
      { method: "GET", path: "/api/bea/gdp", label: "US GDP", note: "Gross domestic product statistics." },
      { method: "GET", path: "/api/bea/gdp-by-industry", label: "GDP by Industry", note: "Economic output broken down by industry." },
      { method: "GET", path: "/api/bea/personal-income", label: "Personal Income", note: "Personal income and related measures." },
      { method: "GET", path: "/api/bea/corporate-profits", label: "Corporate Profits", note: "Corporate profits and business earnings measures." },
      { method: "GET", path: "/api/bea/trade", label: "Trade", note: "International trade and related BEA measures." },
      { method: "GET", path: "/api/bea/international-investment", label: "International Investment", note: "International investment position statistics." },
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
      { method: "GET", path: "/api/health", label: "API Health", note: "Reports provider and x402 configuration without exposing secrets." },
      { method: "GET", path: "/openapi.json", label: "OpenAPI Specification", note: "Machine-readable API description for agent integrations." },
    ],
  },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="top terminal-header">
        <a className="brand-lockup" href="#" aria-label="ETF and Macro Intelligence home">
          <div className="brand-mark">X<span>402</span></div>
          <div>
            <div className="eyebrow">INDEPENDENT MARKET RESEARCH / 001</div>
            <h1>ETF <span className="title-amp">&amp;</span> Macro Intelligence</h1>
            <div className="muted header-subtitle">Institutional flows. Macro catalysts. Agent-ready data.</div>
          </div>
        </a>
        <div className="header-meta">
          <span className="pill"><span className="status" /> X402 PAYMENT GATE</span>
          <a className="header-link" href="#api-directory">Explore API <span>↘</span></a>
        </div>
      </header>

      <div className="market-strip">
        <span><i /> LIVE ETF MONITOR</span>
        <span>US MACRO SERIES</span>
        <span>AGENT API DIRECTORY</span>
        <span className="market-strip-right">BASE + SOLANA / USDC · x402 V2</span>
      </div>

      <section className="hero-intro">
        <div className="hero-copy">
          <div className="section-kicker">MARKET DATA, BUILT FOR AGENTS</div>
          <h2>Follow the flows.<br /><span>Understand the catalysts.</span></h2>
          <p>Track crypto ETF flows alongside the macro indicators that shape risk markets. Explore the dashboard, then connect your agent to the same API.</p>
          <div className="hero-actions">
            <a className="primary-action" href="#live-data">Open live terminal <span>↘</span></a>
            <a className="secondary-action" href="#api-directory">Browse endpoints</a>
          </div>
        </div>
        <div className="hero-side" aria-label="Platform overview">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-core">X<span>402</span></div>
          <div className="hero-side-label"><span className="status" /> PAY-PER-REQUEST API</div>
          <div className="hero-side-foot"><span>01 / ETF FLOWS</span><span>02 / MACRO DATA</span><span>03 / AGENT ACCESS</span></div>
        </div>
      </section>

      <div id="live-data"><LiveEtfDashboard /></div>

      <section className="cards">
        <article className="panel macro-panel">
          <div className="section-kicker">01 / CATALYSTS</div>
          <h2>Macro watchlist</h2>
          <p className="muted small">The releases and policy signals most watched by macro and ETF researchers.</p>
          <div className="list">
            <div className="item"><div><strong>Federal Reserve</strong><div className="small">FOMC decisions, policy guidance and rate expectations</div></div><span className="watch-tag">POLICY</span></div>
            <div className="item"><div><strong>Inflation</strong><div className="small">CPI and PCE price trends from official data series</div></div><span className="watch-tag">PRICES</span></div>
            <div className="item"><div><strong>Employment</strong><div className="small">Labor-market momentum and unemployment</div></div><span className="watch-tag">LABOR</span></div>
            <div className="item"><div><strong>Treasury yields</strong><div className="small">US 10-year yield and short-term policy rates</div></div><span className="watch-tag">RATES</span></div>
          </div>
        </article>
        <article className="panel quick-panel">
          <div className="section-kicker">02 / SHORTCUTS</div>
          <h2>Go straight to data</h2>
          <p className="muted small">Direct links to live API routes and machine-readable documentation.</p>
          <div className="list quick-links">
            <a href="/api/health"><span><i className="shortcut-dot" /> API health</span><b>↗</b></a>
            <a href="/api/etf/summary"><span><i className="shortcut-dot" /> ETF flow summary</span><b>↗</b></a>
            <a href="/api/etf/flows?asset=BTC"><span><i className="shortcut-dot" /> BTC ETF flows</span><b>↗</b></a>
            <a href="/openapi.json"><span><i className="shortcut-dot" /> OpenAPI specification</span><b>↗</b></a>
          </div>
        </article>
      </section>

      <section className="endpoint-section" id="api-directory">
        <div className="endpoint-heading">
          <div className="section-kicker">03 / DEVELOPER ACCESS</div>
          <h2>Agent API Directory</h2>
          <p className="muted">A clear route catalog for scripts, applications and AI agents. Provider credentials remain server-side. This directory focuses on ETF data, FRED macro indicators and system documentation.</p>
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
        <h2>Built for PayBox and x402</h2>
        <p className="muted">Use the API from a compatible agent or MCP plugin. Endpoints can return an x402 payment challenge before data is delivered, depending on their configured payment middleware.</p>
        <div className="guide-grid">
          <div><span className="guide-number">01</span><strong>Connect the tool</strong><p className="small">Expose the routes through your PayBox plugin or MCP tool manifest.</p></div>
          <div><span className="guide-number">02</span><strong>Read the challenge</strong><p className="small">The server declares accepted networks, USDC amount, recipient and facilitator.</p></div>
          <div><span className="guide-number">03</span><strong>Verify settlement</strong><p className="small">Confirm a paid request returns the expected data before treating a route as production-ready.</p></div>
        </div>
        <div className="guide-notice"><strong><span className="status" /> Live check</strong><span>HTTP 402 payment challenges were detected on the tested ETF summary and BEA inflation routes. Successful settlement and paid data delivery still require an end-to-end test.</span></div>
      </section>

      <footer className="terminal-footer"><span>ETF &amp; MACRO INTELLIGENCE</span><span>RESEARCH USE ONLY · NOT INVESTMENT ADVICE</span><span>POWERED BY x402 V2</span></footer>
    </main>
  );
}
