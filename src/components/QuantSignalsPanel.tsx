import React from 'react';
import { QuantitativeMetrics, FractionalResultPoint } from '../types';
import { Shield, Zap, AlertTriangle, TrendingUp, TrendingDown, Minus, Target, Award, Compass } from 'lucide-react';

interface Props {
  metrics: QuantitativeMetrics;
  lastPoint?: FractionalResultPoint;
  currency: string;
  lang: 'ar' | 'en';
}

export const QuantSignalsPanel: React.FC<Props> = ({ metrics, lastPoint, currency, lang }) => {
  const isAr = lang === 'ar';

  const signal = lastPoint?.signal || 'NEUTRAL';
  const signalReason = lastPoint?.signalReason || (isAr ? 'حالة توازن ضمن المسار الطبيعي' : 'Dynamic equilibrium within trend');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-slate-200 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white text-base md:text-lg">
            {isAr ? 'المصفوفة الكمية وإشارات النظام اللحظية' : 'Quantitative Metrics & Systematic Signal'}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {isAr ? 'تحديث لحظي حسب الذاكرة' : 'Memory-Calibrated'}
        </span>
      </div>

      {/* Primary Action Signal Card */}
      <div
        className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          signal === 'BUY'
            ? 'bg-emerald-950/30 border-emerald-800/60'
            : signal === 'SELL'
            ? 'bg-rose-950/30 border-rose-800/60'
            : 'bg-slate-800/40 border-slate-700/60'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              signal === 'BUY'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : signal === 'SELL'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/40'
            }`}
          >
            {signal === 'BUY' ? (
              <TrendingUp className="w-6 h-6" />
            ) : signal === 'SELL' ? (
              <TrendingDown className="w-6 h-6" />
            ) : (
              <Minus className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {isAr ? 'الإشارة الرياضية الكمية:' : 'Systematic Quantitative Signal:'}
              </span>
              <span
                className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                  signal === 'BUY'
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : signal === 'SELL'
                    ? 'bg-rose-900/60 text-rose-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {signal === 'BUY' ? (isAr ? 'شراء وتمركز' : 'LONG / BUY') : signal === 'SELL' ? (isAr ? 'تخارج / جني أرباح' : 'SHORT / EXIT') : (isAr ? 'حياد وانتظار' : 'NEUTRAL / HOLD')}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              {signalReason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono self-end md:self-center">
          <div className="text-end">
            <span className="text-slate-400 block">{isAr ? 'الميزة الإحصائية المتوقعة:' : 'Statistical Edge:'}</span>
            <span className="text-base font-bold text-cyan-400">+{metrics.expectedEdgePct}%</span>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Pillars Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Memory Retention */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'نسبة حفظ الذاكرة' : 'Memory Retention'}</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.memoryRetentionPct}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.memoryRetentionPct > 80
              ? (isAr ? 'احتفاظ شبه كامل بتاريخ الأسعار' : 'Near total memory preservation')
              : metrics.memoryRetentionPct > 40
              ? (isAr ? 'احتفاظ معتدل بالمسار' : 'Moderate path preservation')
              : (isAr ? 'فقدان حاد للذاكرة التاريخية' : 'Severe historical memory loss')}
          </p>
        </div>

        {/* Metric 2: ADF Stationarity */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'اختبار الاستقرار (ADF)' : 'Stationarity Test'}</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
            <span className={metrics.isStationary ? 'text-emerald-400' : 'text-rose-400'}>
              {metrics.isStationary ? (isAr ? 'مستقر' : 'Passed') : (isAr ? 'غير مستقر' : 'Failed')}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            p-value = {metrics.stationarityPValue.toFixed(3)} {metrics.isStationary ? '(p < 0.05)' : '(p ≥ 0.05)'}
          </p>
        </div>

        {/* Metric 3: Hurst Dynamic Exponent */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'أس هيرست الحركي H' : 'Hurst Exponent'}</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {metrics.currentHurst.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.hurstRegime === 'persistent'
              ? (isAr ? 'حالة اتجاهية مستمرة (تغذية راجعة)' : 'Persistent feedback momentum')
              : metrics.hurstRegime === 'mean_reverting'
              ? (isAr ? 'حالة ارتداد خشن للمتوسط' : 'Rough mean-reverting chop')
              : (isAr ? 'حركة عشوائية حرة' : 'Brownian random walk')}
          </p>
        </div>

        {/* Metric 4: Critical Resonance Risk */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{isAr ? 'هشاشة النظام (رنين الذاكرة)' : 'Critical Resonance'}</span>
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {metrics.criticalResonanceRisk}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.criticalResonanceRisk > 60
              ? (isAr ? 'احتمال انفجار سعري أو تحول طوري وشيك' : 'High phase-transition risk')
              : (isAr ? 'استقرار هيكلي معتدل' : 'Moderate structural stability')}
          </p>
        </div>
      </div>

      {/* Broker Strategy Guidance Note */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300 flex items-start gap-3">
        <Award className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <strong className="text-white">
            {isAr ? 'توصية التنفيذ الهندسي للمتداول المؤسسي:' : 'Institutional Quantitative Execution Rule:'}
          </strong>
          <p>
            {isAr ? (
              <>
                عندما يكون أس هيرست <strong>H &gt; 0.55</strong> مع رتبة كسرية <strong>d ≈ {metrics.optimalD}</strong>، فإن أي تصحيح سعري ليس انعكاساً بل فرصة تراكمية، ويجب حظر التداول العكسي نهائياً. أما في حالة <strong>H &lt; 0.45</strong> (كما يحدث في بعض دورات الفضة العنيفة)، فإن استخدام التداول الخطي يعد خطأً فادحاً ويجب تفعيل استراتيجيات الارتداد للحدود المحسوبة.
              </>
            ) : (
              <>
                When <strong>H &gt; 0.55</strong> at <strong>d ≈ {metrics.optimalD}</strong>, price pullbacks represent cumulative memory loading rather than reversals. Counter-trend shorting is mathematically discouraged. When <strong>H &lt; 0.45</strong>, switch entirely to mean-reverting boundary scalping.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
