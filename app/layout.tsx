import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ETF & Macro Intelligence", description: "Crypto ETF flows, institutional fund data, and US macroeconomic events." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }