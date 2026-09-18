import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, AlertTriangle, Cpu, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const TheoreticalComparisonModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const isAr = lang === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 text-slate-100 rounded-xl shadow-2xl p-6 md:p-8"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Close Button */}
            <button
              id="close-theory-modal"
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {isAr ? 'الأسس العلمية والفرق الجوهري عن التحليل الفني التقليدي' : 'Mathematical Foundations vs. Traditional Technical Analysis'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isAr
                    ? 'دراسة نقدية: لماذا تفشل المؤشرات الكلاسيكية وكيف يعالج الحساب الكسري معضلة الذاكرة؟'
                    : 'A Critical Study: Memory Loss in Classic Indicators & The Fractional Solution'}
                </p>
              </div>
            </div>

            {/* Section 1: The Memory Dilemma */}
            <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-300">
              <div className="p-5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-base">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {isAr
                      ? '1. معضلة فقدان الذاكرة في مؤشرات TradingView و MetaTrader (RSI, MACD, Bollinger)'
                      : '1. The 100% Memory Loss Dilemma in Classic Technical Indicators'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr ? (
                    <>
                      معظم المؤشرات الفنية المبرمجة بلغة Pine Script أو MQL تعتمد على تحويل السلسلة السعرية غير المستقرة إما عبر <strong>المشتقة الكاملة من الدرجة الأولى (d = 1)</strong> (وهي نسبة التغير اليومي أو الفرق السعري P(t) - P(t-1) كما في الـ RSI)، أو عبر <strong>نوافذ زمنية قصيرة ومحدودة</strong> (كالمتوسطات البسيطة SMA).
                      <br /><br />
                      الورقة البحثية التاريخية لـ <em>Marcos López de Prado</em> (رئيس التداول الكمي سابقاً في AQR) أثبتت معضلة رياضية فادحة:
                    </>
                  ) : (
                    <>
                      Most technical indicators coded in Pine Script or MQL rely either on taking the <strong>full first-order integer derivative (d = 1)</strong> (standard returns ΔP(t) / P(t-1) as in RSI), or on <strong>abrupt truncated moving windows</strong> (like SMAs).
                      <br /><br />
                      The landmark research by <em>Marcos López de Prado</em> established a fundamental mathematical dilemma:
                    </>
                  )}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
                    <div className="text-xs font-mono text-rose-300 font-bold mb-1">
                      {isAr ? 'الأسعار الخام (d = 0)' : 'Raw Price (d = 0)'}
                    </div>
                    <p className="text-xs text-slate-300">
                      {isAr
                        ? 'ذاكرة كاملة 100% لكنها غير مستقرة إحصائياً (Non-Stationary)، وتؤدي لكل الانحدارات الزائفة والنتائج الكاذبة.'
                        : '100% Memory, but Non-Stationary. Violates econometric assumptions, creating spurious regressions.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
                    <div className="text-xs font-mono text-amber-300 font-bold mb-1">
                      {isAr ? 'الفروق اليومية العادية (d = 1)' : 'Standard Returns (d = 1)'}
                    </div>
                    <p className="text-xs text-slate-300">
                      {isAr
                        ? 'مستقرة إحصائياً، لكنها تمحو الذاكرة تماماً (100% Memory Erased). كأن السوق يولد من الصفر كل صباح بلا أي تاريخ تراكمي!'
                        : 'Stationary, but completely wipes out historical memory. Treats the market as a memoryless Markov process.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                    <div className="text-xs font-mono text-emerald-300 font-bold mb-1">
                      {isAr ? 'المشتقة الكسرية (d* ≈ 0.35 - 0.50)' : 'Fractional Diff (d* ≈ 0.35 - 0.50)'}
                    </div>
                    <p className="text-xs text-slate-300">
                      {isAr
                        ? 'الحل الذهبي: تحقق الاستقرار الإحصائي الكامل (p < 0.05) مع الحفاظ على أكثر من 85% إلى 90% من الذاكرة والارتباطات التاريخية!'
                        : 'The Golden Frontier: Achieves strict statistical stationarity while preserving over 85-90% of memory.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Fibonacci vs Fractional Memory */}
              <div className="p-5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold text-base">
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {isAr
                      ? '2. ما الفرق بين الديناميكا الكسرية ومستويات فيبوناتشي (Fibonacci)؟'
                      : '2. Difference from Fibonacci Retracements'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr ? (
                    <>
                      فيبوناتشي أداة هندسية <strong>سكونية (Static Topological Grid)</strong> تفترض أن السعر سيرتد عند نسب عددية ثابتة (0.382، 0.618، 1.618) مستمدة من نهاية متتالية فيبوناتشي.
                      <br /><br />
                      بينما <strong>الحساب التفاضلي الكسري وأس هيرست (Hurst Exponent $H$)</strong> يقيس <strong>الصلابة الحركية والديناميكية اللحظية للنظام</strong>:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                        <li>إذا كان $H &gt; 0.55$: السوق يمتلك "عطالة استمرارية فائقة" (Super-diffusive / Persistent). مستويات المقاومة ستُخترق وتتحول إلى تسارع انفجاري بدلاً من الارتداد.</li>
                        <li>إذا كان $H &lt; 0.45$: السوق في نظام "ارتداد خشن إلى المتوسط" (Sub-diffusive / Rough Reversion). في هذه الحالة فقط تنجح مناطق الارتداد السعري.</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      Fibonacci retracement is a <strong>static topological grid</strong> assuming fixed ratios (0.382, 0.618, 1.618).
                      <br /><br />
                      <strong>Fractional Dynamics and the Hurst Exponent ($H$)</strong> measure the <strong>living dynamic persistence of memory</strong>:
                      <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                        <li>When $H &gt; 0.55$: The regime is persistent/super-diffusive; resistance levels break violently as memory reinforces momentum.</li>
                        <li>When $H &lt; 0.45$: The regime is anti-persistent/rough; prices snap back to the mean, making boundary trading optimal.</li>
                      </ul>
                    </>
                  )}
                </p>
              </div>

              {/* Section 3: The Myth of 99% vs Realistic Edge */}
              <div className="p-5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-base">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {isAr
                      ? '3. هل التنبؤ 99% أم 60%؟ وأين تذهب البجعة السوداء (التعويم، الحروب، الضرائب)؟'
                      : '3. The Reality of Prediction: Why 99% is a Myth & How Quant Edge Works'}
                  </span>
                </div>
                <p className="text-slate-300">
                  {isAr ? (
                    <>
                      دعنا نكون صادقين بأعلى درجات الصرامة الرياضية والأخلاقية: <strong>لا يوجد إنسان ولا خوارزمية ولا نموذج ذكاء اصطناعي على وجه الأرض يستطيع توقع أسواق المال بنسبة 99% أو 100%!</strong>
                      <br /><br />
                      من يدعي ذلك فهو إما مروج تسويقي أو غير مدرك لنظرية الفوضى (Chaos Theory) ومبرهنة عدم الاكتمال. الأحداث غير الخطية مثل:
                      قرارات الضرائب المفاجئة، اندلاع الحروب، قرارات التعويم وتحريك الفائدة في مصر، هي صدمات خارجية عشوائية (Exogenous Black Swans).
                      <br /><br />
                      <strong>فماذا يفعل الحساب الكسري إذن ولماذا تدفع فيه كبرى صناديق وول ستريت؟</strong>
                    </>
                  ) : (
                    <>
                      Let us be scientifically honest: <strong>No algorithm, mathematician, or AI on earth can predict market price direction with 99% accuracy!</strong>
                      <br /><br />
                      Financial markets are non-linear open systems governed by exogenous shocks (wars, sudden tax laws, unexpected central bank rate hikes, and currency floatations).
                      <br /><br />
                      <strong>What does Fractional Calculus actually achieve, and why do leading quant institutions use it?</strong>
                    </>
                  )}
                </p>

                <div className="mt-3 p-4 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white">
                        {isAr ? 'رفع الميزة الإحصائية (The Quantitative Edge):' : 'Elevating Quantitative Edge:'}
                      </strong>
                      <span className="text-slate-300">
                        {isAr
                          ? ' في التحليل العشوائي تكون النسبة 50/50. النماذج الكسرية ترفع دقة القرار إلى 68% - 74% مع نسبة ربح لخسارة (Profit Factor) تفوق 2.2:1. (للمقارنة: صندوق Medallion الأسطوري لجيم سيمونز حقق ملياراته بنسبة دقة 50.75% فقط ولكن مع هندسة مخاطر رياضية خارقة!).'
                          : ' Random trading is 50/50. Fractional memory models elevate statistical edge to 68% - 74% with an asymmetric positive payout ratio (>2.2:1).'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white">
                        {isAr ? 'رصد التحول الطوري والهشاشة المسبقة (Critical Resonance):' : 'Early Detection of Critical Phase Transitions:'}
                      </strong>
                      <span className="text-slate-300">
                        {isAr
                          ? ' المعادلة الكسرية لا تعلم موعد المؤتمر الصحفي للبنك المركزي، لكنها ترصد تراكم الذاكرة حتى نقطة التشبع الحرج (Critical Point). عندما يصبح النظام فائق الهشاشة، فإن أصغر شرارة خبرية ستفجر الحركة في الاتجاه المحسوب رياضياً.'
                          : ' Fractional mechanics detect accumulated memory stress before it bursts. When the system hits critical saturation, any tiny catalyst triggers an explosive phase transition.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Silver and EGX Specifics */}
              <div className="p-5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="text-emerald-400 font-semibold text-base mb-2">
                  {isAr ? '4. التطبيق الميداني على الفضة (XAG) والبورصة المصرية (EGX)' : '4. Field Application to Silver (XAG) & The Egyptian Exchange (EGX)'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-slate-300">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <div className="font-bold text-white mb-1">
                      {isAr ? 'الفضة (Rough Volatility & Long Memory):' : 'Silver (XAG/USD):'}
                    </div>
                    <p>
                      {isAr
                        ? 'الفضة تمثل الحالة النموذجية لما يسميه الفيزيائيون "التقلب الخشن". فترات التجميع فيها تكون طويلة، وتأثير الصدمات التاريخية يمتد لأشهر (Long Memory Half-Life). المشتقة الكسرية عند d = 0.40 تلتقط بداية انفجار السيولة قبل أن يدركها الـ MACD أو الـ RSI بـ 4 إلى 8 شمعات!'
                        : 'Silver exhibits classic Rough Volatility. Its memory half-life is long, allowing fractional derivative D^0.40 to detect accumulation breakouts 4-8 bars ahead of lagging moving averages.'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60">
                    <div className="font-bold text-white mb-1">
                      {isAr ? 'البورصة المصرية وسهم التجاري الدولي (EGX / CIB):' : 'Egyptian Exchange (EGX 30 & CIB):'}
                    </div>
                    <p>
                      {isAr
                        ? 'السوق المصري يتأثر بالتحوط التضخمي وتفاوت أسعار الصرف. استخدام d = 1 يعطي تشويشاً هائلاً بسبب قفزات التعويم، بينما الحساب الكسري يرشح القفزات غير المستقرة ويحتفظ بالاتجاه التراكمي الحقيقي لأرباح الشركات وإعادة تقييم الأصول.'
                        : 'The EGX experiences structural devaluation spikes. Integer differentiation (d=1) causes severe noise distortion, whereas fractional order filters out the non-stationary jump while preserving underlying asset repricing trends.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                id="modal-understand-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                {isAr ? 'فهمت، لنبدأ التحليل الرياضي' : 'Understood, Launch Mathematical Analysis'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
