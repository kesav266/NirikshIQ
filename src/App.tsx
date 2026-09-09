import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Layers,
  Clock,
  Grid,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Check,
  FileCheck,
  ArrowRight,
  Server,
  Filter,
} from 'lucide-react';
import { LocationSite, PriorityLevel, ReviewItem } from './types';
import {
  INITIAL_SITES,
  SEARCH_SUGGESTIONS,
  PROCESSING_STAGES,
  TEMPORAL_STEPS,
  FALSE_ALARM_CHECKS,
  SIMILAR_SITES,
  INITIAL_REVIEW_QUEUE,
} from './mockData';
import { SatelliteMap } from './components/SatelliteMap';
import { SatelliteImageViewer } from './components/SatelliteImageViewer';

type Tab = 'search' | 'analysis' | 'discovery' | 'temporal' | 'similar' | 'review';

export function App() {
  // Main State
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [searchQuery, setSearchQuery] = useState<string>('Find newly developed roads');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [sites, setSites] = useState<LocationSite[]>(INITIAL_SITES);
  const [selectedSite, setSelectedSite] = useState<LocationSite>(INITIAL_SITES[0]);
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>(INITIAL_REVIEW_QUEUE);
  const [reviewFilter, setReviewFilter] = useState<'All' | 'Pending' | 'Verified' | 'Rejected'>('All');

  // Trigger search loading animation
  const handleRunSearch = (queryToUse?: string) => {
    const q = queryToUse || searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    setIsSearching(true);
    setCurrentStageIndex(0);
  };

  // Handle stage progress timing
  useEffect(() => {
    if (isSearching) {
      if (currentStageIndex < PROCESSING_STAGES.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStageIndex((prev) => prev + 1);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsSearching(false);
          setCurrentStageIndex(-1);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isSearching, currentStageIndex]);

  // Navigate to Change Analysis for a specific site
  const handleSelectSiteForAnalysis = (site: LocationSite) => {
    setSelectedSite(site);
    setActiveTab('analysis');
  };

  // Handle Analyst Verification (Confirm / Reject)
  const handleVerifySite = (siteId: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
    const timestamp = '08 Sep 2026 • 22:30 IST';

    setSites((prev) =>
      prev.map((s) =>
        s.id === siteId
          ? { ...s, verificationStatus: newStatus, verificationTimestamp: timestamp }
          : s
      )
    );

    if (selectedSite.id === siteId) {
      setSelectedSite((prev) => ({
        ...prev,
        verificationStatus: newStatus,
        verificationTimestamp: timestamp,
      }));
    }

    setReviewQueue((prev) =>
      prev.map((item) =>
        item.siteId === siteId
          ? { ...item, status: newStatus === 'CONFIRMED' ? 'Verified' : 'Rejected' }
          : item
      )
    );
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setSites(INITIAL_SITES);
    setSelectedSite(INITIAL_SITES[0]);
    setReviewQueue(INITIAL_REVIEW_QUEUE);
    setSearchQuery('Find newly developed roads');
    setIsSearching(false);
    setCurrentStageIndex(-1);
    setActiveTab('search');
  };

  // Filter review items
  const filteredReviewQueue = reviewQueue.filter((item) => {
    if (reviewFilter === 'All') return true;
    return item.status === reviewFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wider text-slate-50 uppercase">NIRIKSHIQ</h1>
              <span className="text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                v2.4 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight">Satellite Intelligence • Search. Detect. Verify.</p>
          </div>
        </div>

        {/* System Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">ON-PREMISE / READY</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Server className="w-3 h-3 text-cyan-400" /> ISRO Sentinel Feed
            </span>
          </div>

          <button
            onClick={handleResetDemo}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Reset Demo
          </button>
        </div>
      </header>

      {/* BODY WITH LEFT SIDEBAR AND MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Workstation Navigation
            </div>

            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Semantic Search</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Change Analysis</span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                SITE-01
              </span>
            </button>

            <button
              onClick={() => setActiveTab('discovery')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'discovery'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Change Discovery</span>
            </button>

            <button
              onClick={() => setActiveTab('temporal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'temporal'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Temporal Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('similar')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'similar'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Similar Sites</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'review'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Analyst Review</span>
              </div>
              {reviewQueue.filter((r) => r.status === 'Pending').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {reviewQueue.filter((r) => r.status === 'Pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Info Card in Sidebar */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
            <div className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Active Session</div>
            <div className="text-slate-200 font-medium flex items-center justify-between">
              <span>Selected Target:</span>
              <span className="font-mono text-cyan-400 font-bold">{selectedSite.code}</span>
            </div>
            <div className="text-slate-400 text-[11px]">{selectedSite.name}, {selectedSite.state}</div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Confidence:</span>
              <span className="text-emerald-400 font-mono font-bold">{selectedSite.confidence}%</span>
            </div>
          </div>
        </aside>

        {/* MAIN VIEW AREA */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          
          {/* ================================================== */}
          {/* 1. SEMANTIC SEARCH SCREEN */}
          {/* ================================================== */}
          {activeTab === 'search' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Semantic Search</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Find meaningful changes across satellite imagery using natural language queries.
                </p>
              </div>

              {/* Large Search Input Bar & Suggestions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunSearch();
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask NIRIKSHIQ..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-medium transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search
                      </>
                    )}
                  </button>
                </form>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-mono text-[11px] mr-1">Suggestions:</span>
                  {SEARCH_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleRunSearch(suggestion)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        searchQuery === suggestion
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sequential Processing Pipeline State */}
              {isSearching && (
                <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 shadow-xl animate-fade-in">
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                    Executing Spatial Semantic Pipeline
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {PROCESSING_STAGES.map((stage, idx) => {
                      const isComplete = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div
                          key={stage}
                          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                            isComplete
                              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                              : 'bg-slate-950 border-slate-800/80 text-slate-500'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                          )}
                          <span className={isCurrent ? 'font-bold text-cyan-300 animate-pulse' : ''}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Main Content Area: Left Map & Right Detected Location Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Area: Satellite Map */}
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                    <span>SATELLITE WORKSTATION MAP</span>
                    <span>4 LOCATIONS DETECTED</span>
                  </div>
                  <SatelliteMap
                    sites={sites}
                    selectedSiteId={selectedSite.id}
                    onSelectSite={(s) => handleSelectSiteForAnalysis(s)}
                  />
                </div>

                {/* Right Area: Detected Location Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                    <span className="font-bold text-slate-200 uppercase tracking-wider">Detected Locations</span>
                    <span className="text-cyan-400">{sites.length} Results</span>
                  </div>

                  <div className="space-y-3">
                    {sites.map((site) => {
                      const isSelected = selectedSite.id === site.id;
                      return (
                        <div
                          key={site.id}
                          onClick={() => handleSelectSiteForAnalysis(site)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg group relative ${
                            isSelected
                              ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-cyan-400 text-sm">{site.code}</span>
                                <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                                  {site.name}, {site.state}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-300 mt-1 font-medium">{site.changeType}</p>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                site.priority === 'HIGH'
                                  ? 'bg-red-950/80 text-red-400 border-red-500/40'
                                  : site.priority === 'MEDIUM'
                                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              }`}
                            >
                              {site.priority}
                            </span>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span className="text-emerald-400 font-bold">{site.confidence}% confidence</span>
                            <span>{site.date}</span>
                          </div>

                          <div className="mt-2.5 flex items-center text-xs font-medium text-cyan-400 group-hover:translate-x-1 transition-transform">
                            <span>Inspect Change Analysis</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* 2. CHANGE ANALYSIS SCREEN (MOST IMPORTANT DEMO) */}
          {/* ================================================== */}
          {activeTab === 'analysis' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Target Location Metadata Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500 text-slate-950 font-mono font-bold px-2.5 py-1 rounded-md text-xs">
                      {selectedSite.code}
                    </span>
                    <h2 className="text-xl font-bold text-slate-50">{selectedSite.name}, {selectedSite.state}</h2>
                    <span className="bg-slate-800 text-slate-300 font-medium px-3 py-1 rounded-md text-xs border border-slate-700">
                      {selectedSite.changeType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs font-mono text-slate-400">
                    <div>Confidence: <span className="text-emerald-400 font-bold">{selectedSite.confidence}%</span></div>
                    <div>Priority: <span className="text-red-400 font-bold">{selectedSite.priority}</span></div>
                    <div>Changed Area: <span className="text-cyan-300 font-bold">{selectedSite.changedArea}</span></div>
                    <div>First Observation: <span className="text-slate-200">{selectedSite.firstObservation}</span></div>
                    <div>Sensor: <span className="text-slate-200">{selectedSite.sensor}</span></div>
                    <div>Processing: <span className="text-emerald-400 font-bold">{selectedSite.processingStatus}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('search')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-all border border-slate-700 flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-400" /> Back to Search
                  </button>
                </div>
              </div>

              {/* Main Area: Satellite Comparison Image Viewer */}
              <SatelliteImageViewer site={selectedSite} />

              {/* Temporal Timeline */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" /> Temporal Observation Timeline
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">3 Multi-Temporal Observations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TEMPORAL_STEPS.map((step) => {
                    const statusColor =
                      step.status === 'Confirmed'
                        ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                        : step.status === 'Emerging'
                        ? 'border-amber-500/60 text-amber-300 bg-amber-950/40'
                        : 'border-slate-700 text-slate-400 bg-slate-950';

                    return (
                      <div key={step.month} className={`p-4 rounded-xl border ${statusColor} space-y-2 relative`}>
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span>{step.month} {step.year}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {step.status}
                          </span>
                        </div>

                        <div className="text-lg font-bold font-mono">
                          {step.confidence}% <span className="text-xs text-slate-400 font-normal">detection confidence</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid Cards: Evidence Panel, False-Alarm Check, Intelligent Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Evidence Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                    <FileCheck className="w-4 h-4 text-cyan-400" /> Evidence
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Before/After comparison
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Persistent across temporal observations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Spatially consistent change
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> High confidence detection
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Low image-quality interference
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-lg text-xs font-mono text-emerald-300 font-bold text-center">
                      EVIDENCE SUPPORTS DETECTED CHANGE
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Confidence: {selectedSite.confidence}%</span>
                      <span>Status: Complete</span>
                    </div>
                  </div>
                </div>

                {/* False-Alarm Check */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> False-Alarm Check
                  </div>

                  <div className="space-y-2.5">
                    {FALSE_ALARM_CHECKS.map((check) => (
                      <div key={check.name} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">{check.name}:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <div className="bg-cyan-950/50 border border-cyan-500/30 p-2.5 rounded-lg text-xs font-mono text-cyan-300 text-center font-semibold">
                      Low likelihood of false detection
                    </div>
                  </div>
                </div>

                {/* Intelligent Priority */}
                <div className="bg-slate-900 border border-red-500/40 rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                      Intelligent Priority
                    </div>
                    <span className="px-2.5 py-1 rounded bg-red-950 border border-red-500/60 text-red-400 font-mono font-bold text-xs">
                      HIGH PRIORITY
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span> Significant structural change
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span> Persistent across temporal observations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span> High confidence detection (92%)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span> Low image-quality interference
                    </li>
                  </ul>

                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                    AUTOMATICALLY ESCALATED FOR IMMEDIATE HUMAN VERIFICATION
                  </div>
                </div>

              </div>

              {/* Analyst Verification Action Area */}
              <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-mono">Analyst Verification</h3>
                    <p className="text-xs text-slate-400">
                      Confirm or reject this detected change to update the ground truth database.
                    </p>
                  </div>

                  {/* Verification Status Display */}
                  {selectedSite.verificationStatus !== 'PENDING' ? (
                    <div className="flex items-center gap-3">
                      {selectedSite.verificationStatus === 'CONFIRMED' ? (
                        <div className="bg-emerald-950 border-2 border-emerald-500 px-4 py-2 rounded-xl text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <div>
                            <div>CHANGE CONFIRMED</div>
                            <div className="text-[10px] text-emerald-400 font-normal">
                              VERIFIED BY ANALYST • {selectedSite.verificationTimestamp}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-950 border-2 border-red-500 px-4 py-2 rounded-xl text-red-300 font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <div>
                            <div>CHANGE REJECTED</div>
                            <div className="text-[10px] text-red-400 font-normal">MARKED FOR REVIEW</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleVerifySite(selectedSite.id, 'CONFIRMED')}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        CONFIRM CHANGE
                      </button>

                      <button
                        onClick={() => handleVerifySite(selectedSite.id, 'REJECTED')}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 font-bold rounded-xl text-xs font-mono transition-all active:scale-95 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        REJECT CHANGE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* 3. CHANGE DISCOVERY SCREEN */}
          {/* ================================================== */}
          {activeTab === 'discovery' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Change Discovery</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Discover significant changes without specifying an exact location.
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
                  <div className="text-xs font-mono text-slate-400">Total Detected Changes</div>
                  <div className="text-2xl font-bold font-mono text-slate-100">12</div>
                  <div className="text-[11px] text-cyan-400">Significant Changes</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
                  <div className="text-xs font-mono text-slate-400">High Priority</div>
                  <div className="text-2xl font-bold font-mono text-red-400">4</div>
                  <div className="text-[11px] text-slate-400">Requires Urgent Review</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
                  <div className="text-xs font-mono text-slate-400">Medium Priority</div>
                  <div className="text-2xl font-bold font-mono text-amber-400">7</div>
                  <div className="text-[11px] text-slate-400">Standard Queue</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-1">
                  <div className="text-xs font-mono text-slate-400">Low Priority</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">1</div>
                  <div className="text-[11px] text-slate-400">Minor Footprint</div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 font-mono uppercase">Operational Discovery List</h3>
                  <span className="text-xs font-mono text-slate-400">Click any row to inspect</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">Code</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Change Type</th>
                        <th className="p-4">Confidence</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {sites.map((site) => (
                        <tr
                          key={site.id}
                          onClick={() => handleSelectSiteForAnalysis(site)}
                          className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 font-bold text-cyan-400">{site.code}</td>
                          <td className="p-4 font-sans font-bold text-slate-100">{site.name}, {site.state}</td>
                          <td className="p-4 text-slate-300">{site.changeType}</td>
                          <td className="p-4 text-emerald-400 font-bold">{site.confidence}%</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                site.priority === 'HIGH'
                                  ? 'bg-red-950 text-red-400 border-red-500/40'
                                  : site.priority === 'MEDIUM'
                                  ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                              }`}
                            >
                              {site.priority}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{site.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                site.verificationStatus === 'CONFIRMED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : site.verificationStatus === 'REJECTED'
                                  ? 'bg-red-950 text-red-400 border border-red-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {site.verificationStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-cyan-400 group-hover:translate-x-1 inline-flex items-center gap-1 font-sans">
                              Inspect <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* 4. TEMPORAL ANALYSIS SCREEN */}
          {/* ================================================== */}
          {activeTab === 'temporal' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Temporal Analysis</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Multi-spectral temporal trend reconstruction for SITE-01 — Kurnool.
                </p>
              </div>

              {/* Target Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">SITE-01 — Kurnool</span>
                  <span>| Road Development Corridor</span>
                </div>
                <span>Observations: June 2026 → July 2026 → August 2026</span>
              </div>

              {/* 3 Thumbnails Visual Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* June */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">JUNE 2026</span>
                    <span className="text-slate-400">12% Confidence</span>
                  </div>

                  <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 300 200">
                      <rect width="300" height="200" fill="#0f2032" />
                      <circle cx="150" cy="100" r="40" fill="#13273d" />
                      <path d="M 20 180 Q 150 150 280 20" fill="none" stroke="#223a5e" strokeWidth="3" />
                    </svg>
                    <span className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                      Stable Terrain
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">Baseline natural vegetation & agricultural terrain.</p>
                </div>

                {/* July */}
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl overflow-hidden shadow-xl space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400">JULY 2026</span>
                    <span className="text-amber-300 font-bold">64% Confidence</span>
                  </div>

                  <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 300 200">
                      <rect width="300" height="200" fill="#0f2032" />
                      <circle cx="150" cy="100" r="40" fill="#13273d" />
                      <path d="M 20 180 Q 150 150 280 20" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
                    </svg>
                    <span className="absolute bottom-2 left-2 bg-amber-950/90 border border-amber-500 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300">
                      Emerging Ground Work
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">Linear ground disturbance & earth clearing detected.</p>
                </div>

                {/* August */}
                <div className="bg-slate-900 border border-cyan-500/60 rounded-xl overflow-hidden shadow-xl space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-400">AUGUST 2026</span>
                    <span className="text-cyan-300 font-bold">92% Confidence</span>
                  </div>

                  <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 300 200">
                      <rect width="300" height="200" fill="#0f2032" />
                      <path d="M 20 180 Q 150 150 280 20" fill="none" stroke="#06b6d4" strokeWidth="8" />
                      <path d="M 20 180 Q 150 150 280 20" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 2" />
                    </svg>
                    <span className="absolute bottom-2 left-2 bg-cyan-950/90 border border-cyan-400 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold">
                      Confirmed Road
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">Asphalt paving completed across 1.84 ha area.</p>
                </div>

              </div>

              {/* Confidence Progression Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
                <div className="text-xs font-mono text-slate-300 font-bold uppercase">
                  Change-Confidence Progression Curve
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-slate-400">June 2026</span>
                    <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-slate-600 h-full w-[12%]" />
                    </div>
                    <span className="w-12 text-right text-slate-400">12%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-20 text-slate-400">July 2026</span>
                    <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-amber-500 h-full w-[64%]" />
                    </div>
                    <span className="w-12 text-right text-amber-400 font-bold">64%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-20 text-slate-400">Aug 2026</span>
                    <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-cyan-400 h-full w-[92%]" />
                    </div>
                    <span className="w-12 text-right text-cyan-400 font-bold">92%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* 5. SIMILAR SITES SCREEN */}
          {/* ================================================== */}
          {activeTab === 'similar' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Similar Sites</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Locations ranked by embedding-based visual similarity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SIMILAR_SITES.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => setActiveTab('analysis')}
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all cursor-pointer space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {sim.name}
                      </h3>
                      <span className="bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold px-2.5 py-1 rounded-md text-xs">
                        {sim.similarity}% similarity
                      </span>
                    </div>

                    {/* Satellite Graphic Card */}
                    <div className="h-32 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 200 120">
                        <rect width="200" height="120" fill="#0c1724" />
                        <path d="M 0,30 L 200,90" stroke="#06b6d4" strokeWidth="4" />
                        <circle cx="100" cy="60" r="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
                      </svg>
                      <span className="absolute bottom-2 left-2 bg-slate-900/90 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                        {sim.coordinates}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400">Pattern: <span className="text-slate-200 font-semibold">{sim.changePattern}</span></div>
                      <div className="text-slate-400">Calculated Footprint: <span className="text-cyan-300 font-mono">{sim.area}</span></div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                      <span>View Similarity Map</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* 6. ANALYST REVIEW SCREEN */}
          {/* ================================================== */}
          {activeTab === 'review' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Analyst Review Queue</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Verification queue for human intelligence validation.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1 mr-2">
                  <Filter className="w-3.5 h-3.5" /> Filter Queue:
                </span>
                {(['All', 'Pending', 'Verified', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setReviewFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      reviewFilter === filter
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {filter} ({reviewQueue.filter((r) => filter === 'All' || r.status === filter).length})
                  </button>
                ))}
              </div>

              {/* Review Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">Queue ID</th>
                      <th className="p-4">Site Code</th>
                      <th className="p-4">Target & Description</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Date Added</th>
                      <th className="p-4">Review Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredReviewQueue.map((item) => {
                      const siteObj = sites.find((s) => s.id === item.siteId) || sites[0];

                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectSiteForAnalysis(siteObj)}
                          className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 font-bold text-slate-200">{item.id}</td>
                          <td className="p-4 text-cyan-400 font-bold">{item.code}</td>
                          <td className="p-4 font-sans font-semibold text-slate-100">{item.location}</td>
                          <td className="p-4 text-emerald-400 font-bold">{item.confidence}%</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                item.priority === 'HIGH'
                                  ? 'bg-red-950 text-red-400 border-red-500/40'
                                  : item.priority === 'MEDIUM'
                                  ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{item.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                item.status === 'Verified'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                  : item.status === 'Rejected'
                                  ? 'bg-red-950 text-red-400 border border-red-500/40'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-sans">
                            <span className="text-cyan-400 font-medium group-hover:translate-x-1 inline-flex items-center gap-1">
                              Review <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
