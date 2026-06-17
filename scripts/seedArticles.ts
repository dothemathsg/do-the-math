import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const newArticles = [
  {
    slug: "hdb-bto-guide-singapore",
    title: "HDB BTO Guide: How to Apply and What to Expect",
    published_at: "2026-05-25T00:00:00+00:00",
    content: `<p>Buying a Build-To-Order (BTO) flat is the most common path to homeownership in Singapore. BTO flats are sold directly by HDB at subsidised prices before they are built, typically taking 3–5 years to complete. This guide walks you through the entire process.</p>

<h2>What Is a BTO Flat?</h2>
<p>BTO stands for Build-To-Order. HDB launches new BTO exercises quarterly, offering flats in various towns across Singapore. Unlike resale flats, BTO flats are priced with significant government subsidies and are only available to eligible applicants.</p>

<h2>The New Flat Classification: Standard, Plus and Prime</h2>
<p>From October 2024, HDB replaced the old Mature/Non-Mature estate classification with three new flat types:</p>
<ul>
  <li><strong>Standard flats</strong> — Located in non-central towns. Standard subsidies, 5-year Minimum Occupation Period (MOP), no resale restrictions beyond MOP.</li>
  <li><strong>Plus flats</strong> — Better locations with good amenities or transport access. Enhanced subsidies, 10-year MOP, and buyers must meet an income ceiling when purchasing on the resale market.</li>
  <li><strong>Prime flats</strong> — City fringe and central locations. Highest subsidies, 10-year MOP, and HDB claws back a portion of subsidies upon resale.</li>
</ul>
<p>The classification determines both the level of subsidy and the restrictions attached to the flat — the better the location, the stricter the conditions.</p>

<h2>Who Can Apply?</h2>
<ul>
  <li>At least one applicant is a Singapore Citizen; the co-applicant must be a Citizen or Permanent Resident.</li>
  <li>At least 21 years old (singles applying under the Single Singapore Citizen scheme must be 35).</li>
  <li>Household income does not exceed the prevailing income ceiling (currently $14,000/month for families; $7,000 for singles).</li>
  <li>You do not own or have an interest in any private residential property locally or overseas.</li>
  <li>You have not previously purchased a subsidised HDB flat more than once.</li>
</ul>

<h2>The Application Process</h2>
<ol>
  <li><strong>Check the launch</strong> — HDB announces BTO launches on its website. Each exercise typically covers 4–8 towns with a range of flat types (2-room Flexi to 5-room).</li>
  <li><strong>Submit your application</strong> — Applications are open for about a week on the HDB Flat Portal. There is no cost to apply.</li>
  <li><strong>Balloting</strong> — HDB ballots applicants and issues queue numbers. First-timer families receive priority and two ballot chances before being counted as second-timers.</li>
  <li><strong>Select your flat</strong> — When your queue number is called, you attend a flat selection appointment to choose your unit and sign the Lease Agreement for Tender.</li>
  <li><strong>Pay the option fee</strong> — A $2,000 option fee is payable at selection (credited toward the purchase price).</li>
  <li><strong>Sign the Agreement for Lease</strong> — Within four months, you sign the formal agreement and pay the down payment.</li>
  <li><strong>Wait for completion</strong> — Construction typically takes 3–5 years. HDB will notify you when the flat is ready for collection.</li>
  <li><strong>Key collection</strong> — Collect your keys, complete the final payment, and move in.</li>
</ol>

<h2>Financing Your BTO Flat</h2>
<p>You can finance your BTO flat using an HDB loan, a bank loan, or a combination of CPF savings and cash. The HDB loan rate is 2.6% per annum (0.1% above the CPF Ordinary Account rate). Bank loans are linked to market rates (typically SORA-based) and can be lower, but come with more variability. CPF Ordinary Account savings can be used for the down payment and monthly instalments.</p>
<p>Use our <a href="/calculator">mortgage calculator</a> to estimate your monthly repayments before you apply.</p>

<h2>Priority Schemes</h2>
<ul>
  <li><strong>Married Child Priority Scheme (MCPS)</strong> — Married children applying to live near their parents.</li>
  <li><strong>Multigeneration Priority Scheme (MGPS)</strong> — Families applying together for two flats in the same project.</li>
  <li><strong>Third Child Priority Scheme (TCPS)</strong> — Families with three or more children.</li>
  <li><strong>Parenthood Priority Scheme (PPS)</strong> — Families with children or pregnant applicants.</li>
</ul>

<h2>Key Takeaways</h2>
<p>BTO flats offer the most affordable route to homeownership in Singapore, but they require patience. Ballot outcomes are uncertain and waiting times can be long. Starting early, understanding the flat classification, and having your finances in order before applying will put you in the best position.</p>`,
  },

  {
    slug: "buyer-stamp-duty-singapore",
    title: "Buyer's Stamp Duty (BSD) Explained: Rates and How to Calculate It",
    published_at: "2026-05-10T00:00:00+00:00",
    content: `<p>Buyer's Stamp Duty (BSD) is a tax payable when you purchase any property in Singapore — residential or commercial. It applies to all buyers regardless of nationality or the number of properties owned.</p>

<h2>What Is BSD?</h2>
<p>BSD is levied on the purchase price or market value of the property, whichever is higher. It must be paid within 14 days of signing the Sale and Purchase Agreement (or OTP exercise date).</p>

<h2>Current BSD Rates for Residential Property</h2>
<table>
  <thead><tr><th>Portion of Purchase Price</th><th>Rate</th></tr></thead>
  <tbody>
    <tr><td>First $180,000</td><td>1%</td></tr>
    <tr><td>Next $180,000</td><td>2%</td></tr>
    <tr><td>Next $640,000</td><td>3%</td></tr>
    <tr><td>Next $500,000</td><td>4%</td></tr>
    <tr><td>Next $1,500,000</td><td>5%</td></tr>
    <tr><td>Remaining amount above $3,000,000</td><td>6%</td></tr>
  </tbody>
</table>

<h2>BSD Calculation Example</h2>
<p>For a property at <strong>$1,500,000</strong>:</p>
<ul>
  <li>First $180,000 × 1% = $1,800</li>
  <li>Next $180,000 × 2% = $3,600</li>
  <li>Next $640,000 × 3% = $19,200</li>
  <li>Next $500,000 × 4% = $20,000</li>
  <li><strong>Total BSD = $44,600</strong></li>
</ul>

<h2>Who Pays BSD?</h2>
<p>The buyer always pays BSD. There are no exemptions for first-time buyers, and it applies equally to Singapore Citizens and foreigners. BSD is separate from Additional Buyer's Stamp Duty (ABSD), which is layered on top for certain buyer profiles.</p>

<h2>Can You Use CPF to Pay BSD?</h2>
<p>No. BSD must be paid in cash. CPF savings can only be used for the property purchase price and certain related costs — not stamp duty.</p>

<p>Use our <a href="/calculator">Stamp Duty Calculator</a> to compute your exact BSD and ABSD instantly.</p>`,
  },

  {
    slug: "absd-singapore-guide",
    title: "ABSD Explained: Additional Buyer's Stamp Duty Rates and Who Pays",
    published_at: "2026-04-20T00:00:00+00:00",
    content: `<p>Additional Buyer's Stamp Duty (ABSD) is a tax on top of the standard Buyer's Stamp Duty (BSD) that applies when you purchase residential property in Singapore. Introduced in 2011 as a cooling measure and revised multiple times since, understanding ABSD is essential before buying any property here.</p>

<h2>Current ABSD Rates (Effective 27 April 2023)</h2>
<table>
  <thead><tr><th>Buyer Profile</th><th>1st Property</th><th>2nd Property</th><th>3rd and Above</th></tr></thead>
  <tbody>
    <tr><td>Singapore Citizen</td><td>0%</td><td>20%</td><td>30%</td></tr>
    <tr><td>Permanent Resident</td><td>5%</td><td>30%</td><td>35%</td></tr>
    <tr><td>Foreigner</td><td>60%</td><td>60%</td><td>60%</td></tr>
    <tr><td>Entities (companies, trusts)</td><td colspan="3">65%</td></tr>
  </tbody>
</table>
<p>ABSD is calculated on the purchase price or market value, whichever is higher.</p>

<h2>What Counts as a Residential Property?</h2>
<p>ABSD applies to HDB flats, private condominiums and apartments, landed property, and Executive Condominiums during the initial purchase phase.</p>

<h2>How Property Count Works for Couples</h2>
<p>For married couples, the ABSD count is based on the combined residential property holdings of both spouses. If your spouse owns a property and you jointly purchase another, it is treated as a second property — even if it is your first individual purchase.</p>

<h2>ABSD Remission for Singapore Citizen Couples</h2>
<p>Singapore Citizen couples purchasing their second residential property together may apply for an ABSD remission — getting the 20% refunded — if they sell their first property within 6 months of the second property's purchase completion or key collection. Both spouses must be Singapore Citizens, and the application must be made to IRAS.</p>

<h2>ABSD Calculation Example</h2>
<p>A Singapore Citizen buying a second property at $1,500,000:</p>
<ul>
  <li>BSD: $44,600</li>
  <li>ABSD: $1,500,000 × 20% = $300,000</li>
  <li><strong>Total stamp duty: $344,600</strong></li>
</ul>

<p>Use our <a href="/calculator">Stamp Duty Calculator</a> to compute your BSD and ABSD based on your residency status and number of properties owned.</p>`,
  },

  {
    slug: "hdb-loan-vs-bank-loan",
    title: "HDB Loan vs Bank Loan: Which Is Better for Your Flat?",
    published_at: "2026-04-05T00:00:00+00:00",
    content: `<p>When financing an HDB flat, you have two options: an HDB Concessionary Loan or a bank loan. Each has distinct advantages depending on your financial situation, risk appetite, and long-term plans.</p>

<h2>Side-by-Side Comparison</h2>
<table>
  <thead><tr><th></th><th>HDB Loan</th><th>Bank Loan</th></tr></thead>
  <tbody>
    <tr><td>Interest Rate</td><td>2.6% p.a. (stable)</td><td>Market rate (SORA-based, variable)</td></tr>
    <tr><td>Maximum LTV</td><td>80%</td><td>75%</td></tr>
    <tr><td>Min. Cash Down Payment</td><td>None (fully CPF)</td><td>5% cash required</td></tr>
    <tr><td>Lock-in Period</td><td>None</td><td>Typically 2–3 years</td></tr>
    <tr><td>Prepayment Penalty</td><td>None</td><td>Yes, during lock-in</td></tr>
    <tr><td>Switch to other type</td><td>Can switch to bank loan</td><td>Cannot switch back to HDB loan</td></tr>
  </tbody>
</table>

<h2>The HDB Loan: Stability and Flexibility</h2>
<p>The HDB loan charges 2.6% per annum — pegged at 0.1% above the CPF Ordinary Account rate. Key benefits:</p>
<ul>
  <li><strong>Higher LTV</strong> — Borrow up to 80% of flat value, reducing upfront cash outlay.</li>
  <li><strong>No cash down payment</strong> — The full 20% down payment can come from CPF OA savings.</li>
  <li><strong>No lock-in or penalty</strong> — Prepay at any time without penalty.</li>
  <li><strong>One-way flexibility</strong> — You can refinance to a bank loan later, but not back.</li>
</ul>

<h2>The Bank Loan: Lower Rates, More Risk</h2>
<p>Bank loans are SORA-pegged and can offer lower rates than 2.6%, especially in a falling rate environment. But:</p>
<ul>
  <li>You need at least 5% cash for the down payment (on top of CPF).</li>
  <li>Lock-in periods mean prepayment incurs a penalty (typically 1.5%).</li>
  <li>Rates can rise with SORA movements, increasing your monthly repayment.</li>
</ul>

<h2>Which Should You Choose?</h2>
<ul>
  <li><strong>Choose HDB loan</strong> if you have limited cash savings, prefer payment certainty, or want prepayment flexibility.</li>
  <li><strong>Choose bank loan</strong> if current market rates are meaningfully below 2.6% and you have the cash for the higher down payment.</li>
</ul>
<p>A common strategy: start with an HDB loan for stability, then refinance to a bank loan when market conditions are favourable. Since the switch is one-way, think carefully before committing to a bank loan from the start.</p>

<p>Compare current mortgage rates on our <a href="/mortgage-rates">rates page</a> and model your repayments with the <a href="/calculator">mortgage calculator</a>.</p>`,
  },

  {
    slug: "hdb-standard-plus-prime-classification",
    title: "HDB Standard, Plus and Prime Flats: What the New Classification Means for You",
    published_at: "2026-03-20T00:00:00+00:00",
    content: `<p>In October 2024, HDB rolled out a new flat classification system to replace the old Mature and Non-Mature estate labels. The new framework — Standard, Plus and Prime — reflects the varying levels of locational advantage and comes with differentiated resale conditions to keep public housing affordable for future buyers.</p>

<h2>Why the Change?</h2>
<p>The old Mature/Non-Mature classification was based on estate age and had become a poor proxy for desirability. Many Non-Mature towns had developed significantly over decades, while some Mature estates were no longer particularly central. The new classification anchors categorisation to actual locational advantage and subsidy level.</p>

<h2>Standard Flats</h2>
<p>Standard flats make up the majority of BTO supply and are located in towns without exceptional locational advantages.</p>
<ul>
  <li><strong>MOP:</strong> 5 years</li>
  <li><strong>Subsidy clawback:</strong> None</li>
  <li><strong>Resale income ceiling:</strong> None — can be sold on the open market after MOP</li>
  <li><strong>Full flat rental:</strong> Permitted after MOP</li>
</ul>

<h2>Plus Flats</h2>
<p>Plus flats are in better-located areas with stronger transport links, proximity to town centres, or good amenities.</p>
<ul>
  <li><strong>MOP:</strong> 10 years</li>
  <li><strong>Subsidy clawback:</strong> None</li>
  <li><strong>Resale income ceiling:</strong> Yes — resale buyers must meet income ceiling</li>
  <li><strong>Full flat rental:</strong> Not permitted</li>
</ul>

<h2>Prime Flats</h2>
<p>Prime flats are in the most desirable locations — city fringe, near the CBD, or areas with very high amenity value such as Queenstown, Toa Payoh, and Kallang.</p>
<ul>
  <li><strong>MOP:</strong> 10 years</li>
  <li><strong>Subsidy clawback:</strong> Yes — HDB recovers a percentage of the resale proceeds</li>
  <li><strong>Resale income ceiling:</strong> Yes</li>
  <li><strong>Full flat rental:</strong> Not permitted</li>
</ul>

<h2>Quick Reference</h2>
<table>
  <thead><tr><th></th><th>Standard</th><th>Plus</th><th>Prime</th></tr></thead>
  <tbody>
    <tr><td>MOP</td><td>5 years</td><td>10 years</td><td>10 years</td></tr>
    <tr><td>Subsidy clawback on resale</td><td>No</td><td>No</td><td>Yes</td></tr>
    <tr><td>Resale income ceiling</td><td>No</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Full flat rental allowed</td><td>After MOP</td><td>No</td><td>No</td></tr>
  </tbody>
</table>

<h2>What This Means for Buyers</h2>
<p>Plus and Prime flats receive more subsidy precisely because they carry heavier restrictions. If you are buying for long-term owner-occupation and want a centrally located flat at a subsidised price, the restrictions may be worth accepting. If you value flexibility to sell, upgrade, or rent out the whole flat, a Standard flat gives you more options after MOP.</p>
<p>Read our <a href="/articles/hdb-bto-guide-singapore">full BTO application guide</a> for the complete picture on applying.</p>`,
  },

  {
    slug: "msr-tdsr-difference-singapore",
    title: "MSR vs TDSR: What's the Difference and How Do They Affect Your Loan?",
    published_at: "2026-03-05T00:00:00+00:00",
    content: `<p>When applying for a property loan in Singapore, two credit limits determine how much you can borrow: the Mortgage Servicing Ratio (MSR) and the Total Debt Servicing Ratio (TDSR). Both apply simultaneously in some cases, but they serve different purposes.</p>

<h2>Mortgage Servicing Ratio (MSR)</h2>
<p>The MSR limits the portion of your gross monthly income that can service a mortgage on an HDB flat or Executive Condominium (EC) within the first 10 years.</p>
<ul>
  <li><strong>Cap:</strong> 30% of gross monthly income</li>
  <li><strong>Applies to:</strong> HDB flat loans and bank loans for ECs within the first 10 years</li>
  <li><strong>Does not apply to:</strong> Private residential properties</li>
</ul>
<p><strong>Example:</strong> Gross household income = $10,000/month. Maximum HDB mortgage repayment = $3,000/month.</p>

<h2>Total Debt Servicing Ratio (TDSR)</h2>
<p>The TDSR caps the total proportion of income used to service <em>all</em> debt — including property loans, car loans, personal loans, and credit card minimums.</p>
<ul>
  <li><strong>Cap:</strong> 55% of gross monthly income</li>
  <li><strong>Applies to:</strong> All property loans in Singapore</li>
</ul>
<p><strong>Example:</strong> Income $10,000/month, existing car loan $800/month. Maximum total debt = $5,500, so maximum mortgage = $4,700/month.</p>

<h2>How They Work Together</h2>
<p>For HDB flat buyers, both MSR and TDSR apply simultaneously — the more restrictive limit wins. In practice, MSR (30%) is almost always the binding constraint for HDB buyers since it is lower than TDSR (55%).</p>
<p>For private property buyers, only TDSR applies — there is no MSR.</p>

<h2>The Stress Test Rate</h2>
<p>Banks calculate MSR and TDSR using a stress test rate — currently a minimum of <strong>4% p.a.</strong> — not your actual loan rate. This ensures you can still service the loan if rates rise. Your actual repayment at the contracted rate will be lower than the stress-tested amount used for eligibility.</p>

<h2>How to Improve Your Borrowing Capacity</h2>
<ul>
  <li>Pay down or eliminate existing debts before applying — every existing repayment reduces TDSR headroom.</li>
  <li>Include all income sources. Variable income (bonuses, commissions) is typically counted at 70% of the past 12-month average.</li>
  <li>Apply jointly with a co-borrower to combine income.</li>
</ul>

<p>For a full breakdown, see our <a href="/articles/tdsr-explained-how-much-can-you-borrow">TDSR deep-dive</a>. Use the <a href="/calculator">mortgage calculator</a> to model different loan scenarios.</p>`,
  },

  {
    slug: "leasehold-vs-freehold-singapore",
    title: "Leasehold vs Freehold in Singapore: Does the Tenure Type Matter?",
    published_at: "2026-02-15T00:00:00+00:00",
    content: `<p>Whether to buy freehold or leasehold is one of the most debated topics in Singapore property. Tenure affects price, CPF usage, bank financing, and long-term value — here is what you actually need to know.</p>

<h2>Leasehold vs Freehold: The Basics</h2>
<table>
  <thead><tr><th></th><th>Leasehold (99-year)</th><th>Freehold</th></tr></thead>
  <tbody>
    <tr><td>Ownership duration</td><td>Fixed term (typically 99 years)</td><td>Indefinite</td></tr>
    <tr><td>Price premium</td><td>Base price</td><td>Typically 10–20% higher</td></tr>
    <tr><td>Supply in Singapore</td><td>Majority of properties</td><td>Rare, mainly older estates</td></tr>
    <tr><td>HDB flats</td><td>All HDB flats are 99-year leasehold</td><td>N/A</td></tr>
  </tbody>
</table>

<h2>How Lease Decay Affects Financing and CPF</h2>
<p>As a leasehold property ages, the remaining lease affects how it can be financed:</p>
<ul>
  <li><strong>Below 60 years remaining:</strong> Banks reduce the LTV ratio — you need more cash upfront.</li>
  <li><strong>Below 30 years remaining:</strong> CPF usage becomes highly restricted.</li>
  <li><strong>CPF rule:</strong> The remaining lease must cover the youngest buyer to age 95 for full CPF usage. A 40-year-old buyer needs at least 55 years of lease remaining.</li>
</ul>
<p>For a brand-new 99-year property, these constraints are decades away and generally not a concern for typical 10–20 year holding periods.</p>

<h2>En Bloc Potential</h2>
<p>Older leasehold developments in prime locations sometimes attract collective sales (en bloc), where all owners sell to a developer at a premium. The payout can far exceed individual market value. However, en bloc success requires owner consensus (80% by share value), strata title approval, and developer interest — it is never guaranteed and cannot be planned for.</p>

<h2>The Practical Verdict</h2>
<ul>
  <li><strong>Location matters more than tenure.</strong> A well-located leasehold property will outperform a poorly located freehold one every time.</li>
  <li><strong>For most buyers, 99-year leasehold is perfectly sound</strong> if purchased early in the lease and held for a typical period.</li>
  <li><strong>Freehold is worth the premium</strong> if you intend to pass the property to children over a very long horizon and want to avoid lease decay considerations entirely.</li>
  <li><strong>999-year leasehold</strong> is functionally equivalent to freehold for all practical purposes within any foreseeable holding period.</li>
</ul>`,
  },

  {
    slug: "cpf-property-singapore",
    title: "Using CPF for Your Home: What You Can (and Cannot) Pay For",
    published_at: "2026-02-01T00:00:00+00:00",
    content: `<p>CPF Ordinary Account (OA) savings are one of the most powerful tools Singaporeans have for property financing — but there are important rules and limits you need to understand before tapping into them.</p>

<h2>What Can CPF OA Be Used For?</h2>
<ul>
  <li>Down payment on an HDB flat or private property</li>
  <li>Monthly mortgage repayments (HDB and bank loans)</li>
  <li>Stamp duty (BSD and ABSD)</li>
  <li>Legal and conveyancing fees</li>
  <li>Home Protection Scheme (HPS) premiums</li>
</ul>
<p>CPF <strong>cannot</strong> be used for renovation, furniture, cash-over-valuation (COV) on resale flats, or maintenance fees.</p>

<h2>The Valuation Limit</h2>
<p>For private properties and HDB flats with a bank loan, you can use CPF OA up to the <strong>Valuation Limit</strong> — the lower of the purchase price or market valuation. Once reached, further CPF usage requires the remaining lease to cover the youngest owner to age 95.</p>

<h2>Accrued Interest: The Hidden Cost</h2>
<p>CPF OA withdrawals for property are not a grant — they are a loan from your own retirement account. The CPF Board accrues interest at the OA rate (currently 2.5% p.a., compounded annually) on every dollar withdrawn. When you sell, you must refund the full principal <strong>plus</strong> all accrued interest before receiving cash proceeds.</p>

<h3>Example</h3>
<p>Withdraw $200,000 from CPF, hold the property for 20 years:</p>
<ul>
  <li>Accrued interest at 2.5% over 20 years ≈ $127,000</li>
  <li><strong>Total CPF refund required: ~$327,000</strong></li>
</ul>
<p>This significantly reduces cash proceeds from a sale — many sellers are surprised by how much goes back to CPF.</p>

<h2>Impact on Retirement</h2>
<p>If your CPF balance after the property refund falls below the Full Retirement Sum (FRS) at the time of sale, CPF may require a further top-up from sale proceeds into your Retirement Account. Plan accordingly if you intend to sell and rely on the cash proceeds in retirement.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Every dollar of CPF used for property accrues 2.5% interest annually — factor this into your expected net sale proceeds.</li>
  <li>Heavy CPF usage over a long holding period can significantly reduce the cash you receive when you sell.</li>
  <li>For buyers close to retirement, consider the balance between paying down the mortgage in cash (to preserve CPF for retirement income) versus using CPF to conserve cash flow now.</li>
</ul>`,
  },

  {
    slug: "hdb-resale-market-million-dollar-flats",
    title: "Singapore HDB Resale Market: What's Behind the Rise of Million-Dollar Flats",
    published_at: "2026-01-15T00:00:00+00:00",
    content: `<p>The HDB resale market has seen a dramatic rise in prices, with million-dollar flat transactions reaching new records in recent years. What is driving this trend, and what does it mean for buyers and sellers?</p>

<h2>The Million-Dollar Flat Phenomenon</h2>
<p>As recently as 2019, only a handful of HDB flats transacted above $1 million annually. By 2023, over 400 such transactions occurred in a single year — and the figure has climbed further since. These are not just exceptional penthouse units: five-room and executive flats in well-located mature estates are increasingly crossing the threshold.</p>

<h2>Key Drivers of Resale Price Growth</h2>

<h3>BTO Supply Delays</h3>
<p>Disruptions during and after the COVID-19 pandemic caused significant BTO construction delays, extending waiting times from the usual 3–4 years to 5–6 years or more. Buyers who could not wait turned to resale, pushing up demand and prices.</p>

<h3>Sustained Housing Demand</h3>
<p>Singapore's strong employment market, inflow of global talent, and high formation rates among millennials created persistent demand for homes. More households forming over the same time period means more buyers competing for the same resale stock.</p>

<h3>Location Premium</h3>
<p>Flats commanding the highest prices are almost always in mature estates near MRT stations, top schools, and major amenities — Bishan, Toa Payoh, Queenstown, Kallang. Long remaining lease (70+ years) and high floors add further premium.</p>

<h3>ABSD Constraints on Private Market</h3>
<p>With ABSD at 60% for foreigners and 20% for citizens on a second property, some buyers who might otherwise have bought private property turned to the HDB resale market as a more affordable alternative, adding to competition.</p>

<h2>What It Means for Different Buyers</h2>
<ul>
  <li><strong>Sellers</strong> — Long-term owners in well-located estates are sitting on substantial gains that can fund retirement or an upgrade.</li>
  <li><strong>First-time buyers</strong> — The resale route has become expensive. BTO remains the most affordable path for those who are eligible and willing to wait.</li>
  <li><strong>Upgraders</strong> — The gap between mature estate HDB resale prices and entry-level private condos has narrowed in some areas, making the upgrade more financially accessible.</li>
</ul>

<h2>Government Response</h2>
<p>HDB has introduced several measures to moderate the market, including a 15-month wait-out period for private property downgraders before they can buy HDB resale, tighter HDB loan eligibility, and sustained increases in BTO supply. These have tempered price growth but structural demand remains robust.</p>

<p>Explore actual transaction prices across all Singapore districts on our <a href="/property-prices">property price map</a>.</p>`,
  },
];

async function main() {
  console.log(`Inserting ${newArticles.length} new articles…`);

  for (const article of newArticles) {
    const { error } = await supabase
      .from("articles")
      .upsert(article, { onConflict: "slug" });

    if (error) {
      console.error(`  ✗ ${article.slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${article.slug}`);
    }
  }

  console.log("Done.");
}

main().catch(console.error);
