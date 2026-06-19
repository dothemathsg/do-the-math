import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-24">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-neutral-400">
        <span>© 2026 Do The Math</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-neutral-700 transition-colors">
            About
          </Link>
          <Link href="/partnership" className="hover:text-neutral-700 transition-colors">
            Partnership
          </Link>
          <Link href="/feedback" className="hover:text-neutral-700 transition-colors">
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
