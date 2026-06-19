import { createServerClient } from "@/supabase/server";

export interface InsuranceRate {
  id: string;
  category: string;
  insurer: string;
  plan_name: string;
  tier: string;
  price: number;
  price_unit: string;
  coverage_limit: number | null;
  coverage_limit_label: string | null;
  key_features: string[];
  excess: number | null;
  workshop_type: string | null;
  quote_url: string | null;
  last_updated: string;
}

export async function getInsuranceRates(category: string): Promise<InsuranceRate[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("insurance_rates")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) throw error;
  return (data ?? []) as InsuranceRate[];
}
