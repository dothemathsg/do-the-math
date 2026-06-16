"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MapGL, { Source, Layer, type MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type { DistrictSummary } from "@/lib/propertyPrices";
import type { FeatureCollection, Geometry } from "geojson";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const SG_GEOJSON_URL = "/sg-districts.geojson";

const MIN_PSF = 700;
const MAX_PSF = 3000;
const colorScale = scaleSequential(interpolateYlOrRd).domain([MIN_PSF, MAX_PSF]);

// Build the maplibre expression for fill-color
function buildColorExpression(data: DistrictSummary[]) {
  const stops: (string | number)[] = [];
  for (const d of data) {
    if (d.median_psf == null) continue;
    const clamped = Math.min(d.median_psf, MAX_PSF);
    stops.push(d.district, colorScale(clamped));
  }
  if (stops.length === 0) return "#d1d5db";
  return [
    "match",
    ["get", "district"],
    ...stops,
    "#d1d5db",
  ] as unknown as string;
}

interface TooltipState {
  x: number;
  y: number;
  district: number;
  name: string;
  psf: number | null;
  count: number;
}

interface DistrictProperties {
  district: number;
  name: string;
}

export default function DistrictMap({ data }: { data: DistrictSummary[] }) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [geojson, setGeojson] = useState<FeatureCollection<Geometry, DistrictProperties> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<number | null>(null);

  const byDistrict = new Map(data.map((d) => [d.district, d]));

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
      });
    },
    [byDistrict]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setHoveredDistrict(null);
  }, []);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) return;
      const props = features[0].properties as DistrictProperties;
      router.push(`/property-prices/district/${props.district}`);
    },
    [router]
  );

  const fillColorExpression = buildColorExpression(data);

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden" style={{ height: 520 }}>
        <MapGL
          ref={mapRef}
          initialViewState={{
            longitude: 103.82,
            latitude: 1.35,
            zoom: 10.8,
          }}
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
              {/* Fill layer coloured by median PSF */}
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
              {/* White district borders */}
              <Layer
                id="districts-line"
                type="line"
                paint={{
                  "line-color": "#ffffff",
                  "line-width": 1.5,
                  "line-opacity": 0.9,
                }}
              />
              {/* Highlighted border on hover */}
              <Layer
                id="districts-line-hover"
                type="line"
                filter={["==", ["get", "district"], hoveredDistrict ?? -1]}
                paint={{
                  "line-color": "#1e293b",
                  "line-width": 2.5,
                }}
              />
            </Source>
          )}
        </MapGL>

        {/* Tooltip — positioned relative to map container */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none bg-white border border-neutral-200 rounded-lg shadow-lg px-3 py-2 text-sm min-w-[180px] -translate-x-1/2"
            style={{
              left: tooltip.x,
              top: Math.max(8, tooltip.y - 80),
            }}
          >
            <p className="font-semibold text-neutral-900">
              D{String(tooltip.district).padStart(2, "0")} &mdash; {tooltip.name}
            </p>
            {tooltip.psf ? (
              <>
                <p className="text-neutral-700 mt-0.5">
                  Median PSF:{" "}
                  <span className="font-medium">
                    ${tooltip.psf.toLocaleString()}
                  </span>
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {tooltip.count.toLocaleString()} tx (last 3 months)
                </p>
              </>
            ) : (
              <p className="text-neutral-400 text-xs mt-0.5">No recent data</p>
            )}
          </div>
        )}

        {/* Loading overlay before geojson loads */}
        {!geojson && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 pointer-events-none">
            <span className="text-sm text-neutral-400">Loading map…</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span>Lower PSF</span>
        <div
          className="flex-1 h-3 rounded"
          style={{
            background: `linear-gradient(to right, ${colorScale(MIN_PSF)}, ${colorScale((MIN_PSF + MAX_PSF) / 2)}, ${colorScale(MAX_PSF)})`,
          }}
        />
        <span>Higher PSF</span>
        <div className="flex items-center gap-1 ml-2">
          <div className="w-3 h-3 rounded bg-[#d1d5db]" />
          <span>No data</span>
        </div>
      </div>
    </div>
  );
}
