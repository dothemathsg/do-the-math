// Run: npx tsx scripts/seedInsuranceRates.ts
// Rates are indicative. Verify with each insurer before purchase.
// Updated: cross-referenced against SingSaver, FWD, Singlife, DirectAsia, NTUC Income, MSIG direct sites.

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
// Plan names and coverage verified against insurer sites + SingSaver (Jun 2026)
const travel = [
  // ── Etiqa ──
  {
    category: "travel", insurer: "Etiqa", plan_name: "ePROTECT Essential", tier: "basic",
    price: 19, price_unit: "per-trip", coverage_limit: 150_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$150K", "Trip cancellation S$5K", "Baggage loss S$2K", "Travel delay S$100/6h"],
    quote_url: "https://www.etiqa.com.sg/personal/travel-insurance/",
  },
  // ── Singlife — plan names and coverage verified against singlife.com ──
  // Travel Lite: S$250K (was stored as S$200K — corrected)
  {
    category: "travel", insurer: "Singlife", plan_name: "Travel Lite", tier: "basic",
    price: 21, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage loss S$3K", "Travel delay S$100/6h"],
    quote_url: "https://singlife.com/en/travel-insurance",
  },
  // Travel Plus replaces "Travel Standard" — coverage upgraded to S$1M per singlife.com
  {
    category: "travel", insurer: "Singlife", plan_name: "Travel Plus", tier: "standard",
    price: 32, price_unit: "per-trip", coverage_limit: 1_000_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$1M", "Trip cancellation S$10K", "Baggage loss S$5K", "COVID-19 cover"],
    quote_url: "https://singlife.com/en/travel-insurance",
  },
  // ── DirectAsia — plan names corrected to Voyager series; coverage corrected ──
  // Previous names Silver/Gold/Platinum were wrong — actual plans are Voyager 150/250/500
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Voyager 150", tier: "basic",
    price: 22, price_unit: "per-trip", coverage_limit: 150_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$150K", "Trip cancellation S$3K", "Baggage loss S$1K", "24h emergency assistance"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Voyager 250", tier: "standard",
    price: 31, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$10K", "Baggage loss S$3K", "24h emergency assistance"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
  {
    category: "travel", insurer: "DirectAsia", plan_name: "Voyager 500", tier: "premium",
    price: 40, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$15K", "Baggage loss S$5K", "Free child cover"],
    quote_url: "https://www.directasia.com/travel-insurance/",
  },
  // ── FWD — plan names corrected; Premium=entry, Business=mid, First=top ──
  // Previous data had First/Premium swapped. FWD's tier order: Premium < Business < First
  {
    category: "travel", insurer: "FWD", plan_name: "Premium", tier: "basic",
    price: 23, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$7.5K", "Baggage loss S$3K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  {
    category: "travel", insurer: "FWD", plan_name: "Business", tier: "standard",
    price: 37, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  {
    category: "travel", insurer: "FWD", plan_name: "First", tier: "premium",
    price: 48, price_unit: "per-trip", coverage_limit: 1_000_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$1M", "Trip cancellation S$15K", "Baggage loss S$7.5K", "COVID-19 cover"],
    quote_url: "https://www.fwd.com.sg/travel-insurance/",
  },
  // ── NTUC Income — plan names/coverage corrected per income.com.sg ──
  // Classic: S$250K (was S$200K); Deluxe added; Preferred: S$1M (was S$500K)
  {
    category: "travel", insurer: "NTUC Income", plan_name: "Classic", tier: "basic",
    price: 25, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage loss S$3K", "PA cover S$100K"],
    quote_url: "https://www.income.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "NTUC Income", plan_name: "Deluxe", tier: "standard",
    price: 36, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "PA cover S$200K"],
    quote_url: "https://www.income.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "NTUC Income", plan_name: "Preferred", tier: "premium",
    price: 46, price_unit: "per-trip", coverage_limit: 1_000_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$1M", "Trip cancellation S$15K", "Baggage loss S$7.5K", "PA cover S$500K"],
    quote_url: "https://www.income.com.sg/travel-insurance",
  },
  // ── Allianz — renamed to Travel Hero series per current product lineup ──
  {
    category: "travel", insurer: "Allianz", plan_name: "Travel Hero Bronze", tier: "basic",
    price: 26, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage loss S$3K", "24h global assistance"],
    quote_url: "https://www.allianz.com.sg/travel-insurance.html",
  },
  {
    category: "travel", insurer: "Allianz", plan_name: "Travel Hero Gold", tier: "standard",
    price: 40, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage loss S$5K", "24h global assistance"],
    quote_url: "https://www.allianz.com.sg/travel-insurance.html",
  },
  // ── MSIG ──
  {
    category: "travel", insurer: "MSIG", plan_name: "TravelEasy Standard", tier: "basic",
    price: 28, price_unit: "per-trip", coverage_limit: 250_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$250K", "Trip cancellation S$5K", "Baggage delay S$200/6h", "PA cover S$150K"],
    quote_url: "https://www.msig.com.sg/insurance/personal-insurance",
  },
  {
    category: "travel", insurer: "MSIG", plan_name: "TravelEasy Elite", tier: "standard",
    price: 39, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$10K", "Baggage delay S$300/6h", "PA cover S$200K"],
    quote_url: "https://www.msig.com.sg/insurance/personal-insurance",
  },
  // ── AXA ──
  {
    category: "travel", insurer: "AXA", plan_name: "SmartTraveller Essential", tier: "basic",
    price: 28, price_unit: "per-trip", coverage_limit: 200_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$200K", "Trip cancellation S$5K", "Baggage loss S$3K", "Travel delay S$100/6h"],
    quote_url: "https://www.axa.com.sg/travel-insurance",
  },
  {
    category: "travel", insurer: "AXA", plan_name: "SmartTraveller Comprehensive", tier: "standard",
    price: 41, price_unit: "per-trip", coverage_limit: 500_000, coverage_limit_label: "Medical cover",
    key_features: ["Medical & hospitalisation S$500K", "Trip cancellation S$15K", "Baggage loss S$8K", "Travel delay S$200/6h"],
    quote_url: "https://www.axa.com.sg/travel-insurance",
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
    category: "home", insurer: "NTUC Income", plan_name: "Enhanced Home Insurance", tier: "standard",
    price: 178, price_unit: "annual", coverage_limit: 100_000, coverage_limit_label: "Contents + renovation",
    key_features: ["Contents S$50K", "Renovation S$50K", "Personal liability S$1M", "Worldwide contents cover"],
    quote_url: "https://www.income.com.sg/enhanced-home-insurance",
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
    quote_url: "https://www.msig.com.sg/insurance/personal-insurance",
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
    quote_url: "https://www.greateasternlife.com/sg/en/personal-insurance/our-products/life-insurance.html",
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
    quote_url: "https://www.prudential.com.sg/products/life-insurance/term-life-insurance",
  },
];

// ─── CAR ──────────────────────────────────────────────────────────────────────
// Workshop type and excess verified against SingSaver (Jun 2026)
// Prices are indicative starting premiums — actual rates depend on vehicle/driver profile
const car = [
  // HL Assurance: plan name corrected to Car Protect360; workshop = any; excess S$0
  {
    category: "car", insurer: "HL Assurance", plan_name: "Car Protect360", tier: "standard",
    price: 1000, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Any workshop", "NCB protection available", "24h roadside assistance"],
    workshop_type: "Free choice", excess: 0,
    quote_url: "https://www.hlas.com.sg/car-insurance/",
  },
  // Etiqa: plan name corrected to TIQ Comprehensive (Etiqa's online brand); excess S$0
  {
    category: "car", insurer: "Etiqa", plan_name: "TIQ Comprehensive", tier: "standard",
    price: 1050, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Flood & storm cover"],
    workshop_type: "Authorised", excess: 0,
    quote_url: "https://www.etiqa.com.sg/personal/motor-insurance/",
  },
  // Singlife: expanded to 3 actual products — Motor Lite / Standard / Prestige
  {
    category: "car", insurer: "Singlife", plan_name: "Motor Lite", tier: "standard",
    price: 1000, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "24h roadside assistance"],
    workshop_type: "Authorised", excess: 300,
    quote_url: "https://singlife.com/en/car-insurance",
  },
  {
    category: "car", insurer: "Singlife", plan_name: "Motor Standard", tier: "standard",
    price: 1100, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Any workshop", "NCB protection available", "Lifetime workshop guarantee"],
    workshop_type: "Free choice", excess: 300,
    quote_url: "https://singlife.com/en/car-insurance",
  },
  {
    category: "car", insurer: "Singlife", plan_name: "Motor Prestige", tier: "standard",
    price: 1400, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Any workshop", "Enhanced coverage", "Courtesy car included"],
    workshop_type: "Free choice", excess: 300,
    quote_url: "https://singlife.com/en/car-insurance",
  },
  {
    category: "car", insurer: "FWD", plan_name: "Car Insurance", tier: "standard",
    price: 1200, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "Courtesy car"],
    workshop_type: "Authorised", excess: 600,
    quote_url: "https://www.fwd.com.sg/car-insurance/",
  },
  // MSIG: workshop corrected to Authorised (not Free choice); excess corrected to S$500
  {
    category: "car", insurer: "MSIG", plan_name: "MotorMax", tier: "standard",
    price: 1200, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "30+ authorised workshops", "NCB protection available", "Personal accident cover"],
    workshop_type: "Authorised", excess: 500,
    quote_url: "https://www.msig.com.sg/insurance/personal-insurance",
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
    quote_url: "https://www.income.com.sg/drivo-car-insurance",
  },
  // DirectAsia: workshop corrected to Authorised; excess corrected to S$0
  {
    category: "car", insurer: "DirectAsia", plan_name: "Comprehensive", tier: "standard",
    price: 1150, price_unit: "annual", coverage_limit: null, coverage_limit_label: null,
    key_features: ["Comprehensive cover", "Authorised workshops", "NCB protection available", "No-frills online pricing"],
    workshop_type: "Authorised", excess: 0,
    quote_url: "https://www.directasia.com/car-insurance/",
  },
];

