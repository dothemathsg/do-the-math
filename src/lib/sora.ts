const MAS_API_URL =
  "https://eservices.mas.gov.sg/api/action/datastore/search.json" +
  "?resource_id=9a0bf149-308c-4bd2-832d-76c8e6cb47ed" +
  "&limit=1&sort=end_of_day+desc&fields=end_of_day,comp_sora_3m";

const SORA_FALLBACK = 3.0;

export interface SoraResult {
  rate: number;
  isLive: boolean;
  date?: string;
}

export async function fetchSoraRate(): Promise<SoraResult> {
  try {
    const res = await fetch(MAS_API_URL, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const record = json?.result?.records?.[0];
    const raw = record?.comp_sora_3m;
    if (!raw) throw new Error("No data");
    return { rate: parseFloat(raw), isLive: true, date: record.end_of_day };
  } catch {
    return { rate: SORA_FALLBACK, isLive: false };
  }
}
