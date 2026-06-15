import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const articles = [
  {
    title: "What Is SORA and How Does It Affect Your Home Loan?",
    slug: "what-is-sora-home-loan",
    published_at: "2026-06-01T00:00:00Z",
    content: `<p class="lead">If you've been shopping for a home loan in Singapore, you've almost certainly come across the term SORA. It appears in bank rate sheets, MAS announcements, and mortgage advisors' pitches — but what exactly is it, and why does it matter for your mortgage?</p>

<h2>What Is SORA?</h2>
<p>SORA stands for <strong>Singapore Overnight Rate Average</strong>. It is a benchmark interest rate published daily by the Monetary Authority of Singapore (MAS), calculated as the volume-weighted average rate of actual overnight borrowing transactions in Singapore's unsecured interbank market.</p>
<p>In simpler terms: SORA reflects what banks are actually paying each other to borrow money overnight. Because it is based on real transactions rather than estimates, it is considered more transparent and robust than the rates it replaced.</p>

<h2>Why Did Singapore Move to SORA?</h2>
<p>Before SORA, Singapore home loans were mostly pegged to <strong>SIBOR</strong> (Singapore Interbank Offered Rate) or <strong>SOR</strong> (Swap Offer Rate). Both have since been discontinued:</p>
<ul>
  <li><strong>SOR</strong> was retired in 2021 because it relied on USD/SGD foreign exchange transactions, making it vulnerable to external market disruptions.</li>
  <li><strong>SIBOR</strong> was phased out by end-2024, following a global shift away from survey-based benchmark rates (a lesson learned from the LIBOR manipulation scandal).</li>
</ul>
<p>SORA was chosen as the replacement because it is anchored in real, observable transactions — making it harder to manipulate and more reflective of actual market conditions.</p>

<h2>How Do SORA-Linked Home Loans Work?</h2>
<p>Most SORA-linked mortgages in Singapore are pegged to <strong>3-Month Compounded SORA</strong> (3M Compounded SORA). This is calculated by compounding the daily SORA rates over the past three months.</p>
<p>Your effective interest rate is: <strong>3M Compounded SORA + Bank Spread</strong></p>
<p>For example, if 3M Compounded SORA is 2.80% and your bank's spread is +0.80%, your effective rate is <strong>3.60% p.a.</strong></p>
<p>The spread is fixed by your bank for the duration of the package (typically 2–3 years). The SORA component changes every three months, which means your monthly instalment can go up or down.</p>

<h2>Where Can I Find the Current SORA Rate?</h2>
<p>MAS publishes the daily SORA rate on their website. The 3-Month Compounded SORA is typically updated on the first business day of each month and can be found at <strong>mas.gov.sg</strong>.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>SORA is a transaction-based benchmark rate published daily by MAS.</li>
  <li>It replaced SIBOR and SOR as the standard for floating-rate home loans in Singapore.</li>
  <li>SORA-linked mortgages have a variable component (the SORA rate) and a fixed bank spread.</li>
  <li>Your monthly instalment can change when the 3-Month Compounded SORA is repriced, typically every quarter.</li>
  <li>SORA-linked packages often offer lower spreads than fixed-rate packages, but carry interest rate risk.</li>
</ul>`,
  },
  {
    title: "Fixed vs Floating Rate Mortgage: Which Should You Choose?",
    slug: "fixed-vs-floating-rate-mortgage-singapore",
    published_at: "2026-06-08T00:00:00Z",
    content: `<p class="lead">One of the most important decisions you'll make when taking a home loan in Singapore is choosing between a fixed-rate and a floating-rate (SORA-linked) package. Both have genuine advantages — the right choice depends on your financial situation, risk appetite, and view on interest rates.</p>

<h2>Fixed-Rate Mortgages</h2>
<p>With a fixed-rate mortgage, your interest rate is locked in for a set period — typically 2 to 5 years. After the fixed period ends, the loan usually reverts to a floating rate (often SORA + spread), at which point you can reprice or refinance.</p>

<h3>Pros</h3>
<ul>
  <li><strong>Certainty:</strong> Your monthly instalment doesn't change during the fixed period, making budgeting straightforward.</li>
  <li><strong>Protection from rate rises:</strong> If interest rates go up, you're insulated for the duration of the fixed term.</li>
  <li><strong>Peace of mind:</strong> Especially valuable for first-time buyers managing a tight cash flow.</li>
</ul>

<h3>Cons</h3>
<ul>
  <li><strong>Higher starting rate:</strong> Fixed rates are typically 0.3–0.8% higher than comparable SORA packages at the time of taking the loan.</li>
  <li><strong>You miss out if rates fall:</strong> If SORA drops significantly, your fixed rate stays the same.</li>
  <li><strong>Lock-in penalty:</strong> Refinancing or selling during the fixed period usually incurs a penalty of 1–1.5% of the outstanding loan amount.</li>
</ul>

<h2>Floating-Rate (SORA-Linked) Mortgages</h2>
<p>Floating-rate packages are pegged to 3-Month Compounded SORA plus a fixed bank spread. Your rate — and therefore your monthly instalment — adjusts every quarter as SORA moves.</p>

<h3>Pros</h3>
<ul>
  <li><strong>Lower spread:</strong> Banks typically offer tighter spreads on SORA packages, so your starting rate is often lower.</li>
  <li><strong>You benefit when rates fall:</strong> If SORA declines, your effective rate drops automatically.</li>
  <li><strong>Flexibility:</strong> Some SORA packages have shorter lock-in periods or no lock-in at all.</li>
</ul>

<h3>Cons</h3>
<ul>
  <li><strong>Rate risk:</strong> If SORA rises, so does your monthly repayment. This can strain cash flow, especially for large loans.</li>
  <li><strong>Harder to budget:</strong> You won't know your exact repayment three months from now.</li>
</ul>

<h2>How to Decide</h2>
<p>There is no universally correct answer, but here are some guiding principles:</p>

<table>
  <thead>
    <tr><th>Situation</th><th>Consider</th></tr>
  </thead>
  <tbody>
    <tr><td>Tight monthly budget, limited buffer</td><td>Fixed rate</td></tr>
    <tr><td>Expect to sell or refinance within 2–3 years</td><td>Floating (check lock-in)</td></tr>
    <tr><td>Rates are near historical highs</td><td>Shorter fixed, then reassess</td></tr>
    <tr><td>Rates are falling</td><td>Floating to benefit from drops</td></tr>
    <tr><td>Dual income, comfortable buffer</td><td>Either — optimise for lower cost</td></tr>
  </tbody>
</table>

<h2>A Common Approach: Split Your Loan</h2>
<p>Some borrowers split their loan — putting a portion on a fixed rate for stability and the remainder on a SORA package to capture potential rate decreases. Not all banks offer this flexibility, but it's worth asking about.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Fixed rates offer certainty; floating rates offer potential savings.</li>
  <li>The "right" choice depends on your cash flow, risk tolerance, and interest rate outlook.</li>
  <li>Always compare the all-in cost (rate + fees + lock-in penalty risk) rather than the headline rate alone.</li>
  <li>You can always reprice or refinance after the lock-in period — you're not stuck forever.</li>
</ul>`,
  },
  {
    title: "TDSR Explained: How Much Can You Borrow for a Home in Singapore?",
    slug: "tdsr-explained-how-much-can-you-borrow",
    published_at: "2026-06-15T00:00:00Z",
    content: `<p class="lead">Before a bank approves your home loan in Singapore, it runs one critical check: your Total Debt Servicing Ratio, or TDSR. Understanding how TDSR works — and how to calculate yours — can save you from a disappointing rejection and help you plan your purchase more accurately.</p>

<h2>What Is TDSR?</h2>
<p>TDSR is a framework introduced by the Monetary Authority of Singapore (MAS) in 2013 to ensure borrowers don't overstretch themselves. It sets a hard cap: <strong>your total monthly debt obligations cannot exceed 55% of your gross monthly income.</strong></p>
<p>This applies to all property loans in Singapore, including HDB flats, private condominiums, and landed property.</p>

<h2>What Counts as Debt?</h2>
<p>TDSR includes <em>all</em> your monthly debt repayments, not just the mortgage you're applying for:</p>
<ul>
  <li>The new home loan instalment</li>
  <li>Any existing home loans (e.g. investment property)</li>
  <li>Car loan repayments</li>
  <li>Personal loan repayments</li>
  <li>Student loan repayments</li>
  <li>Credit card minimum payments (typically 5% of outstanding balance)</li>
  <li>Other hire-purchase instalments</li>
</ul>

<h2>How to Calculate Your TDSR</h2>
<p>The formula is straightforward:</p>
<p><strong>TDSR = Total Monthly Debt Obligations ÷ Gross Monthly Income × 100%</strong></p>

<h3>Example</h3>
<p>Suppose you earn S$8,000 per month gross and have the following debts:</p>
<ul>
  <li>New home loan instalment: S$3,200/mo</li>
  <li>Car loan: S$800/mo</li>
  <li>Credit card minimum payment: S$150/mo</li>
</ul>
<p>Total monthly debt = S$4,150</p>
<p>TDSR = S$4,150 ÷ S$8,000 = <strong>51.9%</strong> ✓ (below the 55% cap)</p>
<p>If the home loan instalment were S$3,500 instead, TDSR would be 55.6% — and the loan would be declined.</p>

<h2>How Banks Calculate the Loan Instalment for TDSR</h2>
<p>Banks don't use your actual contracted interest rate for the TDSR calculation. They use a <strong>stress-test rate</strong> — currently a minimum of <strong>4.0% p.a.</strong> for property loans. This is to ensure you can still service the loan if rates rise.</p>
<p>This means even if your actual mortgage rate is 3.5%, the bank will calculate your TDSR instalment as if you're paying 4.0%.</p>

<h2>What Counts as Income?</h2>
<p>Banks typically accept:</p>
<ul>
  <li><strong>Fixed income:</strong> 100% of basic salary (with payslips or CPF contribution history)</li>
  <li><strong>Variable income:</strong> Commissions, bonuses — typically 70% of the average over 12 months</li>
  <li><strong>Self-employed / freelance:</strong> Usually 70% of assessed income from Notice of Assessment</li>
  <li><strong>Rental income:</strong> Typically 70% of gross rental</li>
</ul>
<p>If you are buying with a co-borrower (e.g. spouse), both incomes can be combined.</p>

<h2>TDSR vs MSR: What's the Difference?</h2>
<p>For <strong>HDB flats</strong>, an additional rule applies: the <strong>Mortgage Servicing Ratio (MSR)</strong>, capped at <strong>30%</strong> of gross monthly income. MSR covers only the home loan being taken for the HDB flat (not other debts).</p>
<p>In practice, MSR is often the binding constraint for HDB buyers, not TDSR.</p>

<h2>How to Improve Your TDSR</h2>
<ul>
  <li><strong>Pay down existing debt</strong> before applying — especially high-instalment loans like car loans.</li>
  <li><strong>Clear credit card balances</strong> to reduce minimum payment obligations.</li>
  <li><strong>Add a co-borrower</strong> to increase the income base.</li>
  <li><strong>Choose a longer loan tenure</strong> to reduce the monthly instalment (up to 30 years for private property, 25 years for HDB).</li>
  <li><strong>Sell existing investment properties</strong> if their loans are dragging down your TDSR.</li>
</ul>

<h2>Key Takeaways</h2>
<ul>
  <li>TDSR caps total monthly debt at 55% of gross monthly income.</li>
  <li>Banks stress-test at 4.0% p.a., not your actual mortgage rate.</li>
  <li>HDB buyers face an additional MSR cap of 30%.</li>
  <li>Reducing existing debts before applying is the most effective way to increase your borrowing capacity.</li>
  <li>Use a mortgage calculator to estimate your instalment, then check if it fits within your TDSR.</li>
</ul>`,
  },
];

async function main() {
  console.log("Seeding articles...");

  // Delete existing articles by slug to allow re-running safely
  const slugs = articles.map((a) => a.slug);
  await supabase.from("articles").delete().in("slug", slugs);

  const { data, error } = await supabase.from("articles").insert(articles).select("id, slug");

  if (error) throw new Error(`Insert failed: ${error.message}`);

  console.log(`Inserted ${data?.length} article(s):`);
  data?.forEach((a) => console.log(`  /${a.slug}`));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
