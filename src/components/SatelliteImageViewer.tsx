import React, { useState } from 'react';
import { Eye, Sliders, Sparkles, Layers, ArrowLeftRight } from 'lucide-react';
import { LocationSite } from '../types';

interface SatelliteImageViewerProps {
  site: LocationSite;
}

const RenderSatelliteContent: React.FC<{ isAfterLayer: boolean }> = ({ isAfterLayer }) => {
  const layerId = isAfterLayer ? 'after' : 'before';
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
      <defs>
        <pattern id={`gridBg_${layerId}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={isAfterLayer ? '#0f1c2e' : '#0c1724'} />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>

        <pattern id={`cropPattern_${layerId}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <rect width="36" height="36" fill="#132a42" rx="1" />
          <line x1="0" y1="0" x2="40" y2="40" stroke="#1c3b5e" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Base Terrain Background */}
      <rect width="800" height="450" fill={`url(#gridBg_${layerId})`} />

      {/* Agricultural & Natural Terrain Polygons */}
      <path d="M 40,30 L 220,10 L 260,180 L 80,220 Z" fill={`url(#cropPattern_${layerId})`} opacity="0.8" stroke="#1e3a5f" />
      <path d="M 280,20 L 520,30 L 480,200 L 290,160 Z" fill="#0d2136" opacity="0.9" stroke="#1e3a5f" />
      <path d="M 540,10 L 760,40 L 740,240 L 510,190 Z" fill={`url(#cropPattern_${layerId})`} opacity="0.6" stroke="#1e3a5f" />

      <path d="M 60,260 L 320,240 L 300,420 L 40,430 Z" fill="#0d2136" opacity="0.9" stroke="#1e3a5f" />
      <path d="M 340,230 L 580,250 L 620,430 L 330,420 Z" fill={`url(#cropPattern_${layerId})`} opacity="0.7" stroke="#1e3a5f" />
      <path d="M 600,260 L 780,250 L 770,430 L 640,420 Z" fill="#0d2136" opacity="0.8" stroke="#1e3a5f" />

      {/* Natural Winding River Vector */}
      <path d="M 0,140 Q 180,180 340,120 T 680,210 T 800,160" fill="none" stroke="#0284c7" strokeWidth="16" opacity="0.4" />
      <path d="M 0,140 Q 180,180 340,120 T 680,210 T 800,160" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.8" />

      {/* Tree Clusters / Vegetation Dots */}
      <g fill="#10b981" opacity="0.3">
        <circle cx="150" cy="120" r="14" />
        <circle cx="170" cy="110" r="18" />
        <circle cx="620" cy="130" r="22" />
        <circle cx="650" cy="140" r="16" />
      </g>

      {/* Baseline Dirt Track (Present in both Before and After) */}
      <path d="M 100,440 Q 200,300 350,380" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="3 3" />

      {/* NEW ROAD DEVELOPMENT FEATURE — ONLY IN AFTER LAYER */}
      {isAfterLayer && (
        <g>
          {/* Cyan Glow Highlight Mask Layer */}
          <path d="M 120,40 L 380,220 L 720,380" fill="none" stroke="#06b6d4" strokeWidth="24" opacity="0.25" strokeLinecap="round" />

          {/* Main Asphalt Highway Corridors */}
          <path d="M 120,40 L 380,220 L 720,380" fill="none" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" />
          <path d="M 120,40 L 380,220 L 720,380" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
          <path d="M 120,40 L 380,220 L 720,380" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="8 6" strokeLinecap="round" />

          {/* Connecting Interchange Loop */}
          <circle cx="380" cy="220" r="32" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.9" />

          {/* Bounding Box Polygon & Change Highlight Outline */}
          <polygon
            points="100,20 400,200 740,360 700,410 350,250 80,50"
            fill="rgba(6, 182, 212, 0.15)"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </g>
      )}
    </svg>
  );
};

