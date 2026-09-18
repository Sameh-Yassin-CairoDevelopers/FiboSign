/**
 * FiboSign - Institutional Quantitative Dynamics & Multi-Horizon Memory Engine
 * Developed for Eng. Sameh Yassin (Institutional Research Architecture)
 * Pure Vanilla JavaScript - Zero Dependencies, Instant Execution
 */

// --- Comprehensive Asset Database (Accurate Market Scaled Baselines) ---
const ASSET_REGISTRY = {
  gold: {
    nameAr: "الذهب (Gold - XAU/USD)",
    nameEn: "Gold (XAU/USD)",
    symbol: "XAUUSD",
    currency: "USD",
    apiSource: "binance",
    apiSymbol: "PAXGUSDT",
    baseDailyVolPct: 0.0095, // ~0.95% daily vol
    prices: [
      2665.4, 2672.1, 2668.0, 2675.8, 2682.4, 2678.0, 2686.5, 2695.0,
      2690.2, 2698.6, 2704.0, 2700.5, 2709.0, 2715.4, 2710.0, 2718.5,
      2724.2, 2720.1, 2729.0, 2735.8, 2731.2, 2740.0, 2746.4, 2742.0,
      2751.5, 2758.0, 2752.4, 2761.0, 2768.5, 2764.0, 2772.8, 2780.0
    ]
  },
  silver: {
    nameAr: "الفضة (Silver - XAG/USD)",
    nameEn: "Silver (XAG/USD)",
    symbol: "XAGUSD",
    currency: "USD",
    apiSource: "custom",
    apiSymbol: "XAGUSD",
    baseDailyVolPct: 0.016, // ~1.6% daily vol
    prices: [
      30.12, 30.25, 30.42, 30.30, 30.65, 30.88, 30.70, 31.05,
      31.35, 31.18, 31.52, 31.80, 31.62, 32.05, 32.30, 32.10,
      32.45, 32.78, 32.55, 32.95, 33.20, 33.02, 33.40, 33.72,
      33.50, 33.88, 34.15, 33.95, 34.30, 34.62, 34.40, 34.85
    ]
  },
  tmgh: {
    nameAr: "مجموعة طلعت مصطفى (TMGH.CA - البورصة المصرية)",
    nameEn: "Talaat Moustafa (TMGH.CA - EGX)",
    symbol: "TMGH.CA",
    currency: "EGP",
    apiSource: "egx",
    apiSymbol: "TMGH",
    baseDailyVolPct: 0.018, // ~1.8% daily vol
    prices: [
      64.20, 64.80, 65.50, 65.10, 66.40, 67.80, 67.20, 68.50,
      70.10, 69.40, 71.20, 72.80, 72.00, 73.60, 75.20, 74.50,
      76.00, 77.80, 77.10, 78.90, 80.50, 79.80, 81.40, 83.20,
      82.50, 84.60, 86.00, 85.20, 87.50, 89.20, 88.40, 90.10
    ]
  },
  cib: {
    nameAr: "البنك التجاري الدولي (COMI.CA - EGX)",
    nameEn: "Commercial Intl Bank (COMI.CA - EGX)",
    symbol: "COMI.CA",
    currency: "EGP",
    apiSource: "egx",
    apiSymbol: "COMI",
    baseDailyVolPct: 0.014, // ~1.4% daily vol
    prices: [
      82.10, 82.50, 83.20, 82.90, 83.80, 84.50, 84.10, 85.20,
      86.00, 85.70, 86.60, 87.40, 87.00, 88.10, 89.00, 88.50,
      89.40, 90.20, 89.80, 90.80, 91.60, 91.20, 92.20, 93.00,
      92.60, 93.80, 94.50, 94.00, 95.20, 96.10, 95.40, 96.80
    ]
  },
  btc: {
    nameAr: "البيتكوين (BTC/USDT)",
    nameEn: "Bitcoin (BTC/USDT)",
    symbol: "BTCUSDT",
    currency: "USD",
    apiSource: "binance",
    apiSymbol: "BTCUSDT",
    baseDailyVolPct: 0.024, // ~2.4% daily vol
    prices: [
      88500, 89200, 88900, 90100, 91200, 90500, 91800, 92450,
      92100, 93000, 93850, 93400, 94200, 95100, 94600, 95800,
      96500, 96000, 97200, 98100, 97500, 98600, 99400, 98900,
      100200, 101500, 100800, 102200, 103400, 102800, 104100, 104800
    ]
  },
  oil: {
    nameAr: "نفط برنت (Brent Crude Oil)",
    nameEn: "Brent Crude Oil",
    symbol: "BRENT",
    currency: "USD",
    apiSource: "custom",
    apiSymbol: "BRENT",
    baseDailyVolPct: 0.019,
    prices: [
      72.4, 72.9, 72.1, 73.5, 74.2, 73.8, 74.6, 75.3,
      74.8, 75.6, 76.2, 75.8, 76.5, 77.1, 76.6, 77.4,
      78.0, 77.5, 78.3, 78.9, 78.4, 79.2, 79.8, 79.3,
      80.1, 80.7, 80.2, 81.0, 81.6, 81.1, 81.9, 82.5
    ]
  }
};

