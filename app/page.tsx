import Hero from "@/components/home/Hero";
import FeaturedRates from "@/components/home/FeaturedRates";
import MortgageCalculatorPreview from "@/components/home/MortgageCalculatorPreview";
import LatestArticles from "@/components/home/LatestArticles";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedRates />
      <MortgageCalculatorPreview />
      <LatestArticles />
      <Newsletter />
    </>
  );
}