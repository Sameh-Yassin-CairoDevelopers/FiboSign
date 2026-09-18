import React from 'react';
import { Instrument } from '../types';
import { Sparkles, BookOpen, Upload, Globe, Activity, Layers } from 'lucide-react';

interface Props {
  instruments: Instrument[];
  selectedInstrument: Instrument;
  onSelectInstrument: (inst: Instrument) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenTheoryModal: () => void;
  onOpenUploadModal: () => void;
  onAutoOptimalD: () => void;
  optimalD: number;
}

export const Header: React.FC<Props> = ({
  instruments,
  selectedInstrument,
  onSelectInstrument,
  lang,
  onToggleLang,
  onOpenTheoryModal,
  onOpenUploadModal,
  onAutoOptimalD,
  optimalD,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-tight">
                {isAr ? 'محرك الذاكرة الكسرية للأسواق' : 'Fractional Dynamics Engine'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.6 Quant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'الحساب التفاضلي الكسري وأس هيرست (EGX / Silver / Gold)'
                : 'Fractional Differentiation & Long Memory (Silver / EGX)'}
            </p>
          </div>
        </div>

        {/* Instruments Dropdown Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="instrument-select"
              value={selectedInstrument.id}
              onChange={(e) => {
                const found = instruments.find((i) => i.id === e.target.value);
                if (found) onSelectInstrument(found);
              }}
              className="appearance-none bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-xs md:text-sm font-medium rounded-lg px-4 py-2 pe-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {isAr ? inst.nameAr : inst.name} ({inst.symbol})
                </option>
              ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 ${isAr ? 'left-2.5' : 'right-2.5'} flex items-center text-slate-400 text-xs`}>
              ▼
            </div>
          </div>

          {/* Quick Optimal D Action */}
          <button
            id="quick-optimal-d-btn"
            onClick={onAutoOptimalD}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-all"
            title={isAr ? `تطبيق الرتبة الكسرية المثلى d* = ${optimalD}` : `Apply Optimal Fractional Order d* = ${optimalD}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? `الرتبة المثلى d* = ${optimalD}` : `Optimal d* = ${optimalD}`}</span>
          </button>
        </div>

        {/* Action Buttons: Theory, Upload CSV, Language */}
        <div className="flex items-center gap-2">
          {/* Theory Modal Button */}
          <button
            id="open-theory-btn"
            onClick={onOpenTheoryModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {isAr ? 'الأسس العلمية والفرق عن المؤشرات' : 'Theory & Quant Edge'}
            </span>
            <span className="sm:hidden">{isAr ? 'الأسس' : 'Theory'}</span>
          </button>

          {/* Upload Custom CSV */}
          <button
            id="open-upload-btn"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isAr ? 'بيانات CSV' : 'CSV Data'}</span>
          </button>

          {/* Language Toggle */}
          <button
            id="toggle-lang-btn"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
