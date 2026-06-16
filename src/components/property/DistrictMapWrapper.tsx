"use client";

import dynamic from "next/dynamic";
import type { DistrictSummary } from "@/lib/propertyPrices";

const DistrictMap = dynamic(() => import("./DistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[540px] bg-neutral-50 border border-neutral-200 rounded-xl animate-pulse" />
  ),
});

export default function DistrictMapWrapper({ data }: { data: DistrictSummary[] }) {
  return <DistrictMap data={data} />;
}
