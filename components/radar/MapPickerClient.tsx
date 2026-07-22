"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pickerIcon = L.divIcon({
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  html: `
    <div style="position:relative;width:32px;height:32px;cursor:grab;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(230,57,14,0.35);animation:radar-pulse 2s linear infinite"></span>
      <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">📍</div>
    </div>`,
});

function MapEventHander({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPickerClient({
  initialLat,
  initialLng,
  onConfirm,
}: {
  initialLat: number;
  initialLng: number;
  onConfirm: (lat: number, lng: number) => void;
}) {
  const [pos, setPos] = useState<[number, number]>([
    initialLat || -7.2630,
    initialLng || 112.7885,
  ]);

  const handleDragEnd = (e: any) => {
    const marker = e.target;
    if (marker) {
      const latLng = marker.getLatLng();
      setPos([latLng.lat, latLng.lng]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[360px] w-full border-2 border-ink overflow-hidden hard-shadow bg-[#efeee9]">
        <MapContainer
          center={pos}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          <MapEventHander
            onLocationSelect={(lat, lng) => setPos([lat, lng])}
          />
          <Marker
            position={pos}
            draggable={true}
            icon={pickerIcon}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />
        </MapContainer>

        <div className="pointer-events-none absolute left-3 top-3 z-[500] bg-paper/95 border border-ink/30 px-3 py-1 font-mono text-[10px] font-bold text-ink uppercase tracking-widest shadow-sm">
          ● GESER PIN MERAH ATAU KLIK LOKASI DI PETA
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-300 p-3 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-sky-900 font-bold block text-[10px] uppercase">
            KOORDINAT TERPILIH (LIVE):
          </span>
          <span className="text-ink font-extrabold">
            LAT: {pos[0].toFixed(6)} | LNG: {pos[1].toFixed(6)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(pos[0], pos[1])}
          className="w-full sm:w-auto border border-ink bg-sky-600 px-5 py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0_0_#121212] hover:bg-ink transition-all cursor-pointer"
        >
          ✓ GUNAKAN TITIK KOORDINAT INI
        </button>
      </div>
    </div>
  );
}
