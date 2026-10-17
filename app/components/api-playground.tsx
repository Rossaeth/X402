"use client";

import { useEffect, useMemo, useState } from "react";

type Result = { status: number; ok: boolean; body: string; elapsed: number };
const endpointOptions = [
  { label: "BEA · Inflation & Prices", path: "/api/bea/inflation" },
  { label: "BEA · GDP", path: "/api/bea/gdp" },
  { label: "ETF · Flow Summary", path: "/api/etf/summary" },
  { label: "System · Health", path: "/api/health" },
];
const walkthrough = [
  { title: "Choose a route", body: "Select an endpoint and send a real request to this deployment.", tag: "01 / REQUEST" },
  { title: "Read the response", body: "HTTP 200 means data arrived. HTTP 402 means the route is protected and needs an x402-capable payer.", tag: "02 / INSPECT" },
  { title: "Settle with PayBox", body: "Call the same paid route through your connected PayBox plugin or compatible x402 agent, approve the payment if prompted, and let it retry.", tag: "03 / PAY + RETRY" },
  { title: "Confirm HTTP 200", body: "Only treat the call as successful when the paid retry returns HTTP 200 with the provider data in the response body.", tag: "04 / SUCCESS" },
];

export default function ApiPlayground() {
  const [path, setPath] = useState(endpointOptions[0].path);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const fullUrl = useMemo(() => `https://x402-etf-macro-intelligence.vercel.app${path}`, [path]);
  const curlExample = useMemo(() => `curl -i "${fullUrl}"`, [fullUrl]);

  async function runRequest() {
    setLoading(true);
    const started = Date.now();
    try {
      const response = await fetch(path, { method: "GET", cache: "no-store" });
      const raw = await response.text();
      let formatted = raw;
      try { formatted = JSON.stringify(JSON.parse(raw), null, 2); } catch {}
      setResult({ status: response.status, ok: response.ok, body: formatted, elapsed: Date.now() - started });
    } catch (error) {
      setResult({ status: 0, ok: false, body: error instanceof Error ? error.message : "Network request failed", elapsed: Date.now() - started });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= walkthrough.length - 1) {
          setPlaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 2400);
    return () => window.clearInterval(timer);
  }, [playing]);

  function toggleWalkthrough() {
    if (playing) setPlaying(false);
    else {
      if (step === walkthrough.length - 1) setStep(0);
      setPlaying(true);
    }
  }

  return (
    <section className="playground-section" id="api-playground">
      <div className="section-kicker">INTERACTIVE DEMO</div>
      <div className="playground-title-row">
        <div><h2>Make your first API call</h2><p className="muted">Send a real request, inspect the response, then follow the payment flow for protected routes.</p></div>
        <span className="playground-live"><i /> LIVE REQUEST TOOL</span>
      </div>
      <div className="playground-grid">
        <article className="panel request-panel">
          <div className="playground-card-top"><span className="mini-icon">↗</span><div><strong>Request builder</strong><small>Calls this live deployment</small></div></div>
          <label className="field-label" htmlFor="endpoint-picker">ENDPOINT</label>
          <select id="endpoint-picker" value={path} onChange={(event) => { setPath(event.target.value); setResult(null); }}>
            {endpointOptions.map((endpoint) => <option key={endpoint.path} value={endpoint.path}>{endpoint.label} — {endpoint.path}</option>)}
          </select>
          <div className="request-url"><span>GET</span><code>{path}</code></div>
          <button className="run-request" onClick={runRequest} disabled={loading}>{loading ? <><span className="spinner" /> Sending request…</> : <>Run request <span>↗</span></>}</button>
          <div className="request-footnote">No payment is initiated by this browser demo. It only reports the server's actual response.</div>
          {result && <div className="response-panel">
            <div className="response-head"><strong>Response</strong><span className={result.status === 200 ? "response-badge success" : result.status === 402 ? "response-badge payment" : "response-badge error"}>{result.status || "NETWORK ERROR"} · {result.ok ? "SUCCESS" : result.status === 402 ? "PAYMENT REQUIRED" : "CHECK DETAILS"}</span></div>
            <div className="response-meta">{result.elapsed} ms · GET {path}</div>
            <pre>{result.body}</pre>
            {result.status === 402 && <div className="response-tip"><strong>Next step:</strong> call this paid route through your PayBox plugin or x402-compatible agent so it can process the payment challenge and retry. This browser button cannot settle the payment.</div>}
            {result.status === 200 && <div className="response-tip success-tip"><strong>Data received.</strong> This request returned HTTP 200. Check the JSON body above for the actual response.</div>}
          </div>}
        </article>
        <article className="panel video-widget">
          <div className="video-screen">
            <div className="video-grid" />
            <div className="video-topline"><span>API FIELD GUIDE</span><span>PLAYBOOK / 04</span></div>
            <div className="video-visual">
              <div className="video-node node-one"><small>CLIENT</small><strong>GET</strong></div><div className="video-connector"><i /></div>
              <div className="video-node node-two"><small>X402 GATE</small><strong>{step === 2 ? "PAY" : step === 3 ? "200 OK" : step === 1 ? "402" : "API"}</strong></div><div className="video-connector"><i /></div>
              <div className="video-node node-three"><small>RESULT</small><strong>{step === 3 ? "JSON" : "DATA"}</strong></div>
            </div>
            <button className="video-play" onClick={toggleWalkthrough} aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}>{playing ? "Ⅱ" : "▶"}</button>
            <div className="video-bottomline"><span>{walkthrough[step].tag}</span><span>INTERACTIVE WALKTHROUGH</span></div>
          </div>
          <div className="video-caption">
            <div className="video-caption-heading"><div><span className="section-kicker">X402 IN 60 SECONDS</span><h3>{walkthrough[step].title}</h3></div><span className="step-count">0{step + 1} / 04</span></div>
            <p className="muted">{walkthrough[step].body}</p>
            <div className="walkthrough-controls"><div className="walkthrough-progress">{walkthrough.map((item, index) => <button key={item.tag} className={index === step ? "progress-dot active" : "progress-dot"} onClick={() => { setStep(index); setPlaying(false); }} aria-label={`Go to step ${index + 1}: ${item.title}`} />)}</div>
              <button className="next-step" onClick={() => { setStep((current) => (current + 1) % walkthrough.length); setPlaying(false); }}>{step === walkthrough.length - 1 ? "Restart guide ↺" : "Next step →"}</button></div>
          </div>
        </article>
      </div>
      <article className="panel success-guide">
        <div className="success-guide-head"><div><div className="section-kicker">COPY / PASTE</div><h3>Request → payment → successful response</h3></div><span className="success-guide-label">REAL RESPONSE REQUIRED</span></div>
        <div className="success-steps">
          <div><span>01</span><strong>Check the route</strong><pre>{curlExample}</pre><p>Direct requests to a paid route may return <code>402 Payment Required</code>.</p></div>
          <div><span>02</span><strong>Call through PayBox</strong><p>In your connected PayBox plugin, invoke the matching route (for example <code>{path}</code>). Let the x402-capable agent handle the payment challenge and retry.</p></div>
          <div><span>03</span><strong>Verify success</strong><pre>{'HTTP/1.1 200 OK\nContent-Type: application/json'}</pre><p>This is the expected success state, not a result we fake in this demo. Confirm the actual response contains data.</p></div>
        </div>
      </article>
    </section>
  );
}
