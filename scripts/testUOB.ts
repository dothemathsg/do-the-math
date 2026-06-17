import { config } from "dotenv";
config({ path: ".env.local" });
import { scrapeUOB } from "./banks/uob";

scrapeUOB()
  .then((r) => { console.log(`UOB: ${r.length} rate(s)`); r.forEach((x) => console.log(`  ${x.product_name}: ${x.interest_rate}%`)); })
  .catch((e) => { console.error("Failed:", e.message); process.exit(1); });
