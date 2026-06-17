import type { Metadata } from "next";
import PartnershipForm from "./PartnershipForm";

export const metadata: Metadata = {
  title: "Partnership | Do The Math",
  description: "Interested in partnering with Do The Math? Get in touch with us.",
};

export default function PartnershipPage() {
  return (
    <div className="py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-neutral-900">Partner with us</h1>
      <p className="mt-3 text-neutral-600 leading-relaxed">
        We're building Singapore's most trusted personal finance platform. If you're
        interested in working together — whether as a content partner, data provider,
        or through a commercial arrangement — we'd love to hear from you.
      </p>

      <div className="mt-10">
        <PartnershipForm />
      </div>
    </div>
  );
}