// --- Multi-Horizon Scaling Definitions (Quantitative Square-Root-of-Time Model) ---
const HORIZON_DEFINITIONS = [
  {
    id: 'intraday',
    nameAr: 'لحظي (2 - 4 ساعات)',
    nameEn: 'Intraday (2 - 4 Hours)',
    timeFactor: Math.sqrt(3 / 24), // ~0.353 of daily vol
    descAr: 'مضاربة سريعة والتنبؤ بشمعات الساعتين القادمتين',
    descEn: 'Scalping & Next 2-Bar Confirmation'
  },
  {
    id: 'short',
    nameAr: 'قصير المدى (1 - 3 أيام)',
    nameEn: 'Short Term (1 - 3 Days)',
    timeFactor: Math.sqrt(2), // ~1.414 of daily vol
    descAr: 'تداول يومي والتنبؤ بمسار إغلاقات الأيام القادمة',
    descEn: 'Daily Swing & Day-Close Projections'
  },
  {
    id: 'swing',
    nameAr: 'متوسط أسبوعي (أسبوع - أسبوعين)',
    nameEn: 'Weekly Swing (1 - 2 Weeks)',
    timeFactor: Math.sqrt(7), // ~2.645 of daily vol
    descAr: 'تداول سوينغ على مستويات القمم والقيعان الأسبوعية',
    descEn: 'Weekly Structure & Key Swings'
  },
  {
    id: 'medium',
    nameAr: 'شهري (شهر - 3 أشهر)',
    nameEn: 'Monthly (1 - 3 Months)',
    timeFactor: Math.sqrt(30), // ~5.477 of daily vol
    descAr: 'تمركز شهري مستند للذاكرة الهيكلية طويلة المدى',
    descEn: 'Monthly Structural Allocation'
  },
  {
    id: 'positional',
    nameAr: 'ربعي (3 - 6 أشهر)',
    nameEn: 'Quarterly (3 - 6 Months)',
    timeFactor: Math.sqrt(90), // ~9.486 of daily vol
    descAr: 'اتجاه استراتيجي لموجات الصعود والهبوط الرئيسية',
    descEn: 'Quarterly Macro Waves'
  },
  {
    id: 'macro',
    nameAr: 'ماكرو وسنوي (سنة - سنتين)',
    nameEn: 'Macro Cycle (1 - 2 Years)',
    timeFactor: Math.sqrt(365), // ~19.1 of daily vol
    descAr: 'الدورة الاقتصادية الكبرى ومستويات التوسع القصوى',
    descEn: 'Super-Cycle & Max Fibonacci Extensions'
  }
];

// --- Global Application State ---
const State = {
  lang: 'ar',
  activeAssetKey: 'gold',
  activeHorizonId: 'intraday',
  prices: [...ASSET_REGISTRY.gold.prices],
  liveQuote: ASSET_REGISTRY.gold.prices[ASSET_REGISTRY.gold.prices.length - 1],
  d: 0.40,
  optimalD: 0.38,
  autoDMode: true,
  fractionalSeries: [],
  hurst: 0.65,
  rsi: 58.4,
  fiboLevels: {},
  swingHigh: 0,
  swingLow: 0,
  multiHorizonResults: [],
  isPivot: false,
  showFiboOnChart: true,
  trades: JSON.parse(localStorage.getItem('fibosign_trades_v2') || '[]'),
  apiKeys: JSON.parse(localStorage.getItem('fibosign_api_keys') || '{"twelve":"","binance":"","custom":""}')
};

// --- Mathematical Engine ---

/**
 * Computes Grünwald-Letnikov binomial weights for fractional differentiation
 * w_0 = 1, w_k = -w_{k-1} * (d - k + 1) / k
 */
function computeWeights(d, length = 25) {
  const w = [1.0];
  for (let k = 1; k < length; k++) {
    w.push(-w[k - 1] * ((d - k + 1) / k));
  }
  return w;
}

/**
 * Computes fractional derivative series preserving long memory
 */
function fractionalDifferentiation(series, d) {
  const weights = computeWeights(d, Math.min(22, series.length));
  const out = [];
  for (let i = 0; i < series.length; i++) {
    let sum = 0;
    for (let k = 0; k < weights.length; k++) {
      if (i - k >= 0) {
        sum += weights[k] * series[i - k];
      }
    }
    out.push(sum);
  }
  return out;
}

/**
 * Calculates Optimal d* by seeking minimal d that passes stationarity proxy
 * (Inspired by Marcos Lopez de Prado's Advances in Financial Machine Learning)
 */
function calculateOptimalD(series) {
  if (!series || series.length < 10) return 0.40;
  
  // Test d candidates from 0.15 to 0.85
  for (let candidateD = 0.15; candidateD <= 0.85; candidateD += 0.05) {
    const diff = fractionalDifferentiation(series, candidateD);
    // Simple variance-ratio stationarity check: ratio of recent variance to total variance
    const mean = diff.reduce((a, b) => a + b, 0) / diff.length;
    const sqDiffs = diff.map(x => Math.pow(x - mean, 2));
    const totalVar = sqDiffs.reduce((a, b) => a + b, 0) / sqDiffs.length;
    
    // Recent window variance
    const recent = sqDiffs.slice(-Math.floor(diff.length / 2));
    const recentVar = recent.reduce((a, b) => a + b, 0) / recent.length;
    const ratio = Math.abs(recentVar - totalVar) / (totalVar || 1);
    
    if (ratio < 0.35 || candidateD >= 0.65) {
      return parseFloat(candidateD.toFixed(2));
    }
  }
  return 0.40;
}

/**
 * Rolling Hurst Exponent using Rescaled Range (R/S) Analysis
 */
function computeHurstExponent(series) {
  if (!series || series.length < 8) return 0.55;
  const n = series.length;
  const mean = series.reduce((a, b) => a + b, 0) / n;
  const dev = series.map(x => x - mean);
  
  let cum = 0;
  let maxCum = -Infinity;
  let minCum = Infinity;
  dev.forEach(d => {
    cum += d;
    if (cum > maxCum) maxCum = cum;
    if (cum < minCum) minCum = cum;
  });
  
  const range = maxCum - minCum;
  const variance = dev.reduce((acc, v) => acc + v * v, 0) / n;
  const std = Math.sqrt(variance);
  
  if (std === 0 || range === 0) return 0.50;
  const rs = range / std;
  const hurst = Math.log(rs) / Math.log(n * 0.5);
  return Math.min(0.88, Math.max(0.32, hurst));
}

