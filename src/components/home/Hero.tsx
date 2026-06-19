export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
        Singapore personal finance,<br className="hidden md:block" /> done properly
      </h1>

      <p className="mt-5 text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
        Compare mortgage rates, calculate stamp duty, track property prices,
        and make smarter decisions across every major financial milestone.
        No jargon. No conflict of interest. Just the numbers.
      </p>

      <div className="mt-8 flex gap-3 justify-center">
        <a
          href="/mortgage-rates"
          className="bg-neutral-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-neutral-700 transition-colors"
        >
          Compare Rates
        </a>

        <a
          href="/calculator"
          className="border border-neutral-200 text-neutral-700 text-sm px-5 py-2.5 rounded-full hover:border-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Stamp Duty Calculator
        </a>
      </div>
    </section>
  );
}
