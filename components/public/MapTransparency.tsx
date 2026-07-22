"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon paths in Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface RWMarker {
  rw: string;
  coords: [number, number];
  kasusCount: number;
  penyebabUtama: string;
}

const mockMarkers: RWMarker[] = [
  { rw: "RW 03", coords: [-7.2625, 112.7521], kasusCount: 1, penyebabUtama: "Masalah Biaya" },
  { rw: "RW 04", coords: [-7.2641, 112.7538], kasusCount: 0, penyebabUtama: "Nihil" },
  { rw: "RW 05", coords: [-7.2612, 112.7562], kasusCount: 1, penyebabUtama: "Jarak Rumah" },
  { rw: "RW 06", coords: [-7.2638, 112.7579], kasusCount: 0, penyebabUtama: "Nihil" },
  { rw: "RW 07", coords: [-7.2655, 112.7554], kasusCount: 5, penyebabUtama: "Masalah Biaya & Sosial" },
];

export default function MapTransparency() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    fixLeafletIcon();

    // Initialize Map centered on our pilot area coordinates
    const map = L.map(mapContainerRef.current, {
      center: [-7.2635, 112.7545],
      zoom: 15,
      zoomControl: false, // disable default to place customizable zoom control
      scrollWheelZoom: false, // disable zooming on scroll for better UX
    });

    mapRef.current = map;

    // CartoDB Positron: Off-white minimalist maps matching Swiss typography aesthetics
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Place zoom control at bottom right for ergonomic layout
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Render markers on map
    mockMarkers.forEach((m) => {
      const markerColor = m.kasusCount > 0 ? "#E11D48" : "#9CA3AF";
      const markerSize = m.kasusCount > 0 ? 12 + m.kasusCount * 2 : 8;

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            position: relative;
            width: ${markerSize}px;
            height: ${markerSize}px;
            background-color: ${markerColor};
            border: 2px solid #121212;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${
              m.kasusCount > 0
                ? `
              <div class="marker-pulse" style="
                position: absolute;
                top: -6px;
                left: -6px;
                right: -6px;
                bottom: -6px;
                border: 2px solid ${markerColor};
                border-radius: 50%;
              "></div>
            `
                : ""
            }
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
      });

      const popupContent = `
        <div style="
          font-family: var(--font-grotesk), sans-serif;
          color: #121212;
          padding: 12px;
          min-width: 180px;
        ">
          <h4 style="font-weight: 700; margin: 0 0 8px 0; border-bottom: 2px solid #121212; padding-bottom: 4px; font-size: 14px; text-transform: uppercase;">${
            m.rw
          }</h4>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Jumlah Kasus:</strong> ${
            m.kasusCount
          } anak</p>
          <p style="margin: 4px 0; font-size: 12px; line-height: 1.4;"><strong>Penyebab Utama:</strong> ${
            m.penyebabUtama
          }</p>
        </div>
      `;

      const popup = L.popup({
        className: "brutalist-map-popup",
        closeButton: false,
        offset: [0, -markerSize / 2],
      }).setContent(popupContent);

      L.marker(m.coords, { icon: customIcon }).addTo(map).bindPopup(popup);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full relative border-[2.5px] border-[#121212] bg-[#FAF9F5] overflow-hidden shadow-[4px_4px_0px_0px_#121212]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
