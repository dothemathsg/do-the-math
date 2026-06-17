"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import MapGL, { Source, Layer, type MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type { DistrictSummary } from "@/lib/propertyPrices";
import type { FeatureCollection, Geometry } from "geojson";
import type { PropertyFilter } from "./PropertyPricesClient";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const SG_GEOJSON_URL = "/sg-districts.geojson";

function buildColorExpression(
  data: DistrictSummary[],
  colorScale: (v: number) => string
) {
  const stops: (string | number)[] = [];
  for (const d of data) {
    if (d.median_psf == null) continue;
    stops.push(d.district, colorScale(d.median_psf));
  }
  if (stops.length === 0) return "#d1d5db";
  return ["match", ["get", "district"], ...stops, "#d1d5db"] as unknown as string;
}

function districtPath(district: number, filter: PropertyFilter): string {
  return filter !== "all"
    ? `/property-prices/district/${district}?type=${filter}`
    : `/property-prices/district/${district}`;
}

interface TooltipState {
  x: number;
  y: number;
  district: number;
  name: string;
  psf: number | null;
  count: number;
  path: string;
}

interface BlurbState {
  district: number;
  name: string;
  psf: number | null;
  count: number;
  path: string;
}

interface DistrictProperties {
  district: number;
  name: string;
}

export default function DistrictMap({
  data,
  activeFilter = "all",
}: {
  data: DistrictSummary[];
  activeFilter?: PropertyFilter;
}) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [geojson, setGeojson] = useState<FeatureCollection<Geometry, DistrictProperties> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null);
  const [blurb, setBlurb] = useState<BlurbState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const byDistrict = useMemo(
    () => new Map(data.map((d) => [d.district, d])),
    [data]
  );

  // Dynamic color scale: fits the range of the current data
  const { colorScale, minPSF, maxPSF } = useMemo(() => {
    const psfs = data.map((d) => d.median_psf).filter((p): p is number => p != null);
    if (psfs.length === 0) {
      const scale = scaleSequential(interpolateYlOrRd).domain([700, 3000]);
      return { colorScale: scale, minPSF: 700, maxPSF: 3000 };
    }
    const lo = Math.min(...psfs);
    const hi = Math.max(...psfs);
    const scale = scaleSequential(interpolateYlOrRd).domain([lo, hi]);
    return { colorScale: scale, minPSF: lo, maxPSF: hi };
  }, [data]);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    fetch(SG_GEOJSON_URL)
      .then((r) => r.json())
      .then(setGeojson)
      .catch(console.error);
  }, []);

  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) {
        setTooltip(null);
        setHoveredDistrict(null);
        return;
      }
      const props = features[0].properties as DistrictProperties;
      const d = byDistrict.get(props.district);
      setHoveredDistrict(props.district);
      setTooltip({
        x: e.point.x,
        y: e.point.y,
        district: props.district,
        name: props.name,
        psf: d?.median_psf ?? null,
        count: d?.transaction_count ?? 0,
        path: districtPath(props.district, activeFilter),
      });
    },
    [byDistrict, activeFilter]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setHoveredDistrict(null);
  }, []);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) {
        setBlurb(null);
        setHoveredDistrict(null);
        return;
      }
      const props = features[0].properties as DistrictProperties;
      const path = districtPath(props.district, activeFilter);

      if (isTouchDevice) {
        const d = byDistrict.get(props.district);
        setHoveredDistrict(props.district);
        setBlurb({
          district: props.district,
          name: props.name,
          psf: d?.median_psf ?? null,
          count: d?.transaction_count ?? 0,
          path,
        });
      } else {
        router.push(path);
      }
    },
    [isTouchDevice, byDistrict, router, activeFilter]
  );

  const fillColorExpression = buildColorExpression(data, colorScale);

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden" style={{ height: 520 }}>
        <MapGL
          ref={mapRef}
          initialViewState={{ longitude: 103.82, latitude: 1.35, zoom: 10.8 }}
          minZoom={9}
          maxZoom={14}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          interactiveLayerIds={geojson ? ["districts-fill"] : []}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          cursor={hoveredDistrict != null ? "pointer" : "grab"}
        >
          {geojson && (
            <Source id="districts" type="geojson" data={geojson}>
              <Layer
                id="districts-fill"
                type="fill"
                paint={{
                  "fill-color": fillColorExpression as unknown as string,
                  "fill-opacity": [
                    "case",
                    ["==", ["get", "district"], hoveredDistrict ?? -1],
                    0.85,
                    0.65,
                  ],
                }}
              />
              <Layer
                id="districts-line"
                type="line"
                paint={{
                  "line-color": "#ffffff",
                  "line-width": 1.5,
                  "line-opacity": 0.9,
                }}
              />
              <Layer
                id="districts-line-hover"
                type="line"
                filter={["==", ["get", "district"], hoveredDistrict ?? -1]}
                paint={{ "line-color": "#1e293b", "line-width": 2.5 }}
              />
            </Source>
          )}
        </MapGL>

        {/* Desktop hover tooltip */}
        {tooltip && !isTouchDevice && (
          <div
            className="absolute z-10 pointer-events-none bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-sm min-w-[180px] -translate-x-1/2"
            style={{ left: tooltip.x, top: Math.max(8, tooltip.y - 80) }}
          >
            <p className="font-semibold text-neutral-900">
              D{String(tooltip.district).padStart(2, "0")} &mdash; {tooltip.name}
            </p>
            {tooltip.psf ? (
              <>
                <p className="text-neutral-700 mt-0.5">
                  Median PSF:{" "}
                  <span className="font-medium">${tooltip.psf.toLocaleString()}</span>
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {tooltip.count.toLocaleString()} tx (last 3 months)
                </p>
              </>
            ) : (
              <p className="text-neutral-400 text-xs mt-0.5">No data for selected type</p>
            )}
          </div>
        )}

        {/* Mobile tap blurb */}
        {blurb && isTouchDevice && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-white border-t border-neutral-200 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900">
                  D{String(blurb.district).padStart(2, "0")} &mdash; {blurb.name}
                </p>
                {blurb.psf ? (
                  <>
                    <p className="text-sm text-neutral-700 mt-0.5">
                      Median PSF:{" "}
                      <span className="font-medium">${blurb.psf.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {blurb.count.toLocaleString()} transactions (last 3 months)
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-neutral-400 mt-0.5">No data for selected type</p>
                )}
              </div>
              <button
                onClick={() => { setBlurb(null); setHoveredDistrict(null); }}
                className="shrink-0 text-neutral-400 active:text-neutral-700 text-xl leading-none mt-0.5"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
            <Link
              href={blurb.path}
              className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 underline underline-offset-2"
            >
              View projects →
            </Link>
          </div>
        )}

        {!geojson && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 pointer-events-none">
            <span className="text-sm text-neutral-400">Loading map…</span>
          </div>
        )}
      </div>

      {/* Legend — shows actual PSF range of current data */}
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span>${minPSF.toLocaleString()}</span>
        <div
          className="flex-1 h-3 rounded"
          style={{
            background: `linear-gradient(to right, ${colorScale(minPSF)}, ${colorScale((minPSF + maxPSF) / 2)}, ${colorScale(maxPSF)})`,
          }}
        />
        <span>${maxPSF.toLocaleString()} psf</span>
        <div className="flex items-center gap-1 ml-2">
          <div className="w-3 h-3 rounded bg-[#d1d5db]" />
          <span>No data</span>
        </div>
      </div>
    </div>
  );
}
