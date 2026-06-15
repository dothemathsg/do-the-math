export type MortgageRateInsert = {
  bank: string;
  product_name: string;
  interest_rate: number;
  lock_in_years: number;
  notes?: string | null;
};
