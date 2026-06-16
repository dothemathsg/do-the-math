/**
 * Builds /public/sg-districts.geojson from the URA Master Plan 2019 Planning Area
 * boundary data (scripts/data/sg-planning-areas-2019.geojson, sourced from
 * data.gov.sg dataset d_4765db0e87b9c86336792efe8a1f7a66).
 *
 * Maps 55 planning areas → 26 postal districts, unions polygons, then applies
 * minimal simplification for web delivery.
 *
 * Re-run with: node scripts/buildDistrictGeoJSON.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import simplify from "@turf/simplify";
import union from "@turf/union";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, "data", "sg-planning-areas-2019.geojson");
const outPath = join(__dirname, "..", "public", "sg-districts.geojson");

const source = JSON.parse(readFileSync(srcPath, "utf8"));

// ---------------------------------------------------------------------------
// Planning area code → postal district
//
// Based on URA REALIS district assignments and verified against Singapore Post's
// postal district reference. Key fixes vs the previous mapping:
//   • BM (Bukit Merah) → D03, not D28 — it's in the SOUTH, not the northeast
//   • BS (Bishan) → D20, not D12 — adjacent to Ang Mo Kio
//   • BK (Bukit Batok) → D23, not D21 — Choa Chu Kang / Bukit Batok area
//   • BP (Bukit Panjang) → D21 — covers the Hillview / Upper Bukit Timah area
//   • WD (Woodlands) → D25, not D27 — Kranji / Woodlands belt in the north
//   • PN (Pioneer) → D22, not D19 — Pioneer is the western Jurong area
// ---------------------------------------------------------------------------
const AREA_TO_DISTRICT = {
  // D01 — Raffles Place, Cecil, Marina, People's Park
  DT: 1, MS: 1, ME: 1, SR: 1, MU: 1,
  // D02 — Anson, Tanjong Pagar
  OT: 2,
  // D03 — Queenstown, Tiong Bahru, Bukit Merah
  QT: 3, BM: 3,
  // D04 — Harbourfront, Telok Blangah, Sentosa
  SI: 4, SV: 4,
  // D05 — Buona Vista, West Coast, Clementi
  CL: 5,
  // D06 — High Street, Clarke Quay (Rochor planning area)
  RC: 6,
  // D07 — Beach Road, Bugis (Kallang planning area)
  KL: 7,
  // D09 — Orchard, Cairnhill, River Valley
  OR: 9, RV: 9, NT: 9, TN: 9,
  // D10 — Ardmore, Bukit Timah, Holland Road, Tanglin
  BT: 10,
  // D11 — Watten Estate, Novena, Thomson
  NV: 11,
  // D12 — Balestier, Toa Payoh
  TP: 12,
  // D14 — Geylang, Eunos, Paya Lebar
  GL: 14, PL: 14,
  // D15 — Katong, Joo Chiat, Amber Road
  MP: 15,
  // D16 — Bedok, Upper East Coast
  BD: 16,
  // D17 — Changi, Loyang
  // CB (Changi Bay) excluded: maritime zone polygon extends south to lat 1.29,
  // overlapping mainland districts and hijacking mouse events
  CH: 17,
  // D18 — Tampines, Pasir Ris
  TM: 18, PR: 18,
  // D19 — Serangoon Garden, Hougang, Sengkang, Punggol
  HG: 19, SG: 19, SE: 19, PG: 19,
  // D20 — Bishan, Ang Mo Kio (Bishan fixed from D12)
  AM: 20, BS: 20,
  // D21 — Upper Bukit Timah, Hillview, Bukit Panjang
  BP: 21,
  // D22 — Boon Lay, Jurong, Tuas, Pioneer (Pioneer fixed from D19)
  JE: 22, JW: 22, BL: 22, TS: 22, WI: 22, WC: 22, PN: 22,
  // D23 — Choa Chu Kang, Bukit Batok (BK fixed from D21, BP moved to D21)
  CK: 23, BK: 23,
  // D24 — Lim Chu Kang, Tengah
  LK: 24, TH: 24,
  // D25 — Kranji, Woodlands, Sungei Kadut (WD fixed from D27)
  SK: 25, WD: 25,
  // D26 — Upper Thomson, Mandai, Central Water Catchment
  MD: 26, CC: 26,
  // D27 — Yishun, Sembawang, Simpang
  YS: 27, SB: 27, SM: 27,
  // D28 — Seletar
  // NE (North-Eastern Islands) excluded: its sea-boundary polygon extends south
  // to lat 1.3375, sitting on top of D16/D17/D18 due to D28 rendering last in SVG order
  SL: 28,
};

const DISTRICT_NAMES = {
  1:  "Raffles Place / Marina",
  2:  "Tanjong Pagar",
  3:  "Queenstown / Bukit Merah",
  4:  "Harbourfront / Sentosa",
  5:  "Buona Vista / Clementi",
  6:  "City Hall / Clarke Quay",
  7:  "Beach Road / Bugis",
  9:  "Orchard / River Valley",
  10: "Bukit Timah / Holland",
  11: "Novena / Thomson",
  12: "Toa Payoh / Balestier",
  14: "Geylang / Eunos",
  15: "Katong / Joo Chiat",
  16: "Bedok",
  17: "Changi / Loyang",
  18: "Tampines / Pasir Ris",
  19: "Hougang / Sengkang / Punggol",
  20: "Ang Mo Kio / Bishan",
  21: "Bukit Panjang / Hillview",
  22: "Jurong / Boon Lay",
  23: "Choa Chu Kang / Bukit Batok",
  24: "Lim Chu Kang / Tengah",
  25: "Woodlands / Kranji",
  26: "Mandai / Upper Thomson",
  27: "Yishun / Sembawang",
  28: "Seletar",
};

// ---------------------------------------------------------------------------
// Build per-district feature lists from source planning areas
// ---------------------------------------------------------------------------
const byDistrict = {};

for (const feat of source.features) {
  const code = feat.properties.PLN_AREA_C;
  const district = AREA_TO_DISTRICT[code];
  if (!district) continue;
  if (!byDistrict[district]) byDistrict[district] = [];
  byDistrict[district].push(feat);
}

// ---------------------------------------------------------------------------
// Union planning areas within each district
// @turf/union v7 takes a FeatureCollection, not two separate arguments
// ---------------------------------------------------------------------------
const districtFeatures = Object.entries(byDistrict)
  .sort((a, b) => +a[0] - +b[0])
  .map(([district, feats]) => {
    const d = +district;

    let merged;
    try {
      merged = union({ type: "FeatureCollection", features: feats });
    } catch {
      merged = feats[0]; // fallback: use first area if union fails
    }

    // Simplification: 0.00003° ≈ 3m keeps coastline detail while
    // halving file size vs no simplification
    let simplified = merged;
    try {
      simplified = simplify(merged, {
        tolerance: 0.00003,
        highQuality: true,
        mutate: false,
      });
    } catch {
      // fall back to unsimplified
    }

    return {
      type: "Feature",
      properties: {
        district: d,
        name: DISTRICT_NAMES[d] ?? `D${d}`,
      },
      geometry: simplified.geometry,
    };
  });

const geojson = { type: "FeatureCollection", features: districtFeatures };

writeFileSync(outPath, JSON.stringify(geojson));
console.log(`Written ${districtFeatures.length} district features → ${outPath}`);
Object.entries(byDistrict)
  .sort((a, b) => +a[0] - +b[0])
  .forEach(([d, feats]) => {
    const name = DISTRICT_NAMES[+d] ?? `D${d}`;
    const areas = feats
      .map((f) => f.properties.PLN_AREA_N)
      .join(", ");
    console.log(`  D${String(d).padStart(2, "0")} ${name.padEnd(30)} ← ${areas}`);
  });
