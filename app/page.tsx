import Hero from "@/components/home/Hero";
import FeaturedRates from "@/components/home/FeaturedRates";
import MortgageCalculatorPreview from "@/components/home/MortgageCalculatorPreview";
import LatestArticles from "@/components/home/LatestArticles";
import Newsletter from "@/components/home/Newsletter";
import MortgageTable from "@/components/mortgage/MortgageTable";

export default function Home() {
  return (
    <div className="space-y-16 py-10">
      <Hero />
      <MortgageTable />
      <FeaturedRates />
      <MortgageCalculatorPreview />
      <LatestArticles />
      <Newsletter />
    </div>
  );
}