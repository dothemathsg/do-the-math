import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Do The Math team.",
  alternates: { canonical: "https://www.dothemath.sg/contact" },
  openGraph: {
    title: "Contact Do The Math",
    description: "Get in touch with the Do The Math team.",
    url: "https://www.dothemath.sg/contact",
  },
};

export default function ContactPage() {

  return (

    <div className="container mx-auto py-20">

      <h1 className="text-4xl font-bold">

        Contact

      </h1>

    </div>

  );

}