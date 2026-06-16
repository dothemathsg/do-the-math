"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/mortgage-rates", label: "Rates" },
  { href: "/property-prices", label: "Property" },
  { href: "/calculator", label: "Calculator" },
  { href: "/articles", label: "Learn" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">

        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-neutral-900"
          onClick={() => setOpen(false)}
        >
          dothemath.sg
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-500">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-neutral-900 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/newsletter"
            className="hidden md:inline-flex text-sm rounded-full bg-neutral-900 text-white px-4 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            Get Updates
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors border-b border-neutral-100 last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="mt-4 mb-1 text-center text-sm rounded-full bg-neutral-900 text-white px-4 py-2.5 hover:bg-neutral-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              Get Updates
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
