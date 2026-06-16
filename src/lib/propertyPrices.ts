import { createServerClient } from "@/supabase/server";
import { unstable_cache } from "next/cache";

export interface DistrictSummary {
  district: number;
  transaction_count: number;
  median_psf: number | null;
  latest_date: string | null;
}

export interface PropertyTransaction {
  id: string;
  project: string;
  street: string | null;
  district: number;
  price: number;
  area_sqm: number;
  psf: number | null;
  floor_range: string | null;
  property_type: string | null;
  tenure: string | null;
  type_of_sale: string | null;
  contract_date: string;
}

export const getDistrictSummaries = unstable_cache(
  async (): Promise<DistrictSummary[]> => {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("district_summary")
      .select("*")
      .order("district");
    if (error) {
      console.error("district_summary fetch error:", error.message);
      return [];
    }
    return (data ?? []) as DistrictSummary[];
  },
  ["district-summaries"],
  { revalidate: 3600 }
);

export const getDistrictTransactions = unstable_cache(
  async (district: number): Promise<PropertyTransaction[]> => {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("property_transactions")
      .select(
        "id,project,street,district,price,area_sqm,psf,floor_range,property_type,tenure,type_of_sale,contract_date"
      )
      .eq("district", district)
      .order("contract_date", { ascending: false })
      .order("psf", { ascending: false })
      .limit(1000);
    if (error) {
      console.error("property_transactions fetch error:", error.message);
      return [];
    }
    return (data ?? []) as PropertyTransaction[];
  },
  ["district-transactions"],
  { revalidate: 3600 }
);