async function seed() {
  const allRates = [...travel, ...home, ...life, ...car].map((r) => ({
    ...r,
    last_updated: TODAY,
  }));

  const { error: delErr } = await supabase
    .from("insurance_rates")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) { console.error("Delete error:", delErr); process.exit(1); }

  const { error } = await supabase.from("insurance_rates").insert(allRates);
  if (error) { console.error("Insert error:", error); process.exit(1); }

  const travelCount = travel.length;
  const homeCount = home.length;
  const lifeCount = life.length;
  const carCount = car.length;
  console.log(`✓ Seeded ${allRates.length} insurance rates (${travelCount} travel, ${homeCount} home, ${lifeCount} life, ${carCount} car)`);
  console.log("\nCorrections applied:");
  console.log("  Travel: FWD plan names corrected (Premium/Business/First order)");
  console.log("  Travel: DirectAsia renamed Silver/Gold/Platinum → Voyager 150/250/500, coverage corrected");
  console.log("  Travel: Singlife Travel Standard → Travel Plus, coverage S$500K → S$1M");
  console.log("  Travel: NTUC Income Classic coverage S$200K → S$250K; Deluxe added; Preferred coverage → S$1M");
  console.log("  Travel: Allianz renamed Bronze/Gold → Travel Hero Bronze/Gold");
  console.log("  Car: HL Assurance plan renamed to Car Protect360, workshop=Any, excess=S$0");
  console.log("  Car: Etiqa renamed to TIQ Comprehensive, excess corrected to S$0");
  console.log("  Car: Singlife expanded to Motor Lite/Standard/Prestige");
  console.log("  Car: MSIG MotorMax workshop corrected to Authorised, excess S$600 → S$500");
  console.log("  Car: DirectAsia workshop corrected to Authorised, excess S$700 → S$0");
}

seed();
