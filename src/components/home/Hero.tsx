export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
        Do The Math before you<br className="hidden md:block" /> buy property in Singapore
      </h1>

      <p className="mt-5 text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
        We break down real mortgage costs, interest rates, and property taxes
        so you can see the true cost of owning a home — not just the asking price.
      </p>

      <div className="mt-8 flex gap-3 justify-center">
        <a
          href="/calculator"
          className="bg-neutral-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-neutral-700 transition-colors"
        >
          Calculate My Loan
        </a>

        <a
          href="/mortgage-rates"
          className="border border-neutral-200 text-neutral-700 text-sm px-5 py-2.5 rounded-full hover:border-neutral-400 hover:text-neutral-900 transition-colors"
        >
          View Rates
        </a>
      </div>
    </section>
  );
}
