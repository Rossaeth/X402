import { jsonOk } from "@/lib/http";
export const revalidate = 3600;
export async function GET() { return jsonOk({ source: "Federal Reserve", fomc_calendar: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", policy_documents: "https://www.federalreserve.gov/monetarypolicy.htm", status: "official_links", retrieved_at: new Date().toISOString() }, 3600); }