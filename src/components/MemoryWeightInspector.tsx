import React from 'react';
import { MemoryKernelWeight } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Clock, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  weights: MemoryKernelWeight[];
  currentD: number;
  halfLife: number;
  lang: 'ar' | 'en';
}

export const MemoryWeightInspector: React.FC<Props> = ({ weights, currentD, halfLife, lang }) => {
  const isAr = lang === 'ar';
  const displayWeights = weights.slice(0, 35);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-slate-200 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white text-base">
            {isAr ? 'مصفوفة أوزان الذاكرة التاريخية (Memory Kernel Decay Weights)' : 'Memory Kernel Decay Weights w_k'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">{isAr ? 'عمر النصف للذاكرة:' : 'Memory Half-Life:'}</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
            {halfLife} {isAr ? 'شمعة / فترة' : 'bars / lags'}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {isAr ? (
          <>
            توزيع أوزان ذات انحدار قوسي <strong>(Power-Law Decay: w_k ~ k^-(d+1))</strong>. لاحظ كيف تؤثر الصدمات السعرية التي حدثت قبل {halfLife} شمعة في تحديد قيمة اليوم، بعكس المؤشرات التقليدية كـ RSI و MACD التي تفقد 100% من تأثير الصدمة بعد فترات زمنية سريعة.
          </>
        ) : (
          <>
            Power-Law decay weights <strong>w_k ~ k^-(d+1)</strong>. Notice how historical events {halfLife} lags ago continue exerting gravitational mathematical pull on today's price value.
          </>
        )}
      </p>

      {/* Weights Bar Chart */}
      <div className="h-48 md:h-56 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayWeights} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="lag" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: isAr ? 'فارق الشموع في الماضي (Lag k)' : 'Historical Lag (k)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
            <ReferenceLine y={0} stroke="#475569" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200">
                      <div>{isAr ? `الشمعة السابقة (k = ${item.lag}):` : `Lag k = ${item.lag}:`}</div>
                      <div className="text-cyan-400 font-bold mt-0.5">w_k = {item.weight.toFixed(5)}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        {isAr ? `التأثير التراكمي: ${item.cumulativeImpact.toFixed(3)}` : `Cumulative Impact: ${item.cumulativeImpact.toFixed(3)}`}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="weight" fill="#38bdf8" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lags Formula Note */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 font-mono">
          <span className="text-slate-400 block text-[11px] mb-1">{isAr ? 'وزن اللحظة الحالية (k=0):' : 'Current Bar Weight (k=0):'}</span>
          <span className="text-white font-bold">w_0 = 1.000</span>
        </div>
        <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 font-mono">
          <span className="text-slate-400 block text-[11px] mb-1">{isAr ? 'وزن الشمعة السابقة (k=1):' : 'Previous Bar Weight (k=1):'}</span>
          <span className="text-rose-400 font-bold">w_1 = -{(currentD).toFixed(3)}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 font-mono">
          <span className="text-slate-400 block text-[11px] mb-1">{isAr ? 'تلاشي الذيل بعد 20 شمعة:' : 'Long Tail at Lag 20:'}</span>
          <span className="text-indigo-400 font-bold">
            w_20 = {weights.length > 20 ? weights[20].weight.toFixed(5) : '0.00000'}
          </span>
        </div>
      </div>
    </div>
  );
};