export const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({ site }) => {
  const [viewMode, setViewMode] = useState<'BEFORE' | 'AFTER' | 'SWIPE'>('SWIPE');
  const [swipePos, setSwipePos] = useState<number>(50);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header & View Controls */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Optical Change Analysis — {site.name} ({site.code})
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Sensor: {site.sensor} • Spatial Res: 10m • Co-registered Orthorectified
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 gap-1 text-xs font-medium">
          <button
            onClick={() => setViewMode('BEFORE')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'BEFORE'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Before (June 2026)
          </button>

          <button
            onClick={() => setViewMode('AFTER')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'AFTER'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            After (August 2026)
          </button>

          <button
            onClick={() => setViewMode('SWIPE')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'SWIPE'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Swipe Slider
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-[420px] bg-slate-950 overflow-hidden select-none">
        {viewMode === 'BEFORE' && (
          <div className="absolute inset-0">
            <RenderSatelliteContent isAfterLayer={false} />
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-mono text-slate-200 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              BEFORE — JUNE 2026 (BASELINE)
            </div>
          </div>
        )}

        {viewMode === 'AFTER' && (
          <div className="absolute inset-0">
            <RenderSatelliteContent isAfterLayer={true} />
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-cyan-500/50 px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              AFTER — AUGUST 2026 (ROAD DETECTED)
            </div>

            {/* Detected Change Overlay Tag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-950/90 border border-cyan-400 px-4 py-2 rounded-lg shadow-2xl text-cyan-200 flex items-center gap-2 font-mono text-xs animate-bounce">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold tracking-wide">DETECTED CHANGE:</span>
              <span className="bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded">1.84 ha</span>
            </div>
          </div>
        )}

        {viewMode === 'SWIPE' && (
          <div className="absolute inset-0">
            {/* Base (BEFORE) Layer */}
            <div className="absolute inset-0">
              <RenderSatelliteContent isAfterLayer={false} />
            </div>

            {/* Overlaid (AFTER) Layer with Clipped Width */}
            <div
              className="absolute top-0 right-0 bottom-0 overflow-hidden border-l-2 border-cyan-400 shadow-2xl transition-all duration-75"
              style={{ width: `${100 - swipePos}%` }}
            >
              <div
                className="absolute top-0 right-0 bottom-0"
                style={{ width: '100%', minWidth: '100%' }}
              >
                {/* Fixed position content aligned to full width */}
                <div className="absolute inset-0 w-[800px] h-[450px]">
                  <RenderSatelliteContent isAfterLayer={true} />
                </div>
              </div>
            </div>

            {/* Labels on Top */}
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 px-2.5 py-1.5 rounded-md text-xs font-mono text-slate-300 shadow-lg pointer-events-none">
              BEFORE: JUNE 2026
            </div>

            <div className="absolute top-4 right-4 bg-slate-900/90 border border-cyan-500/60 px-2.5 py-1.5 rounded-md text-xs font-mono text-cyan-300 shadow-lg pointer-events-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              AFTER: AUGUST 2026
            </div>

            {/* Change Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-cyan-500 px-3 py-1.5 rounded-md text-xs font-mono text-slate-200 flex items-center gap-2 shadow-xl pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-cyan-400 font-bold">DETECTED CHANGE</span>
              <span className="text-slate-400">|</span>
              <span>1.84 ha Road Corridor</span>
            </div>

            {/* Interactive Drag Line & Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${swipePos}%` }}
            >
              <div className="w-0.5 h-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]" />
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-xl">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Slider Control Bar */}
      {viewMode === 'SWIPE' && (
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400 w-24 text-right">JUNE 2026</span>
          <input
            type="range"
            min="0"
            max="100"
            value={swipePos}
            onChange={(e) => setSwipePos(Number(e.target.value))}
            className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-cyan-400 w-24">AUGUST 2026</span>
        </div>
      )}
    </div>
  );
};
