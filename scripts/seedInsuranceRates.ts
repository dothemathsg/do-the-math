// Run: npx tsx scripts/seedInsuranceRates.ts
// Rates are indicative. Verify with each insurer before purchase.

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TODAY = new Date().toISOString().slice(0, 10);

// ─── TRAVEL ──────────────────────────────────────────────────────────────────
// Reference: 7-day ASEAN trip, 1 adult aged 30, economy class, single trip
const travel = [
  {
    category: "travel", insurer: "Etiqa", plan_name: "ePROTECT Essential", tier: "basic",
    price: 19, price_unit: "per-trip", coverage_limit: 150_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$150K", "Trip cancellation S$5K", "Baggage loss S$2K", "Travel delay S$100/6h"],
    quote_url: "https://www.etiqa.com.sg/personal/travel-insurance/",
  },
  {
    category: "travel", insurer: "Singlife", plan_name: "Travel Lite", tier: "basic",
    price: 21, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$5K", "Baggage loss S$3K", "Travel delay S$100/6h"],
    quote_url: "https://singlife.com/en/travel-insurance",
  },
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Silver", tier: "basic",
    price: 22, price_unit: "per-trip", coverage_limit: 300_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$300K", "Trip cancellation S$5K", "Baggage loss S$3K", "24h emergency assistance"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
  {
    category: "travel", insurer: "FWD", plan_name: "First", tier: "basic",
    price: 23, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$7.5K", "Baggage loss S$3K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  {
    category: "travel", insurer: "NTUC Income", plan_name: "Classic", tier: "basic",
    price: 25, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$5K", "Baggage loss S$3K", "PA cover S$100K"],
    quote_url: "https://www.income.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "Allianz", plan_name: "Bronze", tier: "basic",
    price: 26, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage loss S$3K", "24h global assistance"],
    quote_url: "https://www.allianz.com.sg/travel-insurance.html",
  },
  {
    category: "travel", insurer: "MSIG", plan_name: "TravelEasy Standard", tier: "basic",
    price: 28, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage delay S$200/6h", "PA cover S$150K"],
    quote_url: "https://www.msig.com.sg/personal-insurance/travel-insurance",
  },
  {
    category: "travel", insurer: "AXA", plan_name: "SmartTraveller Essential", tier: "basic",
    price: 28, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$5K", "Baggage loss S$3K", "Travel delay S$100/6h"],
    quote_url: "https://www.axa.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Gold", tier: "standard",
    price: 31, price_unit: "per-trip", coverage_limit: 600_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$600K", "Trip cancellation S$10K", "Baggage loss S$5K", "24h emergency assistance"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
  {
    category: "travel", insurer: "Singlife", plan_name: "Travel Standard", tier: "standard",
    price: 32, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "COVID-19 cover"],
    quote_url: "https://singlife.com/en/travel-insurance",
  },
  {
    category: "travel", insurer: "NTUC Income", plan_name: "Preferred", tier: "standard",
    price: 36, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "PA cover S$200K"],
    quote_url: "https://www.income.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "FWD", plan_name: "Business", tier: "standard",
    price: 37, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  {
    category: "travel", insurer: "Allianz", plan_name: "Gold", tier: "standard",
    price: 40, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "24h global assistance"],
    quote_url: "https://www.allianz.com.sg/travel-insurance.html",
  },
  {
    category: "travel", insurer: "AXA", plan_name: "SmartTraveller Comprehensive", tier: "standard",
    price: 41, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$15K", "Baggage loss S$8K", "Travel delay S$200/6h"],
    quote_url: "https://www.axa.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "MSIG", plan_name: "TravelEasy Elite", tier: "standard",
    price: 39, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage delay S$300/6h", "PA cover S$200K"],
    quote_url: "https://www.msig.com.sg/personal-insurance/travel-insurance",
  },
  {
    category: "travel", insurer: "FWD", plan_name: "Premium", tier: "premium",
    price: 48, price_unit: "per-trip", coverage_limit: 1_000_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$1M", "Trip cancellation S$15K", "Baggage loss S$8K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Platinum", tier: "premium",
    price: 40, price_unit: "per-trip", coverage_limit: 1_000_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$1M", "Trip cancellation S$15K", "Baggage loss S$8K", "Free child cover"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
];

// ─── HOME ─────────────────────────────────────────────────────────────────────
// Reference: HDB 4-room flat, contents S$50K + renovation S$50K, annual
const home = [
  {
    category: "home", insurer: "DirectAsia", plan_name: "Home Insurance", tier: "standard",
    price: 148, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$500K", "Alternative accommodation"],
    quote_url: "https://www.directasia.com/home-insurance/",
  },
  {
    category: "home", insurer: "FWD", plan_name: "Home Insurance", tier: "standard",
    price: 155, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$500K", "Temporary accommodation"],
    quote_url: "https://www.fwd.com.sg/home-insurance/",
  },
  {
    category: "home", insurer: "Etiqa", plan_name: "Home Insurance", tier: "standard",
    price: 160, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$500K", "Worldwide personal effects"],
    quote_url: "https://www.etiqa.com.sg/personal/home-insurance/",
  },
  {
    category: "home", insurer: "Singlife", plan_name: "Home Insurance", tier: "standard",
    price: 168, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$500K", "Alternative accommodation"],
    quote_url: "https://singlife.com/en/home-insurance",
  },
  {
    category: "home", insurer: "NTUC Income", plan_name: "HomeProtect360", tier: "standard",
    price: 178, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$1M", "Worldwide contents cover"],
    quote_url: "https://www.income.com.sg/home-insurance",
  },
  {
    category: "home", insurer: "AXA", plan_name: "SmartHome", tier: "standard",
    price: 192, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$1M", "New-for-old replacement"],
    quote_url: "https://www.axa.com.sg/home-insurance",
  },
  {
    category: "home", insurer: "MSIG", plan_name: "Home Protect Plus", tier: "standard",
    price: 198, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$1M", "Employer's liability"],
    quote_url: "https://www.msig.com.sg/personal-insurance/home-insurance",
  },
];

// ─── LIFE ─────────────────────────────────────────────────────────────────────
// Reference: 30-year-old male, non-smoker, S$500K sum assured, 20-year term
const life = [
  {
    category: "life", insurer: "Singlife", plan_name: "Term Life", tier: "standard",
    price: 19, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Convertible to whole life", "No medical underwriting below S$500K"],
    quote_url: "https://singlife.com/en/life-insurance",
  },
  {
    category: "life", insurer: "FWD", plan_name: "Term Life", tier: "standard",
    price: 21, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Terminal illness accelerated payout", "Direct purchase policy"],
    quote_url: "https://www.fwd.com.sg/life-insurance/",
  },
  {
    category: "life", insurer: "AIA", plan_name: "Direct Term Life", tier: "standard",
    price: 22, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Terminal illness benefit", "Direct purchase (no advisor needed)"],
    quote_url: "https://www.aia.com.sg/en/insurance-products/life-insurance/",
  },
  {
    category: "life", insurer: "NTUC Income", plan_name: "iTermLife", tier: "standard",
    price: 23, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Waiver of premium on TPD", "Optional CI add-on"],
    quote_url: "https://www.income.com.sg/life-insurance",
  },
  {
    category: "life", insurer: "Great Eastern", plan_name: "GREAT Term", tier: "standard",
    price: 24, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Terminal illness benefit", "Renewable at maturity"],
    quote_url: "https://www.greateasternlife.com/sg/en/personal-insurance/our-products/life-insurance/",
  },
  {
    category: "life", insurer: "Manulife", plan_name: "ReadyTerm", tier: "standard",
    price: 25, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Disability income option", "Critical illness add-on available"],
    quote_url: "https://www.manulife.com.sg/en/individual/products/term-insurance/",
  },
  {
    category: "life", insurer: "Prudential", plan_name: "PRUterm", tier: "standard",
    price: 26, price_unit: "monthly", coverage_limit: 500_000, coverage_limit_label: "Sum assured",
    key_features: ["Death & TPD cover", "20-year term", "Terminal illness benefit", "Convertible to permanent plan"],
    quote_url: "https://www.prudential.com.sg/products/insurance/life/",
  },
];

// ─── CAR ──────────────────────────────────────────────────────────────────────
// Reference: Comprehensive plan features, indicative starting premiums
// Actual rates depend heavily on vehicle make/age, driver profile, and NCB
const car = [
  {
    category: "car", insurer: "HL Assurance", plan_name: "Car Smart Comprehensive", tier: "standard",
    price: 1000, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "24h roadside assistance"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://www.hlassurance.com.sg/car-insurance/",
  },
  {
    category: "car", insurer: "Etiqa", plan_name: "MotorCare Comprehensive", tier: "standard",
    price: 1050, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Flood & storm cover"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://www.etiqa.com.sg/personal/motor-insurance/",
  },
  {
    category: "car", insurer: "Singlife", plan_name: "Car Insurance", tier: "standard",
    price: 1100, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Lifetime workshop guarantee"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://singlife.com/en/car-insurance",
  },
  {
    category: "car", insurer: "FWD", plan_name: "Car Insurance", tier: "standard",
    price: 1200, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Courtesy car"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://www.fwd.com.sg/car-insurance/",
  },
  {
    category: "car", insurer: "MSIG", plan_name: "MotorMax", tier: "standard",
    price: 1200, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Free-choice workshops", "NCB protection available", "Personal accident cover"],
    workshop_type: "Free choice", excess: 600,
    quote_url: "https://www.msig.com.sg/personal-insurance/motor-insurance",
  },
  {
    category: "car", insurer: "AXA", plan_name: "Motor Comprehensive", tier: "standard",
    price: 1250, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "24h roadside assistance"],
    workshop_type: "Authorised", excess: 700,
    quote_url: "https://www.axa.com.sg/car-insurance",
  },
  {
    category: "car", insurer: "NTUC Income", plan_name: "Classic", tier: "standard",
    price: 1300, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Lifetime repair guarantee"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://www.income.com.sg/car-insurance",
  },
  {
    category: "car", insurer: "DirectAsia", plan_name: "Comprehensive", tier: "standard",
    price: 1150, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Free-choice workshops", "NCB protection available", "No-frills online pricing"],
    workshop_type: "Free choice", excess: 700,
    quote_url: "https://www.directasia.com/car-insurance/",
  },
];

async function seed() {
  const allRates = [...travel, ...home, ...life, ...car].map((r) => ({
    ...r,
    last_updated: TODAY,
  }));

  // Clear existing rates and re-seed
  const { error: delErr } = await supabase.from("insurance_rates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) { console.error("Delete error:", delErr); process.exit(1); }

  const { error } = await supabase.from("insurance_rates").insert(allRates);
  if (error) { console.error("Insert error:", error); process.exit(1); }

  console.log(`✓ Seeded ${allRates.length} insurance rates (${travel.length} travel, ${home.length} home, ${life.length} life, ${car.length} car)`);
}

seed();
