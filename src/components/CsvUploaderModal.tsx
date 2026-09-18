import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { MarketBar, Instrument } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCustomDatasetLoaded: (customInstrument: Instrument) => void;
  lang: 'ar' | 'en';
}

export const CsvUploaderModal: React.FC<Props> = ({ isOpen, onClose, onCustomDatasetLoaded, lang }) => {
  const isAr = lang === 'ar';
  const [inputText, setInputText] = useState('');
  const [assetName, setAssetName] = useState('Custom Asset');
  const [currency, setCurrency] = useState('EGP');
  const [error, setError] = useState<string | null>(null);

  const sampleCsv = `Date,Close
2024-01-01,100.5
2024-01-08,102.3
2024-01-15,101.8
2024-01-22,105.4
2024-01-29,109.1
2024-02-05,108.3
2024-02-12,112.5
2024-02-19,118.0
2024-02-26,115.4
2024-03-05,122.8
2024-03-12,126.5
2024-03-19,124.0
2024-03-26,131.2
2024-04-02,135.0
2024-04-09,139.8`;

  const handleParseAndLoad = () => {
    try {
      setError(null);
      const text = inputText.trim() || sampleCsv;
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      if (lines.length < 5) {
        throw new Error(isAr ? 'البيانات قليلة جداً؛ يجب إدخال 5 صفوف على الأقل.' : 'Too few data points. Provide at least 5 rows.');
      }

      const bars: MarketBar[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (i === 0 && (line.toLowerCase().includes('date') || line.toLowerCase().includes('close') || line.toLowerCase().includes('price') || line.toLowerCase().includes('سعر'))) {
          continue; // Skip header
        }

        const parts = line.split(/[,\t;\s]+/).map((p) => p.trim()).filter((p) => p.length > 0);
        if (parts.length >= 2) {
          // Date, Close (or more columns)
          const date = parts[0];
          const close = parseFloat(parts[1]);
          if (!isNaN(close)) {
            bars.push({
              date,
              open: close,
              high: close,
              low: close,
              close,
            });
          }
        } else if (parts.length === 1) {
          // Single-column raw price input!
          const close = parseFloat(parts[0]);
          if (!isNaN(close)) {
            const simulatedDate = new Date(Date.now() - (lines.length - i) * 86400000).toISOString().split('T')[0];
            bars.push({
              date: simulatedDate,
              open: close,
              high: close,
              low: close,
              close,
            });
          }
        }
      }

      if (bars.length < 5) {
        throw new Error(isAr ? 'تعذر استخراج أسعار صالحة من النص. يمكنك لصق عمود أرقام أسعار فقط، أو صيغة: Date,Close' : 'Could not parse valid prices. Paste either single-column prices or Date,Close.');
      }

      const customInst: Instrument = {
        id: `custom-${Date.now()}`,
        name: assetName || 'Custom Asset',
        nameAr: assetName || 'أصل مالي مخصص',
        symbol: assetName.slice(0, 5).toUpperCase(),
        category: 'egx',
        currency: currency || 'EGP',
        description: `Custom imported dataset with ${bars.length} bars.`,
        descriptionAr: `بيانات مدخلة مخصصة تتضمن ${bars.length} شمعة.`,
        historicalContext: 'User-provided historical time series for fractional analysis.',
        historicalContextAr: 'سلسلة تاريخية مقدمة من المستخدم لتطبيق الحساب الكسري وهيرست.',
        data: bars,
      };

      onCustomDatasetLoaded(customInst);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error parsing CSV');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 text-slate-100 rounded-xl shadow-2xl p-6"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <button
              id="close-upload-modal"
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isAr ? 'استيراد بيانات سعرية مخصصة (CSV / Text)' : 'Import Custom Market Data (CSV)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'أدخل أي سلسلة تاريخية من البورصة أو ميتاتريدر لحساب الذاكرة فوراً' : 'Paste prices from EGX, MetaTrader, or TradingView'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {isAr ? 'اسم السهم / الأصل:' : 'Asset / Symbol Name:'}
                  </label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="e.g., TMGH.CA or Silver Futures"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {isAr ? 'العملة:' : 'Currency:'}
                  </label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="EGP / USD"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                  <label className="text-xs text-slate-400">
                    {isAr ? 'ألصق بيانات الأسعار (عمود أرقام فردي أو Date,Close):' : 'Paste prices (single column or Date,Close):'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAssetName('TMGH.CA');
                        setCurrency('EGP');
                        setInputText(`68.5\n69.2\n71.0\n70.4\n73.8\n76.5\n75.0\n78.2\n82.0\n80.5\n84.1\n88.0\n86.5\n91.0\n94.2`);
                      }}
                      className="text-[11px] text-indigo-300 hover:text-white underline"
                    >
                      {isAr ? 'مثال: عمود أسعار سهم مصري' : 'Sample: EGX Stock Column'}
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setInputText(sampleCsv)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {isAr ? 'نموذج كامل (Date,Close)' : 'Full (Date,Close)'}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isAr ? "الصق هنا عمود الأسعار مباشرة من ميتاتريدر أو إكسيل:\n54.2\n55.0\n54.8\n56.1\n..." : sampleCsv}
                  className="w-full bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  id="submit-csv-btn"
                  onClick={handleParseAndLoad}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-lg shadow-cyan-600/20"
                >
                  {isAr ? 'تطبيق الحساب الكسري' : 'Run Fractional Engine'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
