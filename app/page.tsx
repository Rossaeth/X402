import ApiPlayground from "@/app/components/api-playground";

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
        <a className="brand-lockup" href="/" aria-label="ETF and Macro Intelligence home">
          <div className="brand-mark">X<span>402</span></div>
          <div>
            <div className="eyebrow">AGENT-READY DATA API</div>
            <h1>ETF <span className="title-amp">&amp;</span> Macro Intelligence</h1>
            <div className="muted header-subtitle">Direct endpoints for ETF flows and US macroeconomic data.</div>
          </div>
        </a>
        <div className="header-meta">
          <span className="pill"><span className="status" /> X402 API</span>
          <a className="header-link" href="/openapi.json">OpenAPI ↗</a>
        </div>
      </header>

      <section className="hero-intro compact-hero">
        <div className="hero-copy">
          <div className="section-kicker">PAY-PER-REQUEST DATA</div>
          <h2>Research APIs.<br /><span>Ready for agents.</span></h2>
          <p>Explore ETF flows and US macro data through direct endpoints. Test requests, inspect real responses, and follow the x402 payment flow when a route is protected.</p>
          <div className="hero-actions"><a className="primary-action" href="#api-playground">Try an API call ↘</a><a className="secondary-action" href="#api-directory">Browse endpoints</a></div>
        </div>
        <div className="hero-side" aria-label="API flow illustration"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-core">X<span>402</span></div><div className="hero-side-label"><span className="status" /> PAYMENT-AWARE API</div><div className="hero-side-foot"><span>01 / REQUEST</span><span>02 / SETTLE</span><span>03 / DATA</span></div></div>
      </section>

      <ApiPlayground />

      <section className="endpoint-section" id="api-directory">
        <div className="endpoint-heading">
          <div className="section-kicker">API ROUTES</div>
          <h2>Endpoint Directory</h2>
          <p className="muted">Call these routes directly from an application, script, PayBox plugin or compatible AI agent. Paid routes may return HTTP 402 until an x402 payment is settled.</p>
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
        <div className="section-kicker">X402 PAYMENT</div>
        <h2>Pay-per-request API</h2>
        <p className="muted">Use a compatible agent or PayBox plugin to handle x402 payment challenges. A route returning HTTP 402 has not delivered its protected data yet.</p>
        <div className="quick-links list">
          <a href="/api/health"><span><i className="shortcut-dot" /> API health</span><b>↗</b></a>
          <a href="/openapi.json"><span><i className="shortcut-dot" /> OpenAPI specification</span><b>↗</b></a>
        </div>
      </section>

      <footer className="terminal-footer"><span>ETF &amp; MACRO INTELLIGENCE API</span><span>RESEARCH USE ONLY · NOT INVESTMENT ADVICE</span><span>x402 V2</span></footer>
    </main>
  );
}
