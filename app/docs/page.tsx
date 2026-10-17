"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Scalar?: {
      createApiReference: (selector: string, config: Record<string, unknown>) => void;
    };
  }
}

export default function ScalarDocsPage() {
  const initialized = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const mountScalar = () => {
      if (!window.Scalar?.createApiReference) {
        setError("Scalar could not be loaded. Please refresh the page.");
        return;
      }
      window.Scalar.createApiReference("#scalar-api-reference", {
        url: "/openapi.json",
        theme: "kepler",
        layout: "modern",
        darkMode: true,
        forceDarkModeState: "dark",
        hideDarkModeToggle: false,
        searchHotKey: "k",
        showSidebar: true,
        withDefaultFonts: true,
        defaultOpenAllTags: false,
        operationTitleSource: "summary",
        hideModels: false,
        telemetry: false,
      });
    };

    if (window.Scalar?.createApiReference) {
      mountScalar();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@scalar/api-reference";
    script.async = true;
    script.onload = mountScalar;
    script.onerror = () => setError("Could not load Scalar's API reference script.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#0b1013", color: "#e8f3ec" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px clamp(16px, 4vw, 48px)", borderBottom: "1px solid #26372f" }}>
        <a href="/" style={{ color: "#dff8e8", textDecoration: "none", fontWeight: 750, letterSpacing: ".02em" }}>X402 <span style={{ color: "#9df4bd" }}>ETF &amp; Macro Intelligence</span></a>
        <a href="/" style={{ color: "#a8d8ba", textDecoration: "none", fontSize: 13 }}>← Back to API portal</a>
      </header>
      <section style={{ padding: "28px clamp(16px, 4vw, 48px) 18px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ color: "#9df4bd", fontSize: 10, letterSpacing: ".18em", fontWeight: 800 }}>INTERACTIVE API REFERENCE</div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", letterSpacing: "-.045em", margin: "10px 0" }}>Explore the endpoints.</h1>
        <p style={{ color: "#9caea4", maxWidth: 760, lineHeight: 1.7, fontSize: 14, margin: 0 }}>Browse the OpenAPI schema, inspect parameters and examples, and try requests. Protected endpoints can return HTTP 402; use a compatible PayBox/x402 agent to settle payment and retry.</p>
      </section>
      {error ? <p role="alert" style={{ margin: 24, color: "#ffb5bc" }}>{error}</p> : null}
      <div id="scalar-api-reference" style={{ minHeight: "70vh" }} />
    </main>
  );
}
