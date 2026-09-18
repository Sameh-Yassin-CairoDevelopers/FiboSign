import React from 'react';
import { QuantitativeMetrics } from '../types';
import { Sliders, Zap, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  currentD: number;
  onDChange: (newD: number) => void;
  hurstWindow: number;
  onHurstWindowChange: (newWindow: number) => void;
  metrics: QuantitativeMetrics;
  onAutoOptimal: () => void;
  lang: 'ar' | 'en';
}

export const FractionalControlPanel: React.FC<Props> = ({
  currentD,
  onDChange,
  hurstWindow,
  onHurstWindowChange,
  metrics,
  onAutoOptimal,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-slate-200" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Title & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-white text-base md:text-lg">
            {isAr ? 'معايير المشتقة الكسرية ونافذة الذاكرة' : 'Fractional Differentiation & Memory Parameters'}
          </h2>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 me-1 hidden sm:inline">
            {isAr ? 'النماذج الشائعة:' : 'Presets:'}
          </span>
          <button
            id="preset-d-0"
            onClick={() => onDChange(0.0)}
            className={`px-2.5 py-1.5 rounded font-mono transition-all ${
              currentD === 0
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isAr ? 'السلسلة الأصلية الخام (ذاكرة كاملة ولكن بدون استقرار إحصائي)' : 'Raw Price (100% Memory, Non-Stationary)'}
          >
            d = 0.00
          </button>
          <button
            id="preset-d-optimal"
            onClick={onAutoOptimal}
            className={`px-2.5 py-1.5 rounded font-mono transition-all flex items-center gap-1 ${
              Math.abs(currentD - metrics.optimalD) < 0.02
                ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
            }`}
            title={isAr ? `الرتبة المثلى رياضياً (أدنى d يحقق الاستقرار مع أقصى ذاكرة)` : 'Optimal Minimal d achieving stationarity'}
          >
            <Zap className="w-3 h-3 text-indigo-300" />
            <span>d* = {metrics.optimalD.toFixed(2)}</span>
          </button>
          <button
            id="preset-d-1"
            onClick={() => onDChange(1.0)}
            className={`px-2.5 py-1.5 rounded font-mono transition-all ${
              currentD === 1.0
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isAr ? 'المشتقة العادية الأولى (الـ Returns المستخدمة في RSI / MACD - ذاكرة ميتة 0%)' : 'Standard First Difference / Returns (100% Memory Loss)'}
          >
            d = 1.00
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider 1: Fractional Order d */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="fractional-d-slider" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <span>{isAr ? 'رتبة الاشتقاق الكسري (Fractional Order d):' : 'Fractional Differentiation Order (d):'}</span>
              <span className="text-xs text-slate-500 font-mono">(0.00 → 1.00)</span>
            </label>
            <span className="text-base font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/40">
              d = {currentD.toFixed(2)}
            </span>
          </div>

          <input
            id="fractional-d-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentD}
            onChange={(e) => onDChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{isAr ? '0.00 (سعر خام)' : '0.00 (Raw Price)'}</span>
            <span className="text-indigo-400 font-bold">{isAr ? `d*=${metrics.optimalD} (الحد الأمثل)` : `d*=${metrics.optimalD} (Optimum)`}</span>
            <span>{isAr ? '1.00 (فروق عادية)' : '1.00 (Returns)'}</span>
          </div>

          {/* Real-time Status Badges for current d */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                metrics.isStationary
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                  : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
              }`}
            >
              {metrics.isStationary ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>
                {metrics.isStationary
                  ? (isAr ? 'مستقرة إحصائياً (ADF p < 0.05)' : 'Stationary (ADF p < 0.05)')
                  : (isAr ? 'غير مستقرة إحصائياً (p ≥ 0.05)' : 'Non-Stationary (p ≥ 0.05)')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              <span>{isAr ? 'حفظ الذاكرة:' : 'Memory Retained:'}</span>
              <strong className={metrics.memoryRetentionPct > 70 ? 'text-cyan-400' : 'text-amber-400'}>
                {metrics.memoryRetentionPct}%
              </strong>
            </div>
          </div>
        </div>

        {/* Slider 2: Rolling Hurst Window */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="hurst-window-slider" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <span>{isAr ? 'نافذة أس هيرست المتدحرجة (Hurst Window):' : 'Rolling Hurst Exponent Window:'}</span>
              <span className="text-xs text-slate-500 font-mono">(Bars)</span>
            </label>
            <span className="text-base font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
              {hurstWindow} {isAr ? 'شمعة' : 'bars'}
            </span>
          </div>

          <input
            id="hurst-window-slider"
            type="range"
            min="10"
            max="50"
            step="1"
            value={hurstWindow}
            onChange={(e) => onHurstWindowChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{isAr ? '10 شموع (حساس جداً)' : '10 Bars (Hyper-sensitive)'}</span>
            <span>{isAr ? '25 شمعة (افتراضي)' : '25 Bars (Default)'}</span>
            <span>{isAr ? '50 شمعة (اتجاه كلي)' : '50 Bars (Macro)'}</span>
          </div>

          {/* Hurst Regime Live Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono ${
                metrics.hurstRegime === 'persistent'
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50'
                  : metrics.hurstRegime === 'mean_reverting'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>H = {metrics.currentHurst.toFixed(2)}:</span>
              <strong>
                {metrics.hurstRegime === 'persistent'
                  ? (isAr ? 'نظام استمراري ذو ذاكرة اتجاهية (H > 0.55)' : 'Persistent Trend Regime (H > 0.55)')
                  : metrics.hurstRegime === 'mean_reverting'
                  ? (isAr ? 'نظام ارتدادي خشن للمتوسط (H < 0.45)' : 'Mean-Reverting Rough Regime (H < 0.45)')
                  : (isAr ? 'حركة عشوائية براونية (H ≈ 0.50)' : 'Random Walk / Noise (H ≈ 0.50)')}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
