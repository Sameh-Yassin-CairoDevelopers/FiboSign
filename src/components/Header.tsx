import React from 'react';
import { Instrument, AssetCategory } from '../types';
import { Sparkles, BookOpen, Upload, Globe, Activity, Smartphone, Monitor, Database, History, ExternalLink } from 'lucide-react';

interface Props {
  instruments: Instrument[];
  selectedInstrument: Instrument;
  onSelectInstrument: (inst: Instrument) => void;
  activeCategory: AssetCategory;
  onSelectCategory: (cat: AssetCategory) => void;
  activeTab: 'terminal' | 'live' | 'backtest' | 'spec' | 'data';
  onSelectTab: (tab: 'terminal' | 'live' | 'backtest' | 'spec' | 'data') => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenTheoryModal: () => void;
  onOpenUploadModal: () => void;
  onOpenDataReqModal: () => void;
  onAutoOptimalD: () => void;
  optimalD: number;
}

export const Header: React.FC<Props> = ({
  instruments,
  selectedInstrument,
  onSelectInstrument,
  activeCategory,
  onSelectCategory,
  activeTab,
  onSelectTab,
  isMobileView,
  onToggleMobileView,
  lang,
  onToggleLang,
  onOpenTheoryModal,
  onOpenUploadModal,
  onOpenDataReqModal,
  onAutoOptimalD,
  optimalD,
}) => {
  const isAr = lang === 'ar';

  const categories: { id: AssetCategory; nameAr: string; nameEn: string }[] = [
    { id: 'all', nameAr: 'الكل', nameEn: 'All' },
    { id: 'metal', nameAr: 'المعادن (فضة/ذهب)', nameEn: 'Metals' },
    { id: 'egx', nameAr: 'البورصة والأسهم', nameEn: 'Equities' },
    { id: 'otc', nameAr: 'خارج المقصورة (المهن الطبية)', nameEn: 'OTC' },
    { id: 'forex', nameAr: 'العملات (USD/EGP)', nameEn: 'Forex' },
    { id: 'nft', nameAr: 'الأصول الرقمية (NFT)', nameEn: 'NFT & Crypto' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Line: Brand, Repo link, Mobile toggle, Lang */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg text-white tracking-tight flex items-center gap-1.5">
                  FiboSign
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isAr ? 'مشروع الـ 80%' : 'Project 80%'}
                  </span>
                </h1>
                <a
                  href="https://sameh-yassin-cairodevelopers.github.io/FiboSign/"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded transition-colors"
                  title="GitHub Pages Live"
                >
                  <span>GitHub Pages</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isAr
                  ? 'منظومة الحساب التفاضلي الكسري وأس هيرست للذاكرة الكمية'
                  : 'Fractional Calculus & Rolling Hurst Quantitative Engine'}
              </p>
            </div>
          </div>

          {/* Controls: Mode Toggles & Modals */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Viewport Frame Toggle (Mobile vs Desktop) */}
            <button
              id="toggle-mobile-frame-btn"
              onClick={onToggleMobileView}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isMobileView
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isAr ? 'التبديل بين وضع شاشة الموبايل والشاشة الكاملة' : 'Toggle Mobile Frame Simulator'}
            >
              {isMobileView ? <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> : <Monitor className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{isMobileView ? (isAr ? 'وضع الموبايل' : 'Mobile View') : (isAr ? 'العرض الكامل' : 'Desktop View')}</span>
            </button>

            {/* Quick Optimal D Action */}
            <button
              id="quick-optimal-d-btn"
              onClick={onAutoOptimalD}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all"
              title={isAr ? `تطبيق الرتبة الكسرية المثلى d* = ${optimalD}` : `Apply Optimal Fractional Order d* = ${optimalD}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono font-bold">d*={optimalD}</span>
            </button>

            {/* Data Specs Modal */}
            <button
              id="open-data-req-btn"
              onClick={onOpenDataReqModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              title={isAr ? 'دليل البيانات المطلوبة (Date, Close, Volume)' : 'Data Architecture Guide'}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{isAr ? 'متطلبات البيانات' : 'Data Specs'}</span>
            </button>

            {/* Theory Modal */}
            <button
              id="open-theory-btn"
              onClick={onOpenTheoryModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'الأسس العلمية' : 'Theory'}</span>
            </button>

            {/* Custom CSV Upload */}
            <button
              id="open-upload-btn"
              onClick={onOpenUploadModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{isAr ? 'استيراد CSV' : 'Import CSV'}</span>
            </button>

            {/* Language Toggle */}
            <button
              id="toggle-lang-btn"
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Second Line: Section Tabs (Terminal vs Walk-Forward Backtest vs Academic Spec) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              id="tab-terminal-btn"
              onClick={() => onSelectTab('terminal')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isAr ? 'المحطة والرسوم' : 'Terminal'}</span>
            </button>

            <button
              id="tab-live-btn"
              onClick={() => onSelectTab('live')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isAr ? 'مختبر التنبؤ الحي (2-3 ساعات)' : 'Live Forecast Lab'}</span>
            </button>

            <button
              id="tab-backtest-btn"
              onClick={() => onSelectTab('backtest')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'backtest'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{isAr ? 'آلة الزمن واختبار الـ 80%' : 'Time Machine (80% Backtest)'}</span>
            </button>

            <button
              id="tab-spec-btn"
              onClick={() => onSelectTab('spec')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'spec'
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAr ? 'الورقة الأكاديمية والمستودع' : 'Research Paper & Repo'}</span>
            </button>
          </div>

          {/* Instrument Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {isAr ? 'الأصل المالي:' : 'Instrument:'}
            </span>
            <div className="relative">
              <select
                id="instrument-select"
                value={selectedInstrument.id}
                onChange={(e) => {
                  const found = instruments.find((i) => i.id === e.target.value);
                  if (found) onSelectInstrument(found);
                }}
                className="appearance-none bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold rounded-lg px-3 py-1.5 pe-7 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[210px] truncate"
              >
                {instruments.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {isAr ? inst.nameAr : inst.name} ({inst.symbol})
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 ${isAr ? 'left-2' : 'right-2'} flex items-center text-slate-400 text-xs`}>
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Third Line: Asset Categories Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.id}-btn`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-[11px] font-medium border ${
                activeCategory === cat.id
                  ? 'bg-indigo-500/20 text-cyan-300 border-indigo-500/50 font-semibold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {isAr ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
