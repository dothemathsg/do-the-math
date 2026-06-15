import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">

        <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900">
          Do The Math
        </Link>

        <nav className="flex items-center gap-6 text-sm text-neutral-500">
          <Link href="/mortgage-rates" className="hover:text-neutral-900 transition-colors">
            Rates
          </Link>
          <Link href="/calculator" className="hover:text-neutral-900 transition-colors">
            Calculator
          </Link>
          <Link href="/articles" className="hover:text-neutral-900 transition-colors">
            Learn
          </Link>
        </nav>

        <Link
          href="/newsletter"
          className="text-sm rounded-full bg-neutral-900 text-white px-4 py-1.5 hover:bg-neutral-700 transition-colors"
        >
          Get Updates
        </Link>

      </div>
    </header>
  );
}
