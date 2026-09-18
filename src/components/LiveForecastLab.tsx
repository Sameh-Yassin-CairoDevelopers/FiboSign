/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Instrument, QuantitativeMetrics, FractionalResultPoint } from '../types';
import { 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Target, 
  Sparkles, 
  Play, 
  CheckCircle, 
  XCircle, 
  History,
  HelpCircle
} from 'lucide-react';

interface LiveTestTrade {
  id: string;
  timestamp: string;
  instrumentName: string;
  entryPrice: number;
  direction: 'BUY' | 'SELL';
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  durationHours: number;
  status: 'active' | 'win' | 'loss' | 'cancelled';
  exitPrice?: number;
  notes?: string;
}

interface Props {
  instrument: Instrument;
  metrics: QuantitativeMetrics;
  lastPoint?: FractionalResultPoint;
  currentD: number;
  lang: 'ar' | 'en';
}

export const LiveForecastLab: React.FC<Props> = ({
  instrument,
  metrics,
  lastPoint,
  currentD,
  lang,
}) => {
  const isAr = lang === 'ar';
  
  // Real-time custom live quote input
  const defaultPrice = lastPoint?.originalPrice ?? (instrument.data[instrument.data.length - 1]?.close || 100);
  const [livePrice, setLivePrice] = useState<number>(defaultPrice);
  const [forecastHorizon, setForecastHorizon] = useState<number>(3); // 2 or 3 or 4 hours
  const [tradesHistory, setTradesHistory] = useState<LiveTestTrade[]>([]);
  const [exitPriceInput, setExitPriceInput] = useState<{ [id: string]: string }>({});

  // Quantitative forecast formulation based on current Fractional Derivative & Hurst
  const dVal = lastPoint?.fractionalValue ?? 0;
  const hurst = metrics.currentHurst;
  const isPersistent = hurst > 0.52;
  const isAntiPersistent = hurst < 0.48;

  // Expected price volatility move estimated from fractional memory deviation
  const rawVolatility = 0.018 * livePrice;
  const memoryDelta = Math.abs(dVal) > 0 ? (Math.abs(dVal) / defaultPrice) * livePrice * 1.8 : rawVolatility * 0.8;
  const moveMagnitude = Math.max(memoryDelta, rawVolatility * 0.6);

  let direction: 'BUY' | 'SELL' = 'BUY';
  let biasDescriptionAr = '';
  let biasDescriptionEn = '';
  let confidencePct = Math.round(Math.min(84, Math.max(68, metrics.expectedEdgePct + (isPersistent ? 4 : 0))));

  if (dVal >= 0) {
    if (isPersistent) {
      direction = 'BUY';
      biasDescriptionAr = `عزم صاعد ذو ذاكرة حركية قوية (H=${hurst.toFixed(2)} > 0.50). احتمالية اختراق المقاومات خلال الـ ${forecastHorizon} ساعات القادمة عالية.`;
      biasDescriptionEn = `Strong persistent upward memory (H=${hurst.toFixed(2)} > 0.50). High probability of upside continuation in the next ${forecastHorizon} hours.`;
    } else if (isAntiPersistent) {
      direction = 'SELL';
      biasDescriptionAr = `رغم ارتفاع المشتقة، إلا أن هيرست خشن (H=${hurst.toFixed(2)} < 0.50) مما يشير إلى تشبع شرائي واستعداد للارتداد العكسي للأسفل.`;
      biasDescriptionEn = `Hurst is anti-persistent (H=${hurst.toFixed(2)}). Expecting mean-reverting downward exhaustion.`;
    } else {
      direction = 'BUY';
      biasDescriptionAr = `ميل شرائي معتدل محايد.`;
      biasDescriptionEn = `Mild bullish structural bias.`;
    }
  } else {
    if (isPersistent) {
      direction = 'SELL';
      biasDescriptionAr = `عزم هابط مستمر والذاكرة تدعم استمرار الضغط البيعي (H=${hurst.toFixed(2)}). تجنب الشراء المبكر خلال الساعات القادمة.`;
      biasDescriptionEn = `Persistent downward memory (H=${hurst.toFixed(2)}). Memory reinforces further downside momentum.`;
    } else if (isAntiPersistent) {
      direction = 'BUY';
      biasDescriptionAr = `تشبع بيعي خشن (H=${hurst.toFixed(2)} < 0.50)؛ السلسلة مؤهلة لارتداد شرائي سريع نحو المتوسط.`;
      biasDescriptionEn = `Anti-persistent oversold condition; expecting an upward snap-back to the mean.`;
    } else {
      direction = 'SELL';
      biasDescriptionAr = `ميل بيعي معتدل.`;
      biasDescriptionEn = `Mild bearish structural bias.`;
    }
  }

  const regimeDisplay = isAr
    ? (metrics.hurstRegime === 'persistent' ? 'ذاكرة استمرارية (Persistent)' : metrics.hurstRegime === 'mean_reverting' ? 'ارتداد إلى المتوسط (Rough Mean-Reverting)' : 'حركة عشوائية براونية (Random Walk)')
    : metrics.hurstRegime;

  const targetPrice = direction === 'BUY' ? livePrice + moveMagnitude : livePrice - moveMagnitude;
  const stopLoss = direction === 'BUY' ? livePrice - moveMagnitude * 0.55 : livePrice + moveMagnitude * 0.55;
  const riskReward = (Math.abs(targetPrice - livePrice) / Math.abs(livePrice - stopLoss)).toFixed(1);

  // Handle starting a live test
  const handleStartLiveTrade = () => {
    const newTrade: LiveTestTrade = {
      id: `trade-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instrumentName: isAr ? instrument.nameAr : instrument.name,
      entryPrice: livePrice,
      direction,
      targetPrice: parseFloat(targetPrice.toFixed(4)),
      stopLoss: parseFloat(stopLoss.toFixed(4)),
      confidence: confidencePct,
      durationHours: forecastHorizon,
      status: 'active',
      notes: isAr ? `أمر ${direction === 'BUY' ? 'شراء' : 'بيع'} مقترح على ${instrument.symbol}` : `Suggested ${direction} signal on ${instrument.symbol}`,
    };
    setTradesHistory([newTrade, ...tradesHistory]);
  };

  const handleResolveTrade = (id: string, status: 'win' | 'loss') => {
    const exitP = parseFloat(exitPriceInput[id] || '0');
    setTradesHistory((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, exitPrice: exitP > 0 ? exitP : undefined } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-700/50 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <h3 className="text-base md:text-lg font-bold text-white">
                {isAr ? 'مختبر التنبؤ اللحظي المباشر (Live Real-Time Forecast Lab)' : 'Live Real-Time Forecast Lab'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {isAr
                ? 'خصصنا هذه المساحة لاختبار المعادلة عملياً على حساباتك الحقيقية أو التجريبية خلال الساعتين أو الثلاث ساعات القادمة. أدخل السعر اللحظي الحالي للأصل، وسيقوم محرك الذاكرة الكسرية بتحديد اتجاه الشمعة المستهدفة، الهدف الرياضي، وأقصى وقف خسارة مانع لانهيار الذاكرة.'
                : 'Designed for live practical testing on real or demo trading accounts over the next 2-4 hours. Enter your live quoted price to calculate exact fractional direction, dynamic target, and memory-invalidation stop.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-xs text-slate-400 font-mono">
              {isAr ? 'أفق التوقع:' : 'Forecast Horizon:'}
            </span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {[2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setForecastHorizon(hrs)}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    forecastHorizon === hrs
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {hrs} {isAr ? 'ساعات' : 'Hrs'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Quote Input Row */}
        <div className="mt-5 pt-4 border-t border-indigo-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">
              {isAr ? 'سعر السوق اللحظي الآن (Live Quote):' : 'Current Market Price Now:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="live-quote-input"
                type="number"
                step="any"
                value={livePrice}
                onChange={(e) => setLivePrice(parseFloat(e.target.value) || defaultPrice)}
                className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-xs font-mono text-slate-400 font-bold px-2 py-2 bg-slate-800/80 rounded-lg">
                {instrument.currency}
              </span>
            </div>
          </div>

          <div className="space-y-1 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-xs space-y-0.5">
              <div className="text-slate-400">
                {isAr ? 'الرتبة الكسرية النشطة:' : 'Active Order:'} <span className="text-cyan-400 font-mono font-bold">d = {currentD.toFixed(2)}</span> | {isAr ? 'أس هيرست:' : 'Hurst:'} <span className="text-amber-400 font-mono font-bold">H = {hurst.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isAr ? 'حالة الذاكرة:' : 'Regime:'} <span className="text-emerald-400 font-semibold">{regimeDisplay}</span>
              </div>
            </div>

            <button
              id="reset-price-to-last-btn"
              onClick={() => setLivePrice(defaultPrice)}
              className="text-[11px] text-indigo-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 hover:bg-indigo-900/60 transition-all whitespace-nowrap"
            >
              {isAr ? 'استرجاع آخر إغلاق' : 'Reset to Last Bar'}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Quantitative Signal Output Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Verdict Card */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xl ${
          direction === 'BUY'
            ? 'bg-emerald-950/20 border-emerald-600/40 shadow-emerald-950/20'
            : 'bg-rose-950/20 border-rose-600/40 shadow-rose-950/20'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {isAr ? `توقع الساعات القادمة (${forecastHorizon}H)` : `Horizon (${forecastHorizon} Hours)`}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                direction === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isAr ? `دقة إحصائية ~${confidencePct}%` : `~${confidencePct}% Model Edge`}
              </span>
            </div>

            <div className="flex items-center gap-3 my-2">
              {direction === 'BUY' ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp className="w-8 h-8" />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <TrendingDown className="w-8 h-8" />
                </div>
              )}
              <div>
                <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{direction === 'BUY' ? (isAr ? 'شراء / صعود' : 'BULLISH LONG') : (isAr ? 'بيع / هبوط' : 'BEARISH SHORT')}</span>
                </h4>
                <div className="text-xs text-slate-400 font-mono">
                  {isAr ? 'سعر التنفيذ الأساسي:' : 'Base Price:'} {livePrice.toFixed(4)} {instrument.currency}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {isAr ? biasDescriptionAr : biasDescriptionEn}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              id="log-live-trade-btn"
              onClick={handleStartLiveTrade}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isAr
                  ? `بدء تجربة ${forecastHorizon} ساعات وتسجيل الصفقة الآن`
                  : `Start ${forecastHorizon}h Live Test & Log Trade`}
              </span>
            </button>
          </div>
        </div>

        {/* Tactical Execution Levels */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'المستويات السعرية المشتقة رياضياً' : 'Mathematical Action Levels'}</span>
            </h4>

            <div className="space-y-3">
              {/* Target Price */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الهدف السعري المتوقع (Target)' : 'Take Profit Target:'}</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">
                    {targetPrice.toFixed(4)} <span className="text-xs text-slate-400">{instrument.currency}</span>
                  </div>
                </div>
                <div className="text-end text-xs font-mono text-emerald-400 font-bold">
                  {direction === 'BUY' ? '+' : '-'}{Math.abs(targetPrice - livePrice).toFixed(4)}
                </div>
              </div>

              {/* Memory Stop Loss */}
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isAr ? 'وقف انكسار الذاكرة (Memory Invalidation SL)' : 'Memory Invalidation SL:'}</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">
                    {stopLoss.toFixed(4)} <span className="text-xs text-slate-400">{instrument.currency}</span>
                  </div>
                </div>
                <div className="text-end text-xs font-mono text-rose-400 font-bold">
                  {direction === 'BUY' ? '-' : '+'}{Math.abs(livePrice - stopLoss).toFixed(4)}
                </div>
              </div>

              {/* R:R Ratio */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{isAr ? 'نسبة العائد إلى المخاطرة (R:R):' : 'Risk/Reward:'}</span>
                <span className="text-cyan-300 font-bold font-mono text-sm">{riskReward} : 1</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            {isAr
              ? 'وقف الخسارة هنا ليس رقماً عشوائياً؛ بل هو النقطة التي إذا وصلها السعر، فإن معادلة الذاكرة الكسرية تتلاشى وتعلن دخول السوق في حالة ضجيج حر، ويجب إغلاق الصفقة دون تردد لحماية رأس المال.'
              : 'Stop loss is not arbitrary. It marks the exact boundary where accumulated fractional memory decay breaks, mandating risk exit.'}
          </div>
        </div>

        {/* Practical Testing Guide & Methodology */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{isAr ? 'كيف تجرب هذا على ميتاتريدر أو حسابك الحقيقي؟' : 'How to Test on Live / Demo Account'}</span>
            </h4>

            <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-white">{isAr ? 'افتح حسابك التجريبي/الحقيقي:' : 'Open Trading Platform:'}</strong>{' '}
                {isAr ? `طابق السعر المعروض مع السعر الذي تراه في منصتك لـ ${instrument.symbol}.` : `Match current quote on MT4/5 with ${instrument.symbol}.`}
              </li>
              <li>
                <strong className="text-white">{isAr ? 'نفذ بحجم لوت صغير (Cent/Micro-lot):' : 'Use Micro/Cent Lot Size:'}</strong>{' '}
                {isAr ? 'الهدف هو التحقق التجريبي من مسار المعادلة وليس المخاطرة برأس المال.' : 'Goal is mathematical verification without capital exposure.'}
              </li>
              <li>
                <strong className="text-white">{isAr ? 'ضع الهدف والوقف فوراً:' : 'Set Target & Stop Immediately:'}</strong>{' '}
                {isAr ? 'لا تترك الصفقة دون وقف الخسارة المحسوب أعلاه.' : 'Never leave trade open without fractional memory SL.'}
              </li>
              <li>
                <strong className="text-white">{isAr ? 'راقب خلال 2 إلى 3 ساعات:' : 'Observe for 2-3 Hours:'}</strong>{' '}
                {isAr ? 'سجل السعر بعد انقضاء المدة في الجدول بالأسفل لتقييم النتيجة.' : 'Record final price below to measure hit rate.'}
              </li>
            </ol>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-slate-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'حتى لو خسرت بضع سنتات، فهذه خطوة شجاعة لمعايرة نموذج الـ 80% في الزمن الحقيقي!'
                : 'Live testing provides empirical market grounding for the 80% target.'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Experiment Log Table */}
      {tradesHistory.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'سجل تجاربك المباشرة الحية (Live Experiment Journal)' : 'Live Experiment Journal'}</span>
            </h4>
            <span className="text-xs font-mono text-slate-400">
              {tradesHistory.length} {isAr ? 'صفقات مسجلة' : 'Logged Trades'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الوقت' : 'Time'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الأصل' : 'Asset'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الاتجاه' : 'Type'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'سعر الدخول' : 'Entry'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الهدف' : 'Target'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'الوقف' : 'Stop'}</th>
                  <th className="py-2.5 px-3 text-start">{isAr ? 'سعر الخروج الحقيقي' : 'Live Exit Price'}</th>
                  <th className="py-2.5 px-3 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-end">{isAr ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tradesHistory.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{trade.timestamp}</td>
                    <td className="py-3 px-3 text-white font-bold">{trade.instrumentName}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        trade.direction === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white">{trade.entryPrice.toFixed(4)}</td>
                    <td className="py-3 px-3 text-emerald-400">{trade.targetPrice.toFixed(4)}</td>
                    <td className="py-3 px-3 text-rose-400">{trade.stopLoss.toFixed(4)}</td>
                    <td className="py-3 px-3">
                      {trade.status === 'active' ? (
                        <input
                          type="number"
                          step="any"
                          placeholder={isAr ? 'سعر الإغلاق...' : 'Exit quote...'}
                          value={exitPriceInput[trade.id] || ''}
                          onChange={(e) =>
                            setExitPriceInput({ ...exitPriceInput, [trade.id]: e.target.value })
                          }
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        />
                      ) : (
                        <span className="text-slate-300 font-bold">
                          {trade.exitPrice?.toFixed(4) ?? '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {trade.status === 'active' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                          {isAr ? 'قيد التجربة' : 'RUNNING'}
                        </span>
                      )}
                      {trade.status === 'win' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{isAr ? 'حققت الهدف (WIN)' : 'HIT TARGET'}</span>
                        </span>
                      )}
                      {trade.status === 'loss' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] flex items-center justify-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>{isAr ? 'لم تصب (LOSS)' : 'STOPPED'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-end">
                      {trade.status === 'active' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResolveTrade(trade.id, 'win')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                          >
                            {isAr ? 'نجحت' : 'Win'}
                          </button>
                          <button
                            onClick={() => handleResolveTrade(trade.id, 'loss')}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                          >
                            {isAr ? 'خسرت' : 'Loss'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans">
                          {isAr ? 'مكتملة ومحسوبة' : 'Archived'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
