/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Instrument, MarketBar } from './types';
import { MARKET_INSTRUMENTS } from './data/marketDatasets';
import { processMarketSeries } from './math/fractionalMath';
import { Header } from './components/Header';
import { FractionalControlPanel } from './components/FractionalControlPanel';
import { MainChart } from './components/MainChart';
import { MemoryWeightInspector } from './components/MemoryWeightInspector';
import { QuantSignalsPanel } from './components/QuantSignalsPanel';
import { TheoreticalComparisonModal } from './components/TheoreticalComparisonModal';
import { CsvUploaderModal } from './components/CsvUploaderModal';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [instruments, setInstruments] = useState<Instrument[]>(MARKET_INSTRUMENTS);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(MARKET_INSTRUMENTS[0]); // Silver default
  const [fractionalOrderD, setFractionalOrderD] = useState<number>(0.40);
  const [hurstWindow, setHurstWindow] = useState<number>(25);

  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Compute mathematical pipeline (Fractional Diff, Rolling Hurst, Metrics, Weights)
  const { points, metrics, weights } = useMemo(() => {
    return processMarketSeries(selectedInstrument.data, fractionalOrderD, hurstWindow);
  }, [selectedInstrument, fractionalOrderD, hurstWindow]);

  // When switching instrument, recalculate and optionally suggest optimal d
  const handleSelectInstrument = (inst: Instrument) => {
    setSelectedInstrument(inst);
  };

  const handleApplyOptimalD = () => {
    setFractionalOrderD(metrics.optimalD);
  };

  const handleCustomDatasetLoaded = (customInst: Instrument) => {
    setInstruments((prev) => [customInst, ...prev]);
    setSelectedInstrument(customInst);
  };

  const lastPoint = points.length > 0 ? points[points.length - 1] : undefined;
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <Header
        instruments={instruments}
        selectedInstrument={selectedInstrument}
        onSelectInstrument={handleSelectInstrument}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        onOpenTheoryModal={() => setIsTheoryOpen(true)}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onAutoOptimalD={handleApplyOptimalD}
        optimalD={metrics.optimalD}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Welcome Notice for Professional Broker & Engineer */}
        <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-sm md:text-base font-bold text-white">
                {isAr
                  ? `منظومة الحساب التفاضلي الكسري: تحليل ${selectedInstrument.nameAr}`
                  : `Fractional Dynamics Engine: Analyzing ${selectedInstrument.name}`}
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              {isAr
                ? 'محرك رياضي مصمم لمعالجة معضلة "فقدان الذاكرة" التي تعاني منها مؤشرات التحليل الفني الكلاسيكية (RSI, MACD)، ورصد التحولات الطورية للأسواق ذات التقلب الخشن (Rough Volatility) وعطالة الذاكرة الممتدة.'
                : 'A mathematical quantitative engine solving the memory-loss dilemma of classical technical indicators, tracking phase transitions in long-memory and rough volatility financial regimes.'}
            </p>
          </div>

          <button
            id="view-theory-guide-btn"
            onClick={() => setIsTheoryOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            {isAr ? 'عرض الإثبات والمقارنة الفنية' : 'View Theoretical Proof'}
          </button>
        </div>

        {/* 1. Quantitative Signals & Status Overview */}
        <QuantSignalsPanel
          metrics={metrics}
          lastPoint={lastPoint}
          currency={selectedInstrument.currency}
          lang={lang}
        />

        {/* 2. Interactive Fractional Parameter Controls */}
        <FractionalControlPanel
          currentD={fractionalOrderD}
          onDChange={setFractionalOrderD}
          hurstWindow={hurstWindow}
          onHurstWindowChange={setHurstWindow}
          metrics={metrics}
          onAutoOptimal={handleApplyOptimalD}
          lang={lang}
        />

        {/* 3. Main Multi-Pane Chart (Price, Fractional Derivative, Rolling Hurst) */}
        <MainChart
          instrument={selectedInstrument}
          data={points}
          currentD={fractionalOrderD}
          lang={lang}
        />

        {/* 4. Memory Kernel Weight Decay Inspector */}
        <MemoryWeightInspector
          weights={weights}
          currentD={fractionalOrderD}
          halfLife={metrics.memoryDecayHalfLifeBars}
          lang={lang}
        />
      </main>

      {/* Modals */}
      <TheoreticalComparisonModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        lang={lang}
      />

      <CsvUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCustomDatasetLoaded={handleCustomDatasetLoaded}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        {isAr
          ? 'مشروع الديناميكا الكسرية والذاكرة الكمية للأسواق • مهندس وسماسرة البورصة المصرية • 2026'
          : 'Fractional Dynamics & Market Memory Engine • Engineered for EGX & Commodities • 2026'}
      </footer>
    </div>
  );
}
