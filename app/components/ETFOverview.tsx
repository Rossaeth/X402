"use client";

import { useEffect, useState } from "react";

type FlowRow = { asset?: string; symbol?: string; ticker?: string; name?: string; date?: string; netFlowUsdM?: number | string; netFlow?: number | string; flowUsdM?: number | string; flow?: number | string; [key: string]: unknown };

function rowsFrom(payload: unknown): FlowRow[] {
  if (Array.isArray(payload)) return payload as FlowRow[];
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  for (const key of ["data", "flows", "items", "results", "summary"]) {
    const value = obj[key];
    if (Array.isArray(value)) return value as FlowRow[];
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;
      for (const nestedKey of ["data", "flows", "items", "results"]) {
        if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as FlowRow[];
      }
      return Object.entries(nested).map(([symbol, item]) =>
        item && typeof item === "object" ? { symbol, ...(item as FlowRow) } : { symbol, netFlowUsdM: item as string | number }
      );
    }
  }
  return Object.entries(obj).map(([symbol, item]) =>
    item && typeof item === "object" ? { symbol, ...(item as FlowRow) } : { symbol, netFlowUsdM: item as string | number }
  );
}

function flowValue(row: FlowRow) {
  return row.netFlowUsdM ?? row.netFlow ?? row.flowUsdM ?? row.flow;
}

function money(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(number * 1_000_000);
}

export default function ETFOverview() {
  const [rows, setRows] = useState<FlowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/etf/summary", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error?.message || body?.message || "ETF API is not ready. Check CRYPTOETF_API_KEY in Vercel.");
        return body;
      })
      .then((body) => setRows(rowsFrom(body?.data ?? body)))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load ETF data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="panel" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h2>Crypto ETF Flows · REST API</h2>
          <p className="muted small">Authenticated data from CryptoETF.today · Latest reported non-zero net flows · USD millions</p>
        </div>
        <a href="/api/etf/summary">Open API response ↗</a>
      </div>
      {loading ? <p className="small">Loading ETF flow data…</p> : error ? (
        <p className="small" role="status">{error} <a href="https://vercel.com/rossadis-projects/x402-etf-macro-intelligence/settings/environment-variables" target="_blank" rel="noreferrer">Configure API key ↗</a></p>
      ) : rows.length === 0 ? <p className="small">The API responded, but its flow summary format was not recognized. Open the API response to inspect it.</p> : (
        <div className="grid">
          {rows.map((row, index) => {
            const symbol = String(row.symbol ?? row.ticker ?? row.asset ?? row.name ?? "Asset").toUpperCase();
            const flow = flowValue(row);
            const numericFlow = Number(flow);
            return <article className="panel" key={symbol + index} style={{ margin: 0 }}>
              <div className="muted">{symbol} ETF net flow</div>
              <div className="metric">{flow == null ? "—" : money(flow)}</div>
              <div className="small">{row.date ? "Reported " + String(row.date) : "Latest reported non-zero flow"}</div>
              <div className="small" style={{ color: Number.isFinite(numericFlow) && numericFlow > 0 ? "#55d6a0" : Number.isFinite(numericFlow) && numericFlow < 0 ? "#ff8585" : undefined }}>{flow == null ? "No flow value" : Number.isFinite(numericFlow) ? numericFlow > 0 ? "Net inflow" : numericFlow < 0 ? "Net outflow" : "Zero net flow" : String(flow)}</div>
            </article>;
          })}
        </div>
      )}
      <p className="small" style={{ marginTop: 12 }}>Source: CryptoETF.today. Flows are T+1 and may be revised. Informational only, not investment advice.</p>
    </section>
  );
}
