import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { FractionalResultPoint, Instrument } from '../types';
import { Eye, EyeOff, Info } from 'lucide-react';

interface Props {
  instrument: Instrument;
  data: FractionalResultPoint[];
  currentD: number;
  lang: 'ar' | 'en';
}

export const MainChart: React.FC<Props> = ({ instrument, data, currentD, lang }) => {
  const isAr = lang === 'ar';
  const [showEvents, setShowEvents] = useState(true);

  // Map data to chart ready format
  const chartData = data.map((d, index) => {
    const originalBar = instrument.data[index];
    return {
      date: d.date,
      price: d.originalPrice,
      fracDiff: d.fractionalValue,
      hurst: d.hurstExponent,
      regime: d.regime,
      signal: d.signal,
      signalReason: d.signalReason,
      eventNote: originalBar?.eventNote,
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-slate-200 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">
              {isAr ? instrument.nameAr : instrument.name}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {instrument.currency}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAr ? instrument.historicalContextAr : instrument.historicalContext}
          </p>
        </div>

        <button
          id="toggle-events-btn"
          onClick={() => setShowEvents(!showEvents)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
        >
          {showEvents ? <Eye className="w-3.5 h-3.5 text-indigo-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isAr ? 'عرض علامات الأحداث التاريخية' : 'Show Event Notes'}</span>
        </button>
      </div>

      {/* Pane 1: Original Price */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
            {isAr ? 'السلسلة السعرية الأصلية P(t):' : 'Original Asset Price P(t):'}
          </span>
          <span className="text-slate-400">
            {isAr ? 'آخر سعر:' : 'Latest:'} <strong className="text-cyan-400 text-sm">{data.length > 0 ? data[data.length - 1].originalPrice.toLocaleString() : '-'} {instrument.currency}</strong>
          </span>
        </div>

        <div className="h-64 md:h-72 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomPriceTooltip currency={instrument.currency} isAr={isAr} />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38bdf8' }}
                activeDot={{ r: 6, fill: '#0284c7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pane 2: Fractionally Differentiated Series D^d(P_t) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span>
            {isAr ? `المشتقة الكسرية D^${currentD.toFixed(2)} P(t):` : `Fractionally Differentiated Series D^${currentD.toFixed(2)} P(t):`}
          </span>
          <span className="text-slate-400">
            {isAr ? 'القيمة اللحظية:' : 'Value:'}{' '}
            <strong className="text-indigo-400 font-mono">
              {data.length > 0 ? data[data.length - 1].fractionalValue.toFixed(2) : '-'}
            </strong>
          </span>
        </div>

        <div className="h-44 md:h-52 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
              <Tooltip content={<CustomFracTooltip isAr={isAr} d={currentD} />} />
              <Area
                type="monotone"
                dataKey="fracDiff"
                fill="#6366f1"
                fillOpacity={0.15}
                stroke="#818cf8"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pane 3: Rolling Hurst Exponent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            {isAr ? 'أس هيرست المتدحرج H(t) [مقياس الذاكرة والاتجاهية]:' : 'Rolling Hurst Exponent H(t) [Memory Persistence]:'}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-cyan-400">H &gt; 0.55 (اتجاهي مستمر)</span>
            <span className="text-slate-400">H = 0.50 (عشوائي)</span>
            <span className="text-amber-400">H &lt; 0.45 (ارتداد للمتوسط)</span>
          </div>
        </div>

        <div className="h-36 md:h-44 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0.2, 0.85]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <ReferenceLine y={0.5} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Random Walk 0.5', fill: '#64748b', fontSize: 10 }} />
              <ReferenceLine y={0.55} stroke="#06b6d4" strokeDasharray="2 2" />
              <ReferenceLine y={0.45} stroke="#f59e0b" strokeDasharray="2 2" />
              <Tooltip content={<CustomHurstTooltip isAr={isAr} />} />
              <Line
                type="monotone"
                dataKey="hurst"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2, fill: '#f59e0b' }}
                activeDot={{ r: 5, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Tooltip Components
const CustomPriceTooltip = ({ active, payload, label, currency, isAr }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs text-slate-200 z-50 font-mono">
        <div className="text-slate-400 font-bold mb-1 border-b border-slate-800 pb-1">{label}</div>
        <div className="flex justify-between gap-4 py-0.5">
          <span className="text-slate-400">{isAr ? 'السعر:' : 'Price:'}</span>
          <strong className="text-cyan-400">{data.price.toLocaleString()} {currency}</strong>
        </div>
        {data.eventNote && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-amber-300 text-[11px] max-w-[220px]">
            ⚡ {data.eventNote}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomFracTooltip = ({ active, payload, label, isAr, d }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs text-slate-200 z-50 font-mono">
        <div className="text-slate-400 font-bold mb-1 border-b border-slate-800 pb-1">{label}</div>
        <div className="flex justify-between gap-4 py-0.5">
          <span className="text-slate-400">D^{d.toFixed(2)} P(t):</span>
          <strong className="text-indigo-400">{data.fracDiff.toFixed(2)}</strong>
        </div>
        {data.signal !== 'NEUTRAL' && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                data.signal === 'BUY'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {data.signal}
            </span>
            <span className="text-slate-300 text-[10px]">{data.signalReason}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomHurstTooltip = ({ active, payload, label, isAr }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs text-slate-200 z-50 font-mono">
        <div className="text-slate-400 font-bold mb-1 border-b border-slate-800 pb-1">{label}</div>
        <div className="flex justify-between gap-4 py-0.5">
          <span className="text-slate-400">H(t):</span>
          <strong className="text-amber-400">{data.hurst.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between gap-4 py-0.5 text-[11px]">
          <span className="text-slate-400">{isAr ? 'النظام:' : 'Regime:'}</span>
          <span
            className={
              data.regime === 'persistent'
                ? 'text-cyan-400'
                : data.regime === 'mean_reverting'
                ? 'text-amber-400'
                : 'text-slate-400'
            }
          >
            {data.regime === 'persistent'
              ? (isAr ? 'اتجاهي بذاكرة متراكمة' : 'Persistent Trend')
              : data.regime === 'mean_reverting'
              ? (isAr ? 'ارتداد خشن للمتوسط' : 'Rough Mean-Reversion')
              : (isAr ? 'حركة عشوائية' : 'Random Walk')}
          </span>
        </div>
      </div>
    );
  }
  return null;
};
