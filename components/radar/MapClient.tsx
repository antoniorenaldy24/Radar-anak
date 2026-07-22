"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SUBJECT_DATA, type SubjectProfile } from "./subjectData";

const pulseIcon = (n: number, isSelected: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="position:relative;width:28px;height:28px;cursor:pointer;">
        <span style="position:absolute;inset:0;border-radius:9999px;background:${isSelected ? 'rgba(230,57,14,0.45)' : 'rgba(230,57,14,0.25)'};animation:radar-pulse 2.4s linear infinite"></span>
        <span style="position:absolute;inset:7px;border-radius:9999px;background:${isSelected ? '#121212' : '#e6390e'};border:2px solid #f9f8f6;box-shadow:0 2px 6px rgba(0,0,0,.3)"></span>
        <span style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font:700 9px 'JetBrains Mono',monospace;color:${isSelected ? '#ffffff' : '#121212'};background:${isSelected ? '#e6390e' : '#f9f8f6'};padding:1px 5px;border:1px solid #121212;">${n}</span>
      </div>`,
  });

export default function MapClient({
  selectedId,
  subjects,
  onSelectSubject,
}: {
  selectedId?: string;
  subjects?: SubjectProfile[];
  onSelectSubject?: (subject: SubjectProfile) => void;
}) {
  const displaySubjects = subjects && subjects.length > 0 ? subjects : SUBJECT_DATA;

  return (
    <MapContainer
      center={[-7.2625, 112.7885]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#efeee9" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      {displaySubjects.map((m, idx) => (
        <Marker
          key={m.id || `marker-${idx}`}
          position={m.pos}
          icon={pulseIcon(m.cases || 1, selectedId === m.id)}
          eventHandlers={{
            click: () => {
              if (onSelectSubject) onSelectSubject(m);
            },
          }}
        >
          <Popup className="radar-popup">
            <div className="font-mono text-[9px] uppercase tracking-widest text-ink/60">
              ARSIP KASUS / {m.rw}
            </div>
            <div className="mt-1 font-display text-base font-extrabold tracking-tight">
              Inisial Subjek: {m.initials} ({m.age})
            </div>
            <div className="mt-1 text-xs leading-snug text-ink/70">
              Lokasi: {m.location}. Klik untuk meninjau berkas advokasi.
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
