"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type FlowDay = { date: string; netFlowUsdM: number };
type AssetFlow = { symbol?: string; asset?: string; days?: FlowDay[]; windowDays?: number; updatedAt?: string };
type SummaryAsset = { symbol: string; asset?: string; date?: string; netFlowUsdM: number };
type Summary = { assets?: SummaryAsset[]; updatedAt?: string };
type Price = { symbol?: string; priceUsd?: number; change24hPct?: number; price?: number; priceChangePercent?: number };
type PricePayload = { prices?: Price[] | Record<string, Price>; updatedAt?: string };
type Cefi = { current?: number; date?: string; components?: { flow?: number; trend?: number; breadth?: number } };
const ASSETS = ["BTC", "ETH", "SOL", "XRP", "HYP", "DOGE", "LINK", "AVAX", "HBAR", "LTC", "BNB", "DOT", "SUI", "NEAR", "TRX", "ZEC"];

function payload<T>(json: any): T { return (json?.data ?? json) as T; }
function money(value: number | undefined, suffix = "M"): string {
  if (value === undefined || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 1 })}${suffix}`;
}
function priceText(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 1 ? 5 : 2 }).format(value);
}
function dateText(value?: string) {
  if (!value) return "Date not supplied";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

export default function LiveEtfDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [prices, setPrices] = useState<PricePayload | null>(null);
  const [cefi, setCefi] = useState<Cefi | null>(null);
  const [history, setHistory] = useState<AssetFlow | null>(null);
  const [asset, setAsset] = useState("BTC");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState("");

  const load = useCallback(async (selectedAsset: string, initial = false) => {
    if (initial) setLoading(true); else setRefreshing(true);
    try {
      const requests = await Promise.all([
        fetch("/api/etf/summary", { cache: "no-store" }),
        fetch("/api/etf/prices", { cache: "no-store" }),
        fetch("/api/etf/cefi", { cache: "no-store" }),
        fetch(`/api/etf/flows?asset=${encodeURIComponent(selectedAsset)}&period=30d`, { cache: "no-store" }),
      ]);
      const bodies = await Promise.all(requests.map(async (r) => ({ ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) })));
      const failed = bodies.find((b) => !b.ok);
      if (failed) {
        const message = failed.body?.message || failed.body?.error?.message || failed.body?.error || `API returned HTTP ${failed.status}`;
        setError(String(message));
        if (failed.status === 503) setError("CryptoETF.today API key belum dikonfigurasi di Vercel. Tambahkan CRYPTOETF_API_KEY pada Environment Variables lalu redeploy.");
      } else {
        setError("");
        setSummary(payload<Summary>(bodies[0].body));
        setPrices(payload<PricePayload>(bodies[1].body));
        setCefi(payload<Cefi>(bodies[2].body));
        setHistory(payload<AssetFlow>(bodies[3].body));
        setLastRefresh(new Date().toISOString());
      }
    } catch {
      setError("Tidak bisa menghubungi endpoint ETF. Cek deployment Vercel dan koneksi provider.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(asset, true);
    const timer = setInterval(() => void load(asset), 60_000);
    return () => clearInterval(timer);
  }, [asset, load]);

  const summaryAssets = summary?.assets ?? [];
  const latest = summaryAssets.find((x) => x.symbol?.toUpperCase() === asset);
  const priceList = useMemo(() => {
    const p = prices?.prices;
    if (Array.isArray(p)) return p;
    if (p && typeof p === "object") return Object.entries(p).map(([symbol, value]) => ({ symbol, ...value }));
    return [];
  }, [prices]);
  const selectedPrice = priceList.find((x) => x.symbol?.toUpperCase() === asset);
  const days = history?.days ?? [];
  const maxAbs = Math.max(1, ...days.map((d) => Math.abs(Number(d.netFlowUsdM) || 0)));
  const positive = days.filter((d) => d.netFlowUsdM > 0).length;
  const negative = days.filter((d) => d.netFlowUsdM < 0).length;
  const total = days.reduce((sum, d) => sum + (Number(d.netFlowUsdM) || 0), 0);

  return (
    <section className="live-terminal">
      <div className="live-head">
        <div>
          <div className="eyebrow">LIVE DATA TERMINAL</div>
          <h2>Crypto ETF Flow Monitor</h2>
          <p className="muted small">CryptoETF.today REST API · server-side key protection · refreshes every 60 seconds</p>
        </div>
        <div className="live-controls">
          <span className={error ? "live-status is-error" : "live-status"}><i />{error ? "Provider issue" : loading ? "Connecting…" : "API connected"}</span>
          <button className="refresh-button" onClick={() => void load(asset)} disabled={refreshing}>{refreshing ? "Refreshing…" : "↻ Refresh"}</button>
        </div>
      </div>

      {error && <div className="api-error"><strong>Live data unavailable</strong><p>{error}</p><span>Website tetap berjalan, tetapi angka pasar tidak akan diisi dengan data contoh.</span></div>}

      <div className="live-metrics">
        <article className="live-metric"><span>Selected asset · latest ETF flow</span><strong className={(latest?.netFlowUsdM ?? 0) > 0 ? "positive" : (latest?.netFlowUsdM ?? 0) < 0 ? "negative" : ""}>{loading && !latest ? "Loading…" : money(latest?.netFlowUsdM)}</strong><small>{latest?.date ? `Data date: ${latest.date}` : "USD millions · latest provider date"}</small></article>
        <article className="live-metric"><span>Spot price</span><strong>{priceText(selectedPrice?.priceUsd ?? selectedPrice?.price)}</strong><small className={(selectedPrice?.change24hPct ?? selectedPrice?.priceChangePercent ?? 0) >= 0 ? "positive" : "negative"}>{selectedPrice ? `${(selectedPrice.change24hPct ?? selectedPrice.priceChangePercent ?? 0) >= 0 ? "+" : ""}${(selectedPrice.change24hPct ?? selectedPrice.priceChangePercent ?? 0).toFixed(2)}% · 24h` : "Provider price data"}</small></article>
        <article className="live-metric"><span>CEFI sentiment index</span><strong>{cefi?.current ?? "—"} <small>/ 100</small></strong><small>{cefi?.date ? `As of ${cefi.date}` : "Market-wide ETF flow sentiment"}</small></article>
        <article className="live-metric"><span>Selected asset · 30-day net flow</span><strong className={total > 0 ? "positive" : total < 0 ? "negative" : ""}>{days.length ? money(total) : "—"}</strong><small>{days.length ? `${positive} inflow days · ${negative} outflow days` : "Waiting for flow history"}</small></article>
      </div>

      <div className="flow-chart-panel">
        <div className="chart-heading">
          <div><h3>{asset} · Daily net ETF flows</h3><p className="muted small">Last {history?.windowDays ?? 30} days · USD millions · positive = inflow</p></div>
          <label className="asset-select-label">Asset <select value={asset} onChange={(e) => setAsset(e.target.value)}>{ASSETS.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        </div>
        {days.length ? <div className="flow-bars" role="img" aria-label={`${asset} daily ETF net flows for the last 30 days`}>
          {days.map((d, i) => <div className="flow-bar-column" key={d.date + i} title={`${d.date}: ${money(d.netFlowUsdM)}`}>
            <div className="flow-bar-track"><span className={d.netFlowUsdM >= 0 ? "flow-bar inflow" : "flow-bar outflow"} style={{ height: `${Math.max(2, Math.abs(d.netFlowUsdM) / maxAbs * 100)}%` }} /></div>
            <span className="flow-bar-date">{i === 0 || i === days.length - 1 || i % 5 === 0 ? d.date.slice(5) : ""}</span>
          </div>)}
        </div> : <div className="chart-empty">{loading ? "Loading flow history…" : "No flow history returned by the provider."}</div>}
        <div className="chart-legend"><span><i className="legend-in" /> Net inflow</span><span><i className="legend-out" /> Net outflow</span><span className="muted small">Provider timestamp: {dateText(history?.updatedAt || summary?.updatedAt || prices?.updatedAt)}</span></div>
      </div>

      <div className="live-lower-grid">
        <div className="flow-chart-panel">
          <div className="chart-heading"><div><h3>Latest ETF flows · all assets</h3><p className="muted small">Sorted by provider response · values in USD millions</p></div></div>
          <div className="asset-flow-table">
            {summaryAssets.length ? summaryAssets.map((item) => <button key={item.symbol} className={item.symbol.toUpperCase() === asset ? "asset-flow-row selected" : "asset-flow-row"} onClick={() => setAsset(item.symbol.toUpperCase())}>
              <strong>{item.symbol}</strong><span className="muted">{item.date || "—"}</span><b className={item.netFlowUsdM > 0 ? "positive" : item.netFlowUsdM < 0 ? "negative" : ""}>{money(item.netFlowUsdM)}</b>
            </button>) : <p className="muted small">{loading ? "Loading assets…" : "No summary data returned."}</p>}
          </div>
        </div>
        <div className="flow-chart-panel agent-panel">
          <div className="eyebrow">FOR AI AGENTS</div><h3>Call the API directly</h3>
          <p className="muted small">Use these public project routes from an agent, script, or API client. Provider credentials stay server-side.</p>
          <div className="agent-endpoint"><span>Latest flows · 16 assets</span><code>GET /api/etf/summary</code><a href="/api/etf/summary">Try endpoint ↗</a></div>
          <div className="agent-endpoint"><span>Asset history · 30 days</span><code>GET /api/etf/flows?asset=BTC&period=30d</code><a href="/api/etf/flows?asset=BTC&period=30d">Try endpoint ↗</a></div>
          <div className="agent-endpoint"><span>Spot prices</span><code>GET /api/etf/prices</code><a href="/api/etf/prices">Try endpoint ↗</a></div>
          <div className="agent-endpoint"><span>CEFI sentiment</span><code>GET /api/etf/cefi</code><a href="/api/etf/cefi">Try endpoint ↗</a></div>
          <div className="agent-command"><strong>Example · cURL</strong><pre>{`curl "${typeof window !== "undefined" ? window.location.origin : "https://x402-etf-macro-intelligence.vercel.app"}/api/etf/flows?asset=BTC&period=30d"`}</pre><button className="refresh-button" onClick={() => { void navigator.clipboard?.writeText(`curl "${window.location.origin}/api/etf/flows?asset=BTC&period=30d"`); }}>Copy example</button></div>
          <p className="agent-note">Note: these routes are currently read-only REST endpoints. x402 payment verification is not enabled yet, so do not assume a 402 challenge is active.</p>
        </div>
      </div>
      <div className="live-footnote">Last page refresh: {lastRefresh ? dateText(lastRefresh) : "—"}. ETF flow figures update on the provider’s publication schedule; prices may refresh more frequently. This is market research, not investment advice.</div>
    </section>
  );
}
