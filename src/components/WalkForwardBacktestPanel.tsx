import React, { useState, useMemo } from 'react';
import { Instrument, MarketBar } from '../types';
import { runWalkForwardBacktest } from '../math/fractionalMath';
import { History, TrendingUp, TrendingDown, CheckCircle2, XCircle, Award, Play, AlertCircle, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  instrument: Instrument;
  currentD: number;
  hurstWindow: number;
  lang: 'ar' | 'en';
}

export const WalkForwardBacktestPanel: React.FC<Props> = ({ instrument, currentD, hurstWindow, lang }) => {
  const isAr = lang === 'ar';
  const totalBars = instrument.data.length;

  // Default cutoff at 40% of historical series
  const defaultCutoff = Math.max(5, Math.floor(totalBars * 0.4));
  const [cutoffIndex, setCutoffIndex] = useState<number>(defaultCutoff);

  const backtest = useMemo(() => {
    return runWalkForwardBacktest(instrument.data, currentD, hurstWindow, cutoffIndex);
  }, [instrument.data, currentD, hurstWindow, cutoffIndex]);

  // Equity curve data for visualization
  const equityCurveData = useMemo(() => {
    let eq = 100;
    const curve = [
      {
        date: instrument.data[cutoffIndex]?.date || 'Start',
        equity: 100,
        benchmark: 100,
      },
    ];

    const basePrice = instrument.data[cutoffIndex]?.close || 1;

    backtest.trades.forEach((trade) => {
      const stepReturn = trade.isCorrect ? Math.abs(trade.actualReturnPct) : -Math.abs(trade.actualReturnPct);
      eq = Math.max(10, eq * (1 + stepReturn / 100));
      const bench = (trade.exitPrice / basePrice) * 100;
      curve.push({
        date: trade.date,
        equity: Math.round(eq * 10) / 10,
        benchmark: Math.round(bench * 10) / 10,
      });
    });

    return curve;
  }, [backtest, cutoffIndex, instrument.data]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-slate-200 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                {isAr ? 'مشروع الـ 80%: آلة الزمن للاختبار التاريخي المتدحرج (Walk-Forward)' : 'Project 80%: Walk-Forward Backtest Engine'}
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {isAr ? 'بدون تسريب مستقبلي 0%' : 'Zero Look-Ahead Bias'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'اختبار تنبؤات النموذج الرياضي من نقطة تاريخية سابقة، وقياس نسبة الدقة الفعلية ومطابقتها لـ 80%.'
                  : 'Freezes future data at cutoff date, generating sequential predictions to measure empirical hit-rate.'}
              </p>
            </div>
          </div>
        </div>

        {/* Target Edge Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-xs self-start sm:self-center">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">{isAr ? 'المعدل المستهدف:' : 'Target Edge:'}</span>
          <strong className="text-amber-300">70% - 80%</strong>
        </div>
      </div>

      {/* Interactive Time Machine Cutoff Slider */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <label htmlFor="cutoff-slider" className="text-slate-300 font-semibold flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            {isAr ? 'نقطة الانطلاق الزمنية للتجميد (Cutoff Date):' : 'Simulation Starting Cutoff Date:'}
          </label>
          <span className="text-cyan-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
            {instrument.data[cutoffIndex]?.date || 'N/A'} (شمعة رقم {cutoffIndex + 1} من {totalBars})
          </span>
        </div>

        <input
          id="cutoff-slider"
          type="range"
          min={5}
          max={totalBars - 3}
          value={cutoffIndex}
          onChange={(e) => setCutoffIndex(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>{instrument.data[5]?.date}</span>
          <span>{isAr ? 'حرك المؤشر لاختبار تنبؤات أي سنة ماضية' : 'Drag slider to freeze any historical year'}</span>
          <span>{instrument.data[totalBars - 3]?.date}</span>
        </div>
      </div>

      {/* Backtest KPI Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* KPI 1: Hit Rate */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>{isAr ? 'نسبة دقة التخمين الفعلية' : 'Empirical Hit Rate'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-2xl md:text-3xl font-bold font-mono ${
            backtest.hitRatePct >= 75 ? 'text-emerald-400' : backtest.hitRatePct >= 65 ? 'text-cyan-400' : 'text-amber-400'
          }`}>
            {backtest.hitRatePct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isAr ? `${backtest.successfulPredictions} صائبة من أصل ${backtest.totalPredictions} إشارة` : `${backtest.successfulPredictions} hits out of ${backtest.totalPredictions} signals`}
          </p>
        </div>

        {/* KPI 2: Profit Factor */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>{isAr ? 'عامل الربحية (Profit Factor)' : 'Profit Factor'}</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-indigo-300">
            {backtest.profitFactor}x
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {backtest.profitFactor >= 2.0
              ? (isAr ? 'عائد ممتاز مقارنة بالمخاطرة (> 2.0)' : 'Superb risk-adjusted ratio (> 2.0)')
              : (isAr ? 'عائد متوازن إحصائياً' : 'Balanced statistical edge')}
          </p>
        </div>

        {/* KPI 3: Model Cumulative Gain */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>{isAr ? 'العائد التراكمي للنموذج' : 'Cumulative Return'}</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
            +{backtest.cumulativeReturnPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isAr ? 'محسوب بمركب الأرباح التراكمي' : 'Compounded strategy equity'}
          </p>
        </div>

        {/* KPI 4: Max Drawdown */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>{isAr ? 'أقصى تراجع (Max Drawdown)' : 'Max Drawdown'}</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-rose-400">
            -{backtest.maxDrawdownPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isAr ? 'تحكم صارم بالمخاطر الهابطة' : 'Strict downside control'}
          </p>
        </div>
      </div>

      {/* Walk-Forward Equity Curve Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            {isAr ? 'منحنى نمو رأس المال التجريبي (Backtest Equity Curve):' : 'Strategy Equity vs Buy & Hold Benchmark:'}
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400 font-semibold">{isAr ? 'النموذج الكسري' : 'Fractional Model'}</span>
            <span className="text-slate-400">{isAr ? 'الشراء والاحتفاظ الساذج' : 'Buy & Hold'}</span>
          </div>
        </div>

        <div className="h-44 md:h-52 w-full bg-slate-950/60 rounded-lg p-2 border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurveData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const eq = payload[0]?.value;
                    const bench = payload[1]?.value;
                    return (
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200">
                        <div className="text-slate-400 font-bold mb-1">{label}</div>
                        <div className="text-emerald-400">{isAr ? 'النموذج الكسري:' : 'Model:'} {eq}</div>
                        <div className="text-slate-400">{isAr ? 'الشراء الساذج:' : 'Benchmark:'} {bench}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="equity" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="benchmark" stroke="#64748b" fill="transparent" strokeWidth={1.5} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Signals Detailed Log Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          {isAr ? 'سجل القرارات التاريخية الفردية (Historical Verification Log):' : 'Out-of-Sample Sequential Predictions:'}
        </h4>
        <div className="overflow-x-auto rounded-lg border border-slate-800 max-h-64 overflow-y-auto">
          <table className="w-full text-xs font-mono text-start">
            <thead className="bg-slate-800/80 text-slate-400 sticky top-0">
              <tr>
                <th className="p-2.5 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="p-2.5 text-start">{isAr ? 'السعر' : 'Price'}</th>
                <th className="p-2.5 text-start">{isAr ? 'التوقع' : 'Forecast'}</th>
                <th className="p-2.5 text-start">{isAr ? 'هيرست H' : 'Hurst H'}</th>
                <th className="p-2.5 text-start">{isAr ? 'النتيجة الفعلية' : 'Outcome'}</th>
                <th className="p-2.5 text-start">{isAr ? 'التفسير الرياضي' : 'Rationale'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {backtest.trades.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-2.5 text-slate-300">{t.date}</td>
                  <td className="p-2.5 text-slate-200 font-bold">{t.entryPrice.toLocaleString()} {instrument.currency}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                      t.predictedDirection === 'UP' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {t.predictedDirection === 'UP' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {t.predictedDirection === 'UP' ? (isAr ? 'صعود' : 'UP') : (isAr ? 'هبوط' : 'DOWN')}
                    </span>
                  </td>
                  <td className="p-2.5 text-amber-300">{t.hurstAtEntry.toFixed(2)}</td>
                  <td className="p-2.5">
                    {t.isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'نجاح' : 'HIT'} ({t.actualReturnPct > 0 ? `+${t.actualReturnPct}%` : `${t.actualReturnPct}%`})
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        {isAr ? 'خطأ' : 'MISS'} ({t.actualReturnPct > 0 ? `+${t.actualReturnPct}%` : `${t.actualReturnPct}%`})
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-slate-400 text-[11px] max-w-xs truncate">
                    {isAr ? t.rationaleAr : t.rationaleEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
