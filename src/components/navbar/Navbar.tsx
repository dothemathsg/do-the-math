"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const PROPERTY_LINKS = [
  { href: "/property-prices", label: "Property Prices", desc: "Latest transaction data by district" },
  { href: "/calculator", label: "Mortgage & Stamp Duty Calculator", desc: "BSD & ABSD calculator" },
];

const INSURANCE_LINKS = [
  { href: "/insurance/life",      label: "Life Insurance",      desc: "Term life plans & rates" },
  { href: "/insurance/car",       label: "Car Insurance",       desc: "Comprehensive plans & rates" },
  { href: "/insurance/home",      label: "Home Insurance",      desc: "HDB & condo cover & rates" },
  { href: "/insurance/travel",    label: "Travel Insurance",    desc: "Single trip & annual plans" },
  { href: "/insurance/corporate", label: "Corporate Insurance", desc: "WICA, group health & more" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [mobilePropertyOpen, setMobilePropertyOpen] = useState(false);
  const [mobileInsuranceOpen, setMobileInsuranceOpen] = useState(false);

  const propertyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insuranceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openProperty() {
    if (propertyTimer.current) clearTimeout(propertyTimer.current);
    setPropertyOpen(true);
  }
  function closeProperty() {
    propertyTimer.current = setTimeout(() => setPropertyOpen(false), 100);
  }
  function openInsurance() {
    if (insuranceTimer.current) clearTimeout(insuranceTimer.current);
    setInsuranceOpen(true);
  }
  function closeInsurance() {
    insuranceTimer.current = setTimeout(() => setInsuranceOpen(false), 100);
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">

        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-neutral-900"
          onClick={() => setMobileOpen(false)}
        >
          dothemath.sg
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-500">

          {/* Property dropdown */}
          <div className="relative" onMouseEnter={openProperty} onMouseLeave={closeProperty}>
            <button
              className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
              onClick={() => setPropertyOpen((o) => !o)}
            >
              Property
              <ChevronDown size={14} className={`transition-transform duration-150 ${propertyOpen ? "rotate-180" : ""}`} />
            </button>
            {propertyOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50"
                onMouseEnter={openProperty}
                onMouseLeave={closeProperty}
              >
                {PROPERTY_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setPropertyOpen(false)}
                    className="block px-4 py-2.5 hover:bg-neutral-50 transition-colors">
                    <p className="text-sm font-medium text-neutral-900">{l.label}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{l.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Insurance dropdown */}
          <div className="relative" onMouseEnter={openInsurance} onMouseLeave={closeInsurance}>
            <button
              className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
              onClick={() => setInsuranceOpen((o) => !o)}
            >
              Insurance
              <ChevronDown size={14} className={`transition-transform duration-150 ${insuranceOpen ? "rotate-180" : ""}`} />
            </button>
            {insuranceOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50"
                onMouseEnter={openInsurance}
                onMouseLeave={closeInsurance}
              >
                {INSURANCE_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setInsuranceOpen(false)}
                    className="block px-4 py-2.5 hover:bg-neutral-50 transition-colors">
                    <p className="text-sm font-medium text-neutral-900">{l.label}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{l.desc}</p>
                  </Link>
                ))}
                <div className="mx-4 my-1 border-t border-neutral-100" />
                <Link href="/insurance" onClick={() => setInsuranceOpen(false)}
                  className="block px-4 py-2.5 hover:bg-neutral-50 transition-colors">
                  <p className="text-sm text-neutral-500">All insurance →</p>
                </Link>
              </div>
            )}
          </div>

          <Link href="/articles" className="hover:text-neutral-900 transition-colors">Learn</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/newsletter"
            className="hidden md:inline-flex text-sm rounded-full bg-neutral-900 text-white px-4 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            Get Updates
          </Link>
          <button
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col">

            {/* Property accordion */}
            <button
              className="flex items-center justify-between py-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors border-b border-neutral-100"
              onClick={() => setMobilePropertyOpen((o) => !o)}
            >
              Property
              <ChevronDown size={14} className={`transition-transform duration-150 ${mobilePropertyOpen ? "rotate-180" : ""}`} />
            </button>
            {mobilePropertyOpen && (
              <div className="pl-3 flex flex-col border-b border-neutral-100">
                {PROPERTY_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="py-2.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Insurance accordion */}
            <button
              className="flex items-center justify-between py-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors border-b border-neutral-100"
              onClick={() => setMobileInsuranceOpen((o) => !o)}
            >
              Insurance
              <ChevronDown size={14} className={`transition-transform duration-150 ${mobileInsuranceOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileInsuranceOpen && (
              <div className="pl-3 flex flex-col border-b border-neutral-100">
                {INSURANCE_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="py-2.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/insurance"
                  className="py-2.5 text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  All insurance
                </Link>
              </div>
            )}

            <Link href="/articles"
              className="py-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors border-b border-neutral-100"
              onClick={() => setMobileOpen(false)}>
              Learn
            </Link>

            <Link
              href="/newsletter"
              className="mt-4 mb-1 text-center text-sm rounded-full bg-neutral-900 text-white px-4 py-2.5 hover:bg-neutral-700 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Get Updates
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
