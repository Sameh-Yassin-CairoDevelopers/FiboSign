import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, CheckCircle2, HelpCircle, FileSpreadsheet, Layers, Cpu, Flame } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const DataRequirementsModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const isAr = lang === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 text-slate-100 rounded-xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <button
              id="close-data-requirements-modal"
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {isAr ? 'دليل البيانات المطلوبة لبناء محرك الـ 80% الرياضي' : 'Data Architecture Guide for Project 80%'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr ? 'ما هي الحقول والمتغيرات الضرورية لتحليل أي أصل (سهم مصري، عالمي، ذهب، فضة، NFT)؟' : 'Essential variables required for universal fractional market memory modeling'}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xs md:text-sm text-slate-300 leading-relaxed">
              {/* Introduction */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p>
                  {isAr ? (
                    <>
                      أهلاً بك يا باشمهندس؛ الميزة الرياضية العظمى للحساب التفاضلي الكسري وأس هيرست هي <strong>عدم الاعتماد على هوية الأصل (Asset Agnostic)</strong>. المعادلة لا تهتم إن كان السهم في البورصة المصرية، أو فرانكفورت، أو معدن الفضة، أو سعر قاع عملة رقمية أو كرت NFT. كل ما يهم المعادلة هو <strong>السلسلة الزمنية للمسار الحركي</strong>.
                    </>
                  ) : (
                    <>
                      The mathematical power of fractional calculus lies in being completely <strong>Asset Agnostic</strong>. The equations operate purely on the phase space of historical price trajectories.
                    </>
                  )}
                </p>
              </div>

              {/* Data Hierarchy Grid */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  {isAr ? '1. البيانات الأساسية الإلزامية (Level 1: Minimum Viable Data)' : '1. Mandatory Baseline Data (Level 1)'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <strong className="text-cyan-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {isAr ? 'سعر الإغلاق (Close Price)' : 'Close Price (P_t)'}
                    </strong>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'الركيزة المطلقة لحساب مصفوفة الأوزان المتلاعبة بالذاكرة D^d P(t). يفضل استخدام السعر المعدل للتوزيعات وزيادات رأس المال (Adjusted Close).' : 'Primary series for binomial memory convolution D^d P_t. Use split-adjusted prices.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <strong className="text-cyan-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {isAr ? 'التاريخ والوقت (Date / Timestamp)' : 'Timestamp (t)'}
                    </strong>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'يجب أن تكون الفترات متساوية (يومي Daily، أو أسبوعي Weekly، أو 4 ساعات). الحساب الكسري يعتمد على تباعد زمني منتظم Δt.' : 'Equally spaced sampling intervals (Daily, Weekly, or Hourly) ensure robust lag convolution.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Variables */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  {isAr ? '2. البيانات المتقدمة لرفع الدقة نحو 80% (Level 2: Edge Boosters)' : '2. Advanced Variables to Reach 80% Hit Rate (Level 2)'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <strong className="text-indigo-300 block">{isAr ? 'المدى (High / Low)' : 'High & Low (Range)'}</strong>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'يستخدم لحساب أس هيرست الحركي بدقة Rescaled Range (R/S) ونمذجة التقلب الخشن (Rough Volatility).' : 'Critical for exact Hurst Rescaled Range calculation and rough volatility modeling.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <strong className="text-indigo-300 block">{isAr ? 'حجم التداول (Volume)' : 'Volume'}</strong>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'يسمح بتطبيق "الذاكرة الموزونة بالحجم" (Volume-Weighted Fractional Diff) لاستبعاد التحركات الوهمية منخفضة السيولة.' : 'Enables Volume-Weighted Fractional bars, eliminating low-volume false breakouts.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <strong className="text-indigo-300 block">{isAr ? 'سعر الافتتاح (Open)' : 'Open Price'}</strong>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'لرصد الفجوات السعرية (Overnight Gaps) الناتجة عن الصدمات الخبرية المغلقة.' : 'Captures overnight gaps caused by exogenous monetary or geopolitical news.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Cases: OTC and NFTs */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Flame className="w-4 h-4" />
                  <span>{isAr ? 'حالة خاصة: أسهم خارج المقصورة (OTC كالمهن الطبية) وأسواق الـ NFT' : 'Special Application: OTC Equities & NFT Marketplaces'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {isAr ? (
                    <>
                      في أسهم خارج المقصورة والـ NFT، التنفيذات ليست مستمرة لحظة بلحظة. الحل الرياضي الذي نطبقه هو <strong>استخدام بارات الصفقات الفعلية (Transaction / Volume Bars)</strong> بدلاً من البارات الزمنية، مما يجعل المشتقة الكسرية تحتفظ بذكريات الصفقات الكبرى وتكشف عن القيمة العادلة الخفية وأسعار القاع المستقرة.
                    </>
                  ) : (
                    <>
                      For thin OTC stocks and NFT collections, we recommend Volume-based sampling rather than calendar time, preserving memory across liquidity voids.
                    </>
                  )}
                </p>
              </div>

              {/* Sample CSV Format snippet */}
              <div className="space-y-1 font-mono text-xs">
                <span className="text-slate-400 block">{isAr ? 'الشكل المثالي لملف الـ CSV للاستيراد السريع:' : 'Ideal CSV Schema for Universal Import:'}</span>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 overflow-x-auto">
{`Date,Open,High,Low,Close,Volume
2024-01-02,23.8,24.1,23.6,23.75,1450000
2024-01-08,23.2,23.4,22.8,22.95,1820000
2024-01-15,22.9,23.15,22.5,22.65,1200000`}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
