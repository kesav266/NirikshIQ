import React from 'react';
import { LocationSite } from '../types';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface SatelliteMapProps {
  sites: LocationSite[];
  selectedSiteId: string | null;
  onSelectSite: (site: LocationSite) => void;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  sites,
  selectedSiteId,
  onSelectSite,
}) => {
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  return (
    <div className="relative w-full h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between select-none">
      {/* Background Satellite Grid & Graphic Vectors */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* SVG Terrain & Features Rendering */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          
          <pattern id="fieldPattern" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
            <rect width="38" height="38" fill="#0f2338" rx="2" />
            <line x1="0" y1="0" x2="40" y2="40" stroke="#1e3a5f" strokeWidth="0.8" />
          </pattern>

          <pattern id="terrainPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="12" fill="#0d1f33" opacity="0.6" />
            <circle cx="45" cy="45" r="18" fill="#132742" opacity="0.5" />
          </pattern>
        </defs>

        {/* Map Base Glow */}
        <rect width="1000" height="600" fill="url(#mapGlow)" />

        {/* Simulated Topographic Elevation Lines */}
        <path d="M 50,150 Q 200,80 400,200 T 800,180 T 950,300" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 20,350 Q 250,280 500,420 T 850,380" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />
        
        {/* River Vector */}
        <path d="M 0,220 C 200,240 350,140 520,290 C 700,440 820,320 1000,360" fill="none" stroke="#0284c7" strokeWidth="12" opacity="0.35" />
        <path d="M 0,220 C 200,240 350,140 520,290 C 700,440 820,320 1000,360" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.7" />

        {/* Land Mass Blocks / Agricultural Fields */}
        <rect x="80" y="80" width="180" height="130" fill="url(#fieldPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.7" />
        <rect x="280" y="100" width="220" height="140" fill="url(#terrainPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.8" rx="4" />
        <rect x="580" y="70" width="240" height="180" fill="url(#fieldPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6" />

        <rect x="120" y="320" width="260" height="200" fill="url(#terrainPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.8" rx="8" />
        <rect x="440" y="360" width="210" height="190" fill="url(#fieldPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.7" />
        <rect x="680" y="310" width="270" height="220" fill="url(#terrainPattern)" stroke="#1e3a8a" strokeWidth="0.5" opacity="0.6" />

        {/* Existing Road Network Vector Lines */}
        <path d="M 120,0 L 220,260 L 380,440 L 480,600" fill="none" stroke="#475569" strokeWidth="2.5" />
        <path d="M 380,440 L 780,220 L 1000,280" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 3" />
        
        {/* Selected Site Feature Corridor Highlight */}
        <path
          d={`M ${activeSite.xPercent * 10 - 60},${activeSite.yPercent * 6 - 40} L ${activeSite.xPercent * 10 + 70},${activeSite.yPercent * 6 + 30} L ${activeSite.xPercent * 10 + 100},${activeSite.yPercent * 6 + 80}`}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <path
          d={`M ${activeSite.xPercent * 10 - 60},${activeSite.yPercent * 6 - 40} L ${activeSite.xPercent * 10 + 70},${activeSite.yPercent * 6 + 30} L ${activeSite.xPercent * 10 + 100},${activeSite.yPercent * 6 + 80}`}
          fill="none"
          stroke="#67e8f9"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Radar Sweep Effect in Top Right */}
        <g transform="translate(850, 100)">
          <circle r="60" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.3" />
          <circle r="40" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.2" />
          <circle r="20" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.2" />
          <line x1="-70" y1="0" x2="70" y2="0" stroke="#0284c7" strokeWidth="0.5" opacity="0.3" />
          <line x1="0" y1="-70" x2="0" y2="70" stroke="#0284c7" strokeWidth="0.5" opacity="0.3" />
        </g>
      </svg>

      {/* Map Header Overlay */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 font-semibold uppercase">
            LIVE SATELLITE ORBIT — SENTINEL-2A (PASS: 104-B)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Multispectral NIR/SWIR
          </span>
          <span className="bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-md text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> {activeSite.lat}° N, {activeSite.lng}° E
          </span>
        </div>
      </div>

      {/* Interactive Location Markers */}
      <div className="relative w-full h-full z-10">
        {sites.map((site) => {
          const isSelected = selectedSiteId === site.id;
          const priorityColor =
            site.priority === 'HIGH'
              ? 'border-red-500 text-red-400 bg-red-950/90'
              : site.priority === 'MEDIUM'
              ? 'border-amber-500 text-amber-400 bg-amber-950/90'
              : 'border-emerald-500 text-emerald-400 bg-emerald-950/90';

          const markerGlow =
            site.priority === 'HIGH'
              ? 'bg-red-500 shadow-red-500/50'
              : site.priority === 'MEDIUM'
              ? 'bg-amber-500 shadow-amber-500/50'
              : 'bg-emerald-500 shadow-emerald-500/50';

          return (
            <div
              key={site.id}
              onClick={() => onSelectSite(site)}
              style={{ left: `${site.xPercent}%`, top: `${site.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-20"
            >
              {/* Marker Pin & Pulse */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`absolute w-10 h-10 rounded-full animate-ping opacity-30 ${markerGlow}`}
                />
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-[1.15] shadow-lg ${
                    isSelected
                      ? 'bg-cyan-500 border-white text-slate-950 scale-110 ring-4 ring-cyan-500/40'
                      : 'bg-slate-900/90 border-cyan-400 text-cyan-300'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* Marker Tooltip Badge */}
              <div
                className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md border text-xs font-mono shadow-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/90 border-slate-700 text-slate-200 group-hover:border-cyan-500'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{site.code}</span>
                  <span className="text-[10px] opacity-75">({site.name})</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                  <span className={`px-1 py-0.5 rounded border font-semibold ${priorityColor}`}>
                    {site.priority}
                  </span>
                  <span className="text-cyan-300">{site.confidence}% conf</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Footer Controls Overlay */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/60 pointer-events-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Site Marker
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 inline-block rounded" /> Detected Feature Corridor
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>SCALE: 1 : 25,000</span>
          <span>RESOLUTION: 10m/px</span>
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <Navigation className="w-3 h-3 text-cyan-400 transform rotate-45" /> N
          </span>
        </div>
      </div>
    </div>
  );
};
