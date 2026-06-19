import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Do The Math is Singapore's personal finance platform helping buyers compare mortgage rates, calculate stamp duty, and understand property prices.",
  alternates: { canonical: "https://www.dothemath.sg/about" },
  openGraph: {
    title: "About Do The Math",
    description:
      "Do The Math is Singapore's personal finance platform helping buyers compare mortgage rates, calculate stamp duty, and understand property prices.",
    url: "https://www.dothemath.sg/about",
  },
};

export default function AboutPage() {

  return (

    <div className="container mx-auto py-20">

      <h1 className="text-4xl font-bold">

        About

      </h1>

    </div>

  );

}