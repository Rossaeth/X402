import { getBeaData } from "@/lib/bea";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return getBeaData(request, "gdp-by-industry");
}