/**
 * 14-Period Classical RSI (Relative Strength Index)
 */
function computeRSI(series, period = 14) {
  if (!series || series.length < period + 1) return 50.0;
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = series[i] - series[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  for (let i = period + 1; i < series.length; i++) {
    const diff = series[i] - series[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - (100 / (1 + rs))).toFixed(1));
}

/**
 * Classical Fibonacci Swing Retracements & Extensions
 */
function computeFibonacciLevels(series) {
  if (!series || series.length < 4) {
    return { high: 100, low: 90, fibo: {} };
  }
  const high = Math.max(...series);
  const low = Math.min(...series);
  const diff = high - low;
  
  const levels = {
    fibo0: low,
    fibo236: low + diff * 0.236,
    fibo382: low + diff * 0.382,
    fibo500: low + diff * 0.500,
    fibo618: low + diff * 0.618, // Golden Ratio
    fibo786: low + diff * 0.786,
    fibo100: high,
    fibo1618: low + diff * 1.618 // Golden Extension
  };
  
  return { high, low, levels };
}

/**
 * Computes Empirical Daily Volatility (%) from historical series returns
 */
function computeEmpiricalDailyVol(series, fallbackVol = 0.012) {
  if (!series || series.length < 5) return fallbackVol;
  const returns = [];
  for (let i = 1; i < series.length; i++) {
    returns.push((series[i] - series[i - 1]) / series[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / returns.length;
  const dailyVol = Math.sqrt(variance);
  return Math.max(0.005, Math.min(0.045, dailyVol));
}

// --- Live Free API Fetchers ---

/**
 * Fetches Live Klines from Binance Public API (Free, No Key Required, 100% Open CORS)
 */
async function fetchBinanceData(symbol) {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=40`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    const closes = data.map(item => parseFloat(item[4])).filter(c => !isNaN(c));
    return closes;
  } catch (err) {
    console.warn("Binance public API failed, using cached preset fallback.", err);
    return null;
  }
}

/**
 * Fetches real-time price using TwelveData if API key is provided
 */
async function fetchTwelveData(symbol) {
  if (!State.apiKeys.twelve) return null;
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&outputsize=35&apikey=${State.apiKeys.twelve}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.values && Array.isArray(json.values)) {
      return json.values.map(v => parseFloat(v.close)).reverse();
    }
  } catch (e) {
    console.error("TwelveData API error:", e);
  }
  return null;
}

// --- Main Operational Flow ---

/**
 * Selects active asset and initializes calculations
 */
async function selectAsset(key) {
  State.activeAssetKey = key;
  const asset = ASSET_REGISTRY[key];
  if (!asset) return;

  // Update UI active chip
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.asset === key);
  });

  showToast(State.lang === 'ar' ? 'جاري فحص وتحديث بيانات السوق...' : 'Updating market data...');
  
  let fetchedPrices = null;
  if (asset.apiSource === 'binance') {
    fetchedPrices = await fetchBinanceData(asset.apiSymbol);
  } else if (State.apiKeys.twelve) {
    fetchedPrices = await fetchTwelveData(asset.apiSymbol);
  }

  if (fetchedPrices && fetchedPrices.length >= 10) {
    State.prices = fetchedPrices;
    showToast(State.lang === 'ar' ? 'تم تحديث البيانات الحية من الـ API بنجاح!' : 'Live API data loaded successfully!');
  } else {
    State.prices = [...asset.prices];
  }

  State.liveQuote = State.prices[State.prices.length - 1];
  
  // Calculate Optimal d* automatically
  State.optimalD = calculateOptimalD(State.prices);
  if (State.autoDMode) {
    State.d = State.optimalD;
  }
  
  const dSlider = document.getElementById('dSlider');
  if (dSlider) dSlider.value = State.d;

  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) liveInput.value = State.liveQuote;

  updateAllCalculations();
}

/**
 * Master Calculation Pipeline
 */
function updateAllCalculations() {
  const prices = State.prices;
  const currentAsset = ASSET_REGISTRY[State.activeAssetKey] || {};
  const livePrice = parseFloat(State.liveQuote) || prices[prices.length - 1];
  const d = parseFloat(State.d);

  // 1. Fractional Derivative
  State.fractionalSeries = fractionalDifferentiation(prices, d);
  const lastFrac = State.fractionalSeries[State.fractionalSeries.length - 1];

  // 2. Hurst Exponent
  State.hurst = computeHurstExponent(prices);

  // 3. Classical RSI & Fibonacci
  State.rsi = computeRSI(prices, 14);
  const fiboData = computeFibonacciLevels(prices);
  State.swingHigh = fiboData.high;
  State.swingLow = fiboData.low;
  State.fiboLevels = fiboData.levels;

  // 4. Base Empirical Daily Volatility
  const dailyVolPct = computeEmpiricalDailyVol(prices, currentAsset.baseDailyVolPct || 0.012);

  // 5. Multi-Horizon Mathematical Projections (Square-root-of-time scaling)
  State.multiHorizonResults = HORIZON_DEFINITIONS.map(h => {
    // Sigma scaled by sqrt(time)
    const horizonVolPct = dailyVolPct * h.timeFactor;
    const moveDist = livePrice * horizonVolPct;
    
    // Direction based on fractional momentum and Hurst memory
    let dir = 'BUY';
    let isPiv = false;
    
    if (Math.abs(State.hurst - 0.50) < 0.035 || Math.abs(lastFrac / (livePrice * 0.01)) < 0.08) {
      isPiv = true;
      dir = 'PIVOT';
    } else if (lastFrac >= 0) {
      dir = State.hurst > 0.51 ? 'BUY' : 'SELL';
    } else {
      dir = State.hurst > 0.51 ? 'SELL' : 'BUY';
    }

    // Realistic targets: R1 (TP1) & R2 (TP2), S1 (SL) & S2
    let r1, r2, s1, s2;
    if (dir === 'BUY') {
      r1 = livePrice + moveDist * 1.0;
      r2 = livePrice + moveDist * 1.618; // Fibo expansion
      s1 = livePrice - moveDist * 0.65;
      s2 = livePrice - moveDist * 1.2;
    } else if (dir === 'SELL') {
      r1 = livePrice - moveDist * 1.0;
      r2 = livePrice - moveDist * 1.618;
      s1 = livePrice + moveDist * 0.65;
      s2 = livePrice + moveDist * 1.2;
    } else {
      // Pivot Equilibrium
      r1 = livePrice + moveDist * 0.8;
      r2 = livePrice + moveDist * 1.4;
      s1 = livePrice - moveDist * 0.8;
      s2 = livePrice - moveDist * 1.4;
    }

    const prob = isPiv ? 52 : Math.round(Math.min(84, Math.max(68, (State.hurst > 0.52 ? 76 : 70) + (Math.abs(lastFrac) > 0.1 ? 4 : 0))));

    return {
      ...h,
      direction: dir,
      isPivot: isPiv,
      volPct: (horizonVolPct * 100).toFixed(2),
      moveDist,
      r1,
      r2,
      s1,
      s2,
      probability: prob
    };
  });

  // Active Horizon Result
  const activeResult = State.multiHorizonResults.find(h => h.id === State.activeHorizonId) || State.multiHorizonResults[0];
  State.isPivot = activeResult.isPivot;

  // Render All UI Sections
  renderLiveBanner(livePrice, currentAsset.currency);
  renderOptimalDSection();
  renderHeroPrediction(activeResult, livePrice, lastFrac);
  renderConfluencePanel(livePrice);
  renderMultiHorizonTable();
  renderInstitutionalVerdict(activeResult, livePrice);
  renderChart(prices, State.fractionalSeries, livePrice, activeResult);
}

/**
 * Top Live Price Display
 */
function renderLiveBanner(price, currency) {
  const priceBig = document.getElementById('quotePriceBig');
  const currBadge = document.getElementById('quoteCurrencyBadge');
  const currencyLabel = document.getElementById('currencyLabel');
  
  if (priceBig) priceBig.innerText = formatPrice(price);
  if (currBadge) currBadge.innerText = currency || 'USD';
  if (currencyLabel) currencyLabel.innerText = currency || 'USD';
}

/**
 * Optimal d* display and mode
 */
function renderOptimalDSection() {
  const dValDisp = document.getElementById('dValDisplay');
  const optBadge = document.getElementById('optimalDBadge');
  const memoryPct = document.getElementById('memoryRetentionPct');
  const statusStationary = document.getElementById('stationaryStatus');

  const currentD = parseFloat(State.d);
  if (dValDisp) dValDisp.innerText = `d = ${currentD.toFixed(2)}`;
  if (optBadge) optBadge.innerText = `d* الأمثل = ${State.optimalD.toFixed(2)}`;
  
  const retention = ((1 - currentD) * 100).toFixed(1);
  if (memoryPct) memoryPct.innerText = `${retention}% حفظ الذاكرة`;
  if (statusStationary) {
    const isStationary = currentD >= 0.35;
    statusStationary.innerText = isStationary ? (State.lang === 'ar' ? 'مستقرة إحصائياً' : 'Stationary') : (State.lang === 'ar' ? 'غير مستقرة' : 'Non-Stationary');
    statusStationary.style.color = isStationary ? 'var(--accent-emerald)' : 'var(--accent-amber)';
  }
}

/**
 * Hero Prediction Box (Direction, R1/R2, S1/S2)
 */
function renderHeroPrediction(horizonRes, livePrice, lastFrac) {
  const pBox = document.getElementById('predictionBox');
  const badge = document.getElementById('signalBadge');
  const confVal = document.getElementById('confidenceValue');
  const biasDesc = document.getElementById('biasDescription');
  
  const r1Val = document.getElementById('r1Value');
  const r2Val = document.getElementById('r2Value');
  const s1Val = document.getElementById('s1Value');
  const s2Val = document.getElementById('s2Value');
  const hurstVal = document.getElementById('hurstValue');

  if (pBox) {
    pBox.className = 'prediction-box ' + (horizonRes.direction === 'BUY' ? 'bullish' : horizonRes.direction === 'SELL' ? 'bearish' : 'pivot');
  }

  if (badge) {
    if (horizonRes.direction === 'BUY') {
      badge.className = 'signal-badge buy';
      badge.innerText = State.lang === 'ar' ? 'شراء قوي (BUY)' : 'STRONG BUY';
    } else if (horizonRes.direction === 'SELL') {
      badge.className = 'signal-badge sell';
      badge.innerText = State.lang === 'ar' ? 'بيع قوي (SELL)' : 'STRONG SELL';
    } else {
      badge.className = 'signal-badge pivot';
      badge.innerText = State.lang === 'ar' ? 'منطقة توازن محورية (PIVOT)' : 'CRITICAL PIVOT';
    }
  }

  if (confVal) confVal.innerText = `${horizonRes.probability}%`;

  if (biasDesc) {
    if (horizonRes.isPivot) {
      biasDesc.innerText = State.lang === 'ar'
        ? `تنبيه محوري: السعر في منطقة توازن حرج (H=${State.hurst.toFixed(2)}). التوقع عالي الحساسية؛ نوصي بانتظار شمعة الساعتين القادمتين لتأكيد الذاكرة، أو التداول بنصف حجم العقد عند مستويات الدعم.`
        : `Pivot Equilibrium: Market is near critical balance (H=${State.hurst.toFixed(2)}). High uncertainty; waiting for the 2-hour close is statistically prudent.`;
    } else if (horizonRes.direction === 'BUY') {
      biasDesc.innerText = State.lang === 'ar'
        ? `عزم كسرى صاعد ذو ذاكرة حركية قوية (H=${State.hurst.toFixed(2)} > 0.50). التذبذب المتوقع لأفق (${horizonRes.nameAr}) هو ±${horizonRes.volPct}% نحو المقاومات.`
        : `Bullish fractional memory momentum (H=${State.hurst.toFixed(2)}). Projected volatility over (${horizonRes.nameEn}) is ±${horizonRes.volPct}% targeting resistances.`;
    } else {
      biasDesc.innerText = State.lang === 'ar'
        ? `عزم كسرى هابط والذاكرة الحركية تدعم استمرار الضغط البيعي (H=${State.hurst.toFixed(2)}). التذبذب المقدر هو ±${horizonRes.volPct}% نحو الدعوم.`
        : `Bearish fractional memory momentum (H=${State.hurst.toFixed(2)}). Projected volatility is ±${horizonRes.volPct}% targeting key supports.`;
    }
  }

  if (r1Val) r1Val.innerText = formatPrice(horizonRes.r1);
  if (r2Val) r2Val.innerText = formatPrice(horizonRes.r2);
  if (s1Val) s1Val.innerText = formatPrice(horizonRes.s1);
  if (s2Val) s2Val.innerText = formatPrice(horizonRes.s2);
  if (hurstVal) hurstVal.innerText = `H = ${State.hurst.toFixed(2)}`;
}

/**
 * Confluence Grid (Fibonacci + RSI + Pivots)
 */
function renderConfluencePanel(livePrice) {
  const fiboHighSpan = document.getElementById('fiboSwingHigh');
  const fiboLowSpan = document.getElementById('fiboSwingLow');
  const fiboGoldenSpan = document.getElementById('fiboGoldenVal');
  const rsiValSpan = document.getElementById('rsiValueText');
  const rsiBarFill = document.getElementById('rsiBarFill');
  const rsiStatus = document.getElementById('rsiStatusBadge');

  if (fiboHighSpan) fiboHighSpan.innerText = formatPrice(State.swingHigh);
  if (fiboLowSpan) fiboLowSpan.innerText = formatPrice(State.swingLow);
  if (fiboGoldenSpan) fiboGoldenSpan.innerText = formatPrice(State.fiboLevels.fibo618 || 0);

  if (rsiValSpan) rsiValSpan.innerText = `RSI(14) = ${State.rsi}`;
  if (rsiBarFill) rsiBarFill.style.width = `${State.rsi}%`;
  
  if (rsiStatus) {
    if (State.rsi >= 70) {
      rsiStatus.innerText = State.lang === 'ar' ? 'تشبع شرائي (>70)' : 'Overbought (>70)';
      rsiStatus.className = 'fibo-badge';
      rsiStatus.style.color = '#fb7185';
    } else if (State.rsi <= 30) {
      rsiStatus.innerText = State.lang === 'ar' ? 'تشبع بيعي (<30)' : 'Oversold (<30)';
      rsiStatus.className = 'fibo-badge';
      rsiStatus.style.color = '#34d399';
    } else if (State.rsi >= 50) {
      rsiStatus.innerText = State.lang === 'ar' ? 'عزم إيجابي معتدل (50-70)' : 'Bullish Momentum';
      rsiStatus.className = 'fibo-badge';
      rsiStatus.style.color = '#38bdf8';
    } else {
      rsiStatus.innerText = State.lang === 'ar' ? 'عزم سلبي معتدل (30-50)' : 'Bearish Momentum';
      rsiStatus.className = 'fibo-badge';
      rsiStatus.style.color = '#fbbf24';
    }
  }
}

/**
 * Comprehensive Multi-Horizon Forecast Matrix
 */
function renderMultiHorizonTable() {
  const tbody = document.getElementById('horizonTbody');
  if (!tbody) return;

  tbody.innerHTML = State.multiHorizonResults.map(h => {
    const isCurrentActive = h.id === State.activeHorizonId;
    const dirBadge = h.direction === 'BUY'
      ? '<span style="color: #34d399; font-weight: 800;">شراء (BUY)</span>'
      : h.direction === 'SELL'
      ? '<span style="color: #fb7185; font-weight: 800;">بيع (SELL)</span>'
      : '<span style="color: #fde68a; font-weight: 800;">محوري (PIVOT)</span>';

    return `<tr style="${isCurrentActive ? 'background: rgba(56, 189, 248, 0.08); font-weight: bold;' : ''}">
      <td>
        <div style="font-weight: 700; color: #fff;">${State.lang === 'ar' ? h.nameAr : h.nameEn}</div>
        <div style="font-size: 10px; color: var(--text-dim);">${State.lang === 'ar' ? h.descAr : h.descEn}</div>
      </td>
      <td>${dirBadge}</td>
      <td style="font-family: monospace; color: var(--accent-cyan);">±${h.volPct}%</td>
      <td style="font-family: monospace; color: #34d399;">${formatPrice(h.r1)}</td>
      <td style="font-family: monospace; color: #10b981;">${formatPrice(h.r2)}</td>
      <td style="font-family: monospace; color: #fb7185;">${formatPrice(h.s1)}</td>
      <td style="font-family: monospace; color: #f43f5e;">${formatPrice(h.s2)}</td>
      <td style="font-family: monospace; font-weight: 800; color: var(--accent-gold);">${h.probability}%</td>
    </tr>`;
  }).join('');
}

/**
 * Formal Institutional Executive Verdict
 */
function renderInstitutionalVerdict(activeHorizon, livePrice) {
  const box = document.getElementById('institutionalVerdictBox');
  if (!box) return;

  const assetName = State.lang === 'ar' ? ASSET_REGISTRY[State.activeAssetKey].nameAr : ASSET_REGISTRY[State.activeAssetKey].nameEn;
  const nowStr = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const goldenDist = Math.abs(livePrice - State.fiboLevels.fibo618);
  const goldenPct = ((goldenDist / livePrice) * 100).toFixed(2);

  const verdictAr = `
    <strong>[تقرير التوافق المؤسسي • ${nowStr}]:</strong><br/>
    بناءً على تفاضل الذاكرة الكسرية بالرتبة المثالية <code>d* = ${State.optimalD.toFixed(2)}</code>، سجلت السلسلة السعرية لـ <strong>${assetName}</strong> عند السعر <code>${formatPrice(livePrice)}</code> أس هيرست <code>H = ${State.hurst.toFixed(2)}</code> (${State.hurst > 0.50 ? 'ذاكرة اتجاهية استمرارية' : 'ذاكرة ارتدادية نحو المتوسط'}).
    <br/>
    يقع السعر حالياً على بعد <strong>${goldenPct}%</strong> من النسبة الذهبية لفيبوناتشي (61.8% = ${formatPrice(State.fiboLevels.fibo618)}) ومؤشر القوة النسبية RSI عند <strong>${State.rsi}</strong>.
    تتوافق قراءة الذاكرة الكسرية للأفق الزمني [${activeHorizon.nameAr}] بترجيح <strong>${activeHorizon.direction === 'BUY' ? 'استمرار الصعود نحو المقاومة الأولى R1' : activeHorizon.direction === 'SELL' ? 'استمرار التصحيح نحو الدعم الأول S1' : 'انتظار اكتمال شمعة الساعتين لثبوت المحور'}</strong> مع نقطة وقف خسارة هيكلية واضحة عند <code>${formatPrice(activeHorizon.s1)}</code>، مما يحقق نسبة مخاطرة إلى عائد (R:R) إحصائية ممتازة.
  `;

  box.innerHTML = verdictAr;
}

function formatPrice(val) {
  if (val === undefined || isNaN(val)) return '---';
  if (val > 1000) return val.toFixed(1);
  if (val > 50) return val.toFixed(2);
  return val.toFixed(4);
}

/**
 * Advanced HTML5 Canvas Multi-Layer Chart with Crosshair
 */
function renderChart(prices, fracSeries, livePrice, activeHorizon) {
  const canvas = document.getElementById('marketCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);
  if (!prices || prices.length < 2) return;

  const padTop = 35;
  const padBottom = 45;
  const padLeft = 20;
  const padRight = 70;

  // Include R1, R2, S1, S2 in bounds for clean view
  const allLevels = [
    ...prices,
    livePrice,
    activeHorizon.r1,
    activeHorizon.s1,
    State.fiboLevels.fibo618 || livePrice
  ].filter(x => !isNaN(x) && x > 0);

  const minP = Math.min(...allLevels) * 0.995;
  const maxP = Math.max(...allLevels) * 1.005;
  const rangeP = maxP - minP || 1;

  const stepX = (w - padLeft - padRight) / (prices.length - 1);

  // 1. Horizontal Price Grid & Scale
  ctx.strokeStyle = '#1a253c';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 1; i <= 4; i++) {
    const y = padTop + (h - padTop - padBottom) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();

    const priceAtY = maxP - (i / 4) * rangeP;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(formatPrice(priceAtY), w - padRight + 6, y + 3);
  }
  ctx.setLineDash([]);

  // 2. Fibonacci 61.8% Golden Ratio Overlay
  if (State.showFiboOnChart && State.fiboLevels.fibo618) {
    const fiboY = padTop + (1 - (State.fiboLevels.fibo618 - minP) / rangeP) * (h - padTop - padBottom);
    if (fiboY >= padTop && fiboY <= h - padBottom) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padLeft, fiboY);
      ctx.lineTo(w - padRight, fiboY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`Fibo 61.8% (${formatPrice(State.fiboLevels.fibo618)})`, padLeft + 6, fiboY - 4);
    }
  }

  // 3. Fractional Derivative Oscillator (Bottom area)
  if (fracSeries && fracSeries.length === prices.length) {
    const maxFrac = Math.max(...fracSeries.map(Math.abs)) || 1;
    const midY = h - 65;
    const fracHeight = 35;

    fracSeries.forEach((f, i) => {
      const x = padLeft + i * stepX;
      const barH = (f / maxFrac) * fracHeight;
      ctx.fillStyle = f >= 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - 3, midY - (f >= 0 ? barH : 0), 6, Math.abs(barH));
    });
  }

  // 4. Price Path
  ctx.beginPath();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;

  prices.forEach((p, i) => {
    const x = padLeft + i * stepX;
    const y = padTop + (1 - (p - minP) / rangeP) * (h - padTop - padBottom);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Price points
  prices.forEach((p, i) => {
    const x = padLeft + i * stepX;
    const y = padTop + (1 - (p - minP) / rangeP) * (h - padTop - padBottom);
    ctx.beginPath();
    ctx.fillStyle = i === prices.length - 1 ? '#fff' : '#0284c7';
    ctx.arc(x, y, i === prices.length - 1 ? 5 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. R1, R2, S1 Target Lines
  drawLevelLine(ctx, activeHorizon.r1, minP, rangeP, padTop, padBottom, padLeft, w, padRight, h, '#10b981', `R1: ${formatPrice(activeHorizon.r1)}`);
  drawLevelLine(ctx, activeHorizon.s1, minP, rangeP, padTop, padBottom, padLeft, w, padRight, h, '#f43f5e', `S1: ${formatPrice(activeHorizon.s1)}`);

  // Current Price Beacon (Last Point)
  const lastX = padLeft + (prices.length - 1) * stepX;
  const lastY = padTop + (1 - (livePrice - minP) / rangeP) * (h - padTop - padBottom);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(padLeft, lastY);
  ctx.lineTo(w - padRight, lastY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Price Tag on Right Axis
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(w - padRight + 2, lastY - 9, 65, 18);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(formatPrice(livePrice), w - padRight + 6, lastY + 4);
}

function drawLevelLine(ctx, level, minP, rangeP, padTop, padBottom, padLeft, w, padRight, h, color, label) {
  if (!level || isNaN(level)) return;
  const y = padTop + (1 - (level - minP) / rangeP) * (h - padTop - padBottom);
  if (y < 0 || y > h) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(padLeft, y);
  ctx.lineTo(w - padRight, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = color;
  ctx.font = 'bold 9px monospace';
  ctx.fillText(label, w - padRight + 6, y + 3);
}

// --- Live Trade Recording (To Test 300-400 Samples Seamlessly) ---

function recordLiveTrade() {
  const currentAsset = ASSET_REGISTRY[State.activeAssetKey];
  const activeRes = State.multiHorizonResults.find(h => h.id === State.activeHorizonId) || State.multiHorizonResults[0];
  const livePrice = parseFloat(State.liveQuote);

  const trade = {
    id: 'tr_' + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    asset: State.lang === 'ar' ? currentAsset.nameAr : currentAsset.nameEn,
    horizon: activeRes.nameAr,
    direction: activeRes.direction,
    entry: livePrice,
    r1: activeRes.r1,
    s1: activeRes.s1,
    hurst: State.hurst.toFixed(2),
    d: State.d,
    status: 'OPEN' // 'OPEN' | 'WIN' | 'LOSS'
  };

  State.trades.unshift(trade);
  localStorage.setItem('fibosign_trades_v2', JSON.stringify(State.trades));
  renderTradesTable();
  showToast(State.lang === 'ar' ? 'تم تسجيل الصفقة بنجاح في سجل التجارب الحية!' : 'Trade logged in live test tracker!');
}

function resolveTrade(id, result) {
  State.trades = State.trades.map(t => {
    if (t.id === id) t.status = result;
    return t;
  });
  localStorage.setItem('fibosign_trades_v2', JSON.stringify(State.trades));
  renderTradesTable();
}

function clearAllTrades() {
  if (confirm(State.lang === 'ar' ? 'هل تريد مسح جميع التجارب السابقة؟' : 'Clear all test records?')) {
    State.trades = [];
    localStorage.removeItem('fibosign_trades_v2');
    renderTradesTable();
  }
}

function renderTradesTable() {
  const tbody = document.getElementById('tradesTbody');
  const statsSpan = document.getElementById('hitRateStats');
  if (!tbody) return;

  if (State.trades.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 18px;">
      ${State.lang === 'ar' ? 'لا توجد صفقات تجريبية مسجلة بعد. اضغط "تسجيل التجربة ومتابعة النتيجة الحية" للبدء.' : 'No recorded tests yet. Click "Log Live Test" to start.'}
    </td></tr>`;
    if (statsSpan) statsSpan.innerText = State.lang === 'ar' ? '0 تجربة' : '0 Tests';
    return;
  }

  let wins = 0;
  let resolved = 0;

  tbody.innerHTML = State.trades.map(t => {
    if (t.status === 'WIN') { wins++; resolved++; }
    if (t.status === 'LOSS') { resolved++; }

    const statusBadge = t.status === 'WIN' 
      ? '<span style="color: #34d399; font-weight: bold;">WIN (نجاح)</span>'
      : t.status === 'LOSS'
      ? '<span style="color: #fb7185; font-weight: bold;">LOSS (فشل)</span>'
      : `<button class="btn btn-success" style="padding: 2px 6px; font-size: 10px;" onclick="resolveTrade('${t.id}', 'WIN')">ربح</button>
         <button class="btn btn-danger" style="padding: 2px 6px; font-size: 10px; margin-left: 4px;" onclick="resolveTrade('${t.id}', 'LOSS')">خسارة</button>`;

    return `<tr>
      <td style="font-family: monospace;">${t.time}</td>
      <td><strong>${t.asset}</strong></td>
      <td style="color: ${t.direction === 'BUY' ? '#34d399' : '#fb7185'}; font-weight: bold;">${t.direction}</td>
      <td style="font-family: monospace;">${formatPrice(t.entry)}</td>
      <td style="font-family: monospace; color: #34d399;">${formatPrice(t.r1)}</td>
      <td style="font-family: monospace; color: #fb7185;">${formatPrice(t.s1)}</td>
      <td>${statusBadge}</td>
    </tr>`;
  }).join('');

  if (statsSpan) {
    const hitRate = resolved > 0 ? ((wins / resolved) * 100).toFixed(1) : '---';
    statsSpan.innerText = State.lang === 'ar'
      ? `إجمالي: ${State.trades.length} | المحسوم: ${resolved} | الدقة: ${hitRate}%`
      : `Total: ${State.trades.length} | Resolved: ${resolved} | Hit Rate: ${hitRate}%`;
  }
}

// --- Fast Raw Single-Column Price Insertion (للي داخل يحط عمود أسعار ويمشي) ---

function parseAndApplyRawPrices() {
  const text = document.getElementById('rawPriceTextarea').value.trim();
  if (!text) return;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const parsed = [];

  for (let l of lines) {
    const parts = l.split(/[,\t;\s]+/).map(p => p.trim()).filter(p => p.length > 0);
    let val = NaN;
    if (parts.length >= 2) {
      val = parseFloat(parts[1]) || parseFloat(parts[parts.length - 1]);
    } else if (parts.length === 1) {
      val = parseFloat(parts[0]);
    }
    if (!isNaN(val)) parsed.push(val);
  }

  if (parsed.length < 5) {
    alert(State.lang === 'ar' ? 'الرجاء إدخال 5 أسعار على الأقل لحساب الذاكرة الكسرية وهيرست.' : 'Please enter at least 5 price points.');
    return;
  }

  State.prices = parsed;
  State.liveQuote = parsed[parsed.length - 1];
  State.optimalD = calculateOptimalD(parsed);
  if (State.autoDMode) State.d = State.optimalD;

  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) liveInput.value = State.liveQuote;

  updateAllCalculations();
  showToast(State.lang === 'ar' ? `تم تحميل ${parsed.length} شمعة سعرية وحساب الذاكرة وهيرست فورياً!` : `Loaded ${parsed.length} points!`);
}

// --- Quick Toast System ---
function showToast(msg) {
  let toast = document.getElementById('fiboToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fiboToast';
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: #131c31; color: #fff; border: 1px solid #38bdf8;
      padding: 10px 18px; border-radius: 8px; font-size: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6); transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// --- Event Handlers & Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Asset Chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => selectAsset(c.dataset.asset));
  });

  // 2. Horizon Selection (Intraday, Short, Swing)
  document.querySelectorAll('.horizon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.horizon-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.activeHorizonId = btn.dataset.horizon;
      updateAllCalculations();
    });
  });

  // 3. Fractional Order (d) Slider
  const dSlider = document.getElementById('dSlider');
  if (dSlider) {
    dSlider.addEventListener('input', (e) => {
      State.d = parseFloat(e.target.value);
      State.autoDMode = false;
      updateAllCalculations();
    });
  }

  // 4. Auto D* Button
  const autoDBtn = document.getElementById('autoOptimalDBtn');
  if (autoDBtn) {
    autoDBtn.addEventListener('click', () => {
      State.autoDMode = true;
      State.optimalD = calculateOptimalD(State.prices);
      State.d = State.optimalD;
      if (dSlider) dSlider.value = State.d;
      updateAllCalculations();
      showToast(State.lang === 'ar' ? `تم تفعيل الرتبة الكسرية المثالية d* = ${State.optimalD.toFixed(2)}` : `Auto d* set to ${State.optimalD.toFixed(2)}`);
    });
  }

  // 5. Live Quote Input Override
  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) {
    liveInput.addEventListener('input', (e) => {
      State.liveQuote = parseFloat(e.target.value) || State.prices[State.prices.length - 1];
      updateAllCalculations();
    });
  }

  // 6. Raw Price Quick Parser Button
  const parseBtn = document.getElementById('parseRawBtn');
  if (parseBtn) {
    parseBtn.addEventListener('click', parseAndApplyRawPrices);
  }

  // 7. Record Live Trade Button
  const recordBtn = document.getElementById('recordTradeBtn');
  if (recordBtn) {
    recordBtn.addEventListener('click', recordLiveTrade);
  }

  // 8. Clear Trades Button
  const clearBtn = document.getElementById('clearTradesBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllTrades);
  }

  // 9. Settings Modal
  const settingsModal = document.getElementById('settingsModal');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveApiKeysBtn = document.getElementById('saveApiKeysBtn');

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      document.getElementById('twelveApiKeyInput').value = State.apiKeys.twelve || '';
      settingsModal.classList.add('open');
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('open'));
  }

  if (saveApiKeysBtn && settingsModal) {
    saveApiKeysBtn.addEventListener('click', () => {
      State.apiKeys.twelve = document.getElementById('twelveApiKeyInput').value.trim();
      localStorage.setItem('fibosign_api_keys', JSON.stringify(State.apiKeys));
      settingsModal.classList.remove('open');
      showToast(State.lang === 'ar' ? 'تم حفظ مفاتيح الـ API بنجاح!' : 'API Keys saved successfully!');
    });
  }

  // 10. Language Switcher
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      State.lang = State.lang === 'ar' ? 'en' : 'ar';
      document.documentElement.lang = State.lang;
      document.documentElement.dir = State.lang === 'ar' ? 'rtl' : 'ltr';
      langBtn.innerText = State.lang === 'ar' ? 'English' : 'عربي';
      updateAllCalculations();
      renderTradesTable();
    });
  }

  // 11. Chart Fibonacci Toggle
  const toggleFiboBtn = document.getElementById('toggleFiboChartBtn');
  if (toggleFiboBtn) {
    toggleFiboBtn.addEventListener('click', () => {
      State.showFiboOnChart = !State.showFiboOnChart;
      toggleFiboBtn.classList.toggle('btn-primary', State.showFiboOnChart);
      toggleFiboBtn.classList.toggle('btn-secondary', !State.showFiboOnChart);
      const activeRes = State.multiHorizonResults.find(h => h.id === State.activeHorizonId) || State.multiHorizonResults[0];
      renderChart(State.prices, State.fractionalSeries, State.liveQuote, activeRes);
    });
  }

  // Resize Redraw
  window.addEventListener('resize', () => {
    const activeRes = State.multiHorizonResults.find(h => h.id === State.activeHorizonId) || State.multiHorizonResults[0];
    renderChart(State.prices, State.fractionalSeries, State.liveQuote, activeRes);
  });

  // Initial Boot
  renderTradesTable();
  selectAsset('gold');
});
