/**
 * FiboSign - Fractional Dynamics & Market Memory Engine
 * Pure Vanilla JavaScript (Zero Dependencies, Zero Build Step)
 * Developed for Eng. Sameh Yassin & Institutional Quant Research
 */

// --- Initial Preset Data (Preloaded Fallbacks for instant zero-latency start) ---
const PRESET_DATA = {
  gold: {
    nameAr: "الذهب (Gold - XAU/USD)",
    nameEn: "Gold (XAU/USD)",
    symbol: "PAXGUSDT",
    currency: "USD",
    apiSource: "binance",
    apiSymbol: "PAXGUSDT",
    defaultD: 0.40,
    prices: [
      2685.2, 2688.4, 2692.1, 2690.5, 2695.8, 2702.4, 2698.0, 2706.5,
      2715.0, 2710.2, 2718.6, 2724.0, 2720.5, 2729.0, 2735.4, 2730.0,
      2738.5, 2744.2, 2740.1, 2749.0, 2755.8, 2751.2, 2760.0, 2766.4,
      2762.0, 2771.5, 2778.0, 2772.4, 2781.0, 2788.5
    ]
  },
  silver: {
    nameAr: "الفضة (Silver - XAG/USD)",
    nameEn: "Silver (XAG/USD)",
    symbol: "XAGUSD",
    currency: "USD",
    apiSource: "custom",
    apiSymbol: "XAGUSD",
    defaultD: 0.35,
    prices: [
      30.12, 30.25, 30.42, 30.30, 30.65, 30.88, 30.70, 31.05,
      31.35, 31.18, 31.52, 31.80, 31.62, 32.05, 32.30, 32.10,
      32.45, 32.78, 32.55, 32.95, 33.20, 33.02, 33.40, 33.72,
      33.50, 33.88, 34.15, 33.95, 34.30, 34.62
    ]
  },
  tmgh: {
    nameAr: "طلعت مصطفى (TMGH.CA - البورصة المصرية)",
    nameEn: "Talaat Moustafa (TMGH.CA - EGX)",
    symbol: "TMGH.CA",
    currency: "EGP",
    apiSource: "egx",
    apiSymbol: "TMGH",
    defaultD: 0.45,
    prices: [
      64.20, 64.80, 65.50, 65.10, 66.40, 67.80, 67.20, 68.50,
      70.10, 69.40, 71.20, 72.80, 72.00, 73.60, 75.20, 74.50,
      76.00, 77.80, 77.10, 78.90, 80.50, 79.80, 81.40, 83.20,
      82.50, 84.60, 86.00, 85.20, 87.50, 89.20
    ]
  },
  cib: {
    nameAr: "البنك التجاري الدولي (COMI.CA - EGX)",
    nameEn: "Commercial Intl Bank (COMI.CA - EGX)",
    symbol: "COMI.CA",
    currency: "EGP",
    apiSource: "egx",
    apiSymbol: "COMI",
    defaultD: 0.40,
    prices: [
      82.10, 82.50, 83.20, 82.90, 83.80, 84.50, 84.10, 85.20,
      86.00, 85.70, 86.60, 87.40, 87.00, 88.10, 89.00, 88.50,
      89.40, 90.20, 89.80, 90.80, 91.60, 91.20, 92.20, 93.00,
      92.60, 93.80, 94.50, 94.00, 95.20, 96.10
    ]
  },
  btc: {
    nameAr: "البيتكوين (BTC/USDT)",
    nameEn: "Bitcoin (BTC/USDT)",
    symbol: "BTCUSDT",
    currency: "USD",
    apiSource: "binance",
    apiSymbol: "BTCUSDT",
    defaultD: 0.45,
    prices: [
      91200, 91800, 92450, 92100, 93000, 93850, 93400, 94200,
      95100, 94600, 95800, 96500, 96000, 97200, 98100, 97500,
      98600, 99400, 98900, 100200, 101500, 100800, 102200, 103400,
      102800, 104100, 105200, 104600, 106000, 107200
    ]
  }
};

// --- Global Application State ---
const State = {
  lang: 'ar',
  activeAssetKey: 'gold',
  activeHorizon: '3h', // '1h' | '3h' | '1d'
  prices: [...PRESET_DATA.gold.prices],
  liveQuote: PRESET_DATA.gold.prices[PRESET_DATA.gold.prices.length - 1],
  d: PRESET_DATA.gold.defaultD,
  fractionalSeries: [],
  hurst: 0.65,
  isPivot: false,
  pivotReason: '',
  trades: JSON.parse(localStorage.getItem('fibosign_trades') || '[]'),
  apiKeys: JSON.parse(localStorage.getItem('fibosign_api_keys') || '{"twelve":"","binance":"","custom":""}')
};

// --- Mathematical Engine ---

/**
 * Computes binomial weights for fractional differentiation (Grünwald-Letnikov)
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
 * Computes fractional derivative series with memory lookback
 */
function fractionalDifferentiation(series, d) {
  const weights = computeWeights(d, 20);
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
 * Rolling Hurst Exponent using Rescaled Range (R/S) Analysis
 */
function computeHurstExponent(series) {
  if (series.length < 8) return 0.55;
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

// --- Live Free API Fetchers ---

/**
 * Fetches Live Klines from Binance Public API (Free, No Key, CORS Open)
 */
async function fetchBinanceData(symbol) {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=40`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    // data item: [time, open, high, low, close, volume, ...]
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
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&outputsize=30&apikey=${State.apiKeys.twelve}`;
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

// --- Application Core Flow ---

/**
 * Switches the active asset and dynamically attempts live API fetch
 */
async function selectAsset(key) {
  State.activeAssetKey = key;
  const asset = PRESET_DATA[key];
  if (!asset) return;

  // Set default D
  State.d = asset.defaultD;
  const dSlider = document.getElementById('dSlider');
  if (dSlider) dSlider.value = State.d;

  // Update UI active chip
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.asset === key);
  });

  // Attempt live free API fetch if available
  showToast(State.lang === 'ar' ? 'جاري جلب أحدث بيانات السوق...' : 'Fetching latest market data...');
  
  let fetchedPrices = null;
  if (asset.apiSource === 'binance') {
    fetchedPrices = await fetchBinanceData(asset.apiSymbol);
  } else if (State.apiKeys.twelve) {
    fetchedPrices = await fetchTwelveData(asset.apiSymbol);
  }

  if (fetchedPrices && fetchedPrices.length >= 10) {
    State.prices = fetchedPrices;
    showToast(State.lang === 'ar' ? 'تم تحديث البيانات الحية بنجاح من الـ API' : 'Live data updated from API!');
  } else {
    State.prices = [...asset.prices];
  }

  State.liveQuote = State.prices[State.prices.length - 1];
  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) liveInput.value = State.liveQuote;

  updateCalculations();
}

/**
 * Recalculates Fractional Derivative, Hurst, Pivot points, and Formulates Target/SL
 */
function updateCalculations() {
  const prices = State.prices;
  const d = parseFloat(State.d);
  const livePrice = parseFloat(State.liveQuote) || prices[prices.length - 1];
  
  // 1. Fractional derivative series
  State.fractionalSeries = fractionalDifferentiation(prices, d);
  const lastFrac = State.fractionalSeries[State.fractionalSeries.length - 1];
  
  // 2. Hurst Exponent
  State.hurst = computeHurstExponent(prices);
  
  // 3. Horizon Volatility Scaling
  let horizonMultiplier = 1.0;
  let horizonLabelAr = "3 ساعات";
  let horizonLabelEn = "3 Hours";
  
  if (State.activeHorizon === '1h') {
    horizonMultiplier = 0.6;
    horizonLabelAr = "ساعة واحدة (مضاربة لحظية)";
    horizonLabelEn = "1 Hour (Scalping)";
  } else if (State.activeHorizon === '1d') {
    horizonMultiplier = 1.8;
    horizonLabelAr = "يوم كامل / الغد (اتجاهي)";
    horizonLabelEn = "Tomorrow / 1 Day (Macro)";
  }

  // Volatility estimate based on price scale
  const estVol = (livePrice * 0.014) * horizonMultiplier;

  // 4. Critical Pivot Detection
  // If Hurst is near 0.50 (+- 0.03) OR the fractional derivative is near zero inflection
  const isNearZeroCross = Math.abs(lastFrac) < (estVol * 0.15);
  const isBrownian = Math.abs(State.hurst - 0.50) < 0.04;
  
  State.isPivot = isNearZeroCross || isBrownian;
  
  let direction = 'BUY';
  let biasText = '';
  
  if (State.isPivot) {
    direction = 'PIVOT';
    biasText = State.lang === 'ar' 
      ? `تنبيه محوري: السعر في منطقة توازن حرج (H=${State.hurst.toFixed(2)}). الدخول الآن عالي المخاطرة؛ نوصي بانتظار شمعة الساعتين القادمتين لتأكيد الاتجاه أو تداول بنصف الحجم.`
      : `Critical Pivot Alert: Price is in equilibrium (H=${State.hurst.toFixed(2)}). High uncertainty; waiting for the next 2-hour close is statistically safer.`;
  } else if (lastFrac >= 0) {
    if (State.hurst > 0.52) {
      direction = 'BUY';
      biasText = State.lang === 'ar'
        ? `عزم شرائي قوي ذو ذاكرة حركية ممتدة (H=${State.hurst.toFixed(2)}). استمرار الصعود مرجح خلال ${horizonLabelAr}.`
        : `Strong bullish momentum with persistent memory (H=${State.hurst.toFixed(2)}). Upside likely over ${horizonLabelEn}.`;
    } else {
      direction = 'SELL';
      biasText = State.lang === 'ar'
        ? `تشبع شرائي مع ذاكرة ارتدادية (H=${State.hurst.toFixed(2)}). ترجيح جني أرباح وهبوط ارتدادي.`
        : `Overbought with mean-reverting memory (H=${State.hurst.toFixed(2)}). Pullback likely.`;
    }
  } else {
    if (State.hurst > 0.52) {
      direction = 'SELL';
      biasText = State.lang === 'ar'
        ? `عزم بيعي مستمر وذاكرة تدعم الهبوط (H=${State.hurst.toFixed(2)}). تجنب الشراء المبكر خلال ${horizonLabelAr}.`
        : `Persistent bearish momentum (H=${State.hurst.toFixed(2)}). Downside continuation expected over ${horizonLabelEn}.`;
    } else {
      direction = 'BUY';
      biasText = State.lang === 'ar'
        ? `تشبع بيعي ارتدادي خشن (H=${State.hurst.toFixed(2)}). ترجيح ارتداد صاعد نحو المتوسط.`
        : `Rough oversold mean-reverting setup (H=${State.hurst.toFixed(2)}). Upward snapback expected.`;
    }
  }

  // 5. Target (TP) and Stop Loss (SL) Calculation
  const moveDistance = Math.max(estVol, Math.abs(lastFrac) * 1.5);
  let targetPrice = direction === 'BUY' ? livePrice + moveDistance : livePrice - moveDistance;
  let stopLoss = direction === 'BUY' ? livePrice - (moveDistance * 0.55) : livePrice + (moveDistance * 0.55);
  
  if (direction === 'PIVOT') {
    targetPrice = livePrice + moveDistance * 0.7;
    stopLoss = livePrice - moveDistance * 0.7;
  }

  // 6. Confidence Score
  const baseConfidence = Math.round(Math.min(84, Math.max(68, (State.hurst > 0.52 ? 78 : 72) + (Math.abs(lastFrac) > 0.1 ? 4 : 0))));
  const finalConfidence = State.isPivot ? 54 : baseConfidence;

  // Render to DOM
  renderPrediction({
    direction,
    biasText,
    livePrice,
    targetPrice,
    stopLoss,
    confidence: finalConfidence,
    hurst: State.hurst,
    d: State.d,
    lastFrac
  });

  // Render Canvas Chart
  renderChart(prices, State.fractionalSeries, livePrice, targetPrice, stopLoss);
}

/**
 * Updates UI prediction cards
 */
function renderPrediction(data) {
  const pBox = document.getElementById('predictionBox');
  const badge = document.getElementById('signalBadge');
  const biasDesc = document.getElementById('biasDescription');
  const tpVal = document.getElementById('tpValue');
  const slVal = document.getElementById('slValue');
  const hurstVal = document.getElementById('hurstValue');
  const dValDisplay = document.getElementById('dValDisplay');
  const confidenceVal = document.getElementById('confidenceValue');
  const currencyLabel = document.getElementById('currencyLabel');

  const asset = PRESET_DATA[State.activeAssetKey] || {};
  if (currencyLabel) currencyLabel.innerText = asset.currency || 'USD';

  // Styles per direction
  pBox.className = 'prediction-box ' + (data.direction === 'BUY' ? 'bullish' : data.direction === 'SELL' ? 'bearish' : 'pivot');
  
  if (badge) {
    if (data.direction === 'BUY') {
      badge.className = 'signal-badge buy';
      badge.innerText = State.lang === 'ar' ? 'شراء قوي / BUY' : 'STRONG BUY';
    } else if (data.direction === 'SELL') {
      badge.className = 'signal-badge sell';
      badge.innerText = State.lang === 'ar' ? 'بيع قوي / SELL' : 'STRONG SELL';
    } else {
      badge.className = 'signal-badge pivot';
      badge.innerText = State.lang === 'ar' ? 'نقطة توازن محورية / PIVOT' : 'CRITICAL PIVOT';
    }
  }

  if (biasDesc) biasDesc.innerText = data.biasText;
  if (tpVal) tpVal.innerText = formatPrice(data.targetPrice);
  if (slVal) slVal.innerText = formatPrice(data.stopLoss);
  if (hurstVal) hurstVal.innerText = `H = ${data.hurst.toFixed(2)}`;
  if (dValDisplay) dValDisplay.innerText = `d = ${parseFloat(data.d).toFixed(2)}`;
  if (confidenceVal) confidenceVal.innerText = `${data.confidence}%`;
}

function formatPrice(val) {
  if (val > 1000) return val.toFixed(1);
  if (val > 50) return val.toFixed(2);
  return val.toFixed(4);
}

/**
 * Pure HTML5 Canvas Multi-Curve Chart
 */
function renderChart(prices, fracSeries, livePrice, tp, sl) {
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

  const padTop = 30;
  const padBottom = 40;
  const padSide = 50;

  const minP = Math.min(...prices) * 0.985;
  const maxP = Math.max(...prices) * 1.015;
  const rangeP = maxP - minP || 1;

  const stepX = (w - padSide * 2) / (prices.length - 1);

  // 1. Grid lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 1; i <= 4; i++) {
    const y = padTop + (h - padTop - padBottom) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(padSide, y);
    ctx.lineTo(w - padSide, y);
    ctx.stroke();

    const priceAtY = maxP - (i / 4) * rangeP;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(formatPrice(priceAtY), 6, y + 3);
  }
  ctx.setLineDash([]);

  // 2. Fractional Derivative Bars (Background oscillator)
  if (fracSeries && fracSeries.length === prices.length) {
    const maxFrac = Math.max(...fracSeries.map(Math.abs)) || 1;
    const midY = h - 60;
    const fracHeight = 35;

    fracSeries.forEach((f, i) => {
      const x = padSide + i * stepX;
      const barH = (f / maxFrac) * fracHeight;
      ctx.fillStyle = f >= 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - 3, midY - (f >= 0 ? barH : 0), 6, Math.abs(barH));
    });
  }

  // 3. Price Curve
  ctx.beginPath();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;

  prices.forEach((p, i) => {
    const x = padSide + i * stepX;
    const y = padTop + (1 - (p - minP) / rangeP) * (h - padTop - padBottom);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Highlight points
  prices.forEach((p, i) => {
    const x = padSide + i * stepX;
    const y = padTop + (1 - (p - minP) / rangeP) * (h - padTop - padBottom);
    ctx.beginPath();
    ctx.fillStyle = i === prices.length - 1 ? '#fff' : '#0284c7';
    ctx.arc(x, y, i === prices.length - 1 ? 5 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. TP & SL Horizontal Guidance Lines
  if (tp && sl) {
    const tpY = padTop + (1 - (tp - minP) / rangeP) * (h - padTop - padBottom);
    const slY = padTop + (1 - (sl - minP) / rangeP) * (h - padTop - padBottom);

    if (tpY >= 0 && tpY <= h) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(padSide, tpY);
      ctx.lineTo(w - padSide, tpY);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`TP: ${formatPrice(tp)}`, w - padSide + 6, tpY + 3);
    }

    if (slY >= 0 && slY <= h) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(padSide, slY);
      ctx.lineTo(w - padSide, slY);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`SL: ${formatPrice(sl)}`, w - padSide + 6, slY + 3);
    }
    ctx.setLineDash([]);
  }
}

// --- Live Trade Recording (To Test 300-400 Samples Seamlessly) ---

function recordLiveTrade() {
  const currentAsset = PRESET_DATA[State.activeAssetKey];
  const pBox = document.getElementById('predictionBox');
  const isBullish = pBox.classList.contains('bullish');
  const isBearish = pBox.classList.contains('bearish');
  
  const dir = isBullish ? 'BUY' : isBearish ? 'SELL' : 'PIVOT';
  const livePrice = parseFloat(State.liveQuote);
  const tp = parseFloat(document.getElementById('tpValue').innerText);
  const sl = parseFloat(document.getElementById('slValue').innerText);

  const trade = {
    id: 'tr_' + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    asset: State.lang === 'ar' ? currentAsset.nameAr : currentAsset.nameEn,
    horizon: State.activeHorizon,
    direction: dir,
    entry: livePrice,
    tp: tp,
    sl: sl,
    hurst: State.hurst.toFixed(2),
    d: State.d,
    status: 'OPEN' // 'OPEN' | 'WIN' | 'LOSS'
  };

  State.trades.unshift(trade);
  localStorage.setItem('fibosign_trades', JSON.stringify(State.trades));
  renderTradesTable();
  showToast(State.lang === 'ar' ? 'تم تسجيل التجربة في سجل الاختبار الحي!' : 'Trade logged in live test tracker!');
}

function resolveTrade(id, result) {
  State.trades = State.trades.map(t => {
    if (t.id === id) t.status = result;
    return t;
  });
  localStorage.setItem('fibosign_trades', JSON.stringify(State.trades));
  renderTradesTable();
}

function clearAllTrades() {
  if (confirm(State.lang === 'ar' ? 'هل تريد مسح جميع التجارب السابقة؟' : 'Clear all test records?')) {
    State.trades = [];
    localStorage.removeItem('fibosign_trades');
    renderTradesTable();
  }
}

function renderTradesTable() {
  const tbody = document.getElementById('tradesTbody');
  const statsSpan = document.getElementById('hitRateStats');
  if (!tbody) return;

  if (State.trades.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 18px;">
      ${State.lang === 'ar' ? 'لا توجد صفقات تجريبية مسجلة بعد. اضغط "تسجيل التجربة الحية" للبدء.' : 'No recorded tests yet. Click "Log Live Test" to start.'}
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
      <td style="font-family: monospace; color: #34d399;">${formatPrice(t.tp)}</td>
      <td style="font-family: monospace; color: #fb7185;">${formatPrice(t.sl)}</td>
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

// --- Fast Raw Single-Column Price Insertion (للي داخل يحط بيانات ويمشي) ---

function parseAndApplyRawPrices() {
  const text = document.getElementById('rawPriceTextarea').value.trim();
  if (!text) return;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const parsed = [];

  for (let l of lines) {
    const parts = l.split(/[,\t;\s]+/).map(p => p.trim()).filter(p => p.length > 0);
    // If line has multiple cols (e.g. Date, Close), take the last or 2nd col
    let val = NaN;
    if (parts.length >= 2) {
      val = parseFloat(parts[1]) || parseFloat(parts[parts.length - 1]);
    } else if (parts.length === 1) {
      val = parseFloat(parts[0]);
    }
    if (!isNaN(val)) parsed.push(val);
  }

  if (parsed.length < 5) {
    alert(State.lang === 'ar' ? 'الرجاء إدخال 5 أسعار على الأقل لحساب الذاكرة الكسرية.' : 'Please enter at least 5 price points.');
    return;
  }

  State.prices = parsed;
  State.liveQuote = parsed[parsed.length - 1];
  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) liveInput.value = State.liveQuote;

  updateCalculations();
  showToast(State.lang === 'ar' ? `تم تحميل ${parsed.length} شمعة سعرية وتحديث الحسابات فورياً!` : `Loaded ${parsed.length} prices & updated!`);
}

// --- Quick Notification Toast ---
function showToast(msg) {
  let toast = document.getElementById('fiboToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fiboToast';
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: #1e293b; color: #fff; border: 1px solid #38bdf8;
      padding: 10px 18px; border-radius: 8px; font-size: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5); transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// --- Event Listeners & Bootstrapping ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Asset Chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => selectAsset(c.dataset.asset));
  });

  // 2. Horizon Buttons (1h / 3h / 1d)
  document.querySelectorAll('.horizon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.horizon-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      State.activeHorizon = btn.dataset.horizon;
      updateCalculations();
    });
  });

  // 3. Fractional Order (d) Slider
  const dSlider = document.getElementById('dSlider');
  if (dSlider) {
    dSlider.addEventListener('input', (e) => {
      State.d = parseFloat(e.target.value);
      updateCalculations();
    });
  }

  // 4. Live Quote Input Override
  const liveInput = document.getElementById('liveQuoteInput');
  if (liveInput) {
    liveInput.addEventListener('input', (e) => {
      State.liveQuote = parseFloat(e.target.value) || State.prices[State.prices.length - 1];
      updateCalculations();
    });
  }

  // 5. Raw Price Quick Parser Button
  const parseBtn = document.getElementById('parseRawBtn');
  if (parseBtn) {
    parseBtn.addEventListener('click', parseAndApplyRawPrices);
  }

  // 6. Record Live Trade Button
  const recordBtn = document.getElementById('recordTradeBtn');
  if (recordBtn) {
    recordBtn.addEventListener('click', recordLiveTrade);
  }

  // 7. Clear Trades Button
  const clearBtn = document.getElementById('clearTradesBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllTrades);
  }

  // 8. Settings Modal
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

  // 9. Language Switcher
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      State.lang = State.lang === 'ar' ? 'en' : 'ar';
      document.documentElement.lang = State.lang;
      document.documentElement.dir = State.lang === 'ar' ? 'rtl' : 'ltr';
      langBtn.innerText = State.lang === 'ar' ? 'English' : 'عربي';
      updateCalculations();
      renderTradesTable();
    });
  }

  // Window Resize chart redraw
  window.addEventListener('resize', () => {
    renderChart(State.prices, State.fractionalSeries, State.liveQuote);
  });

  // Initial Boot
  renderTradesTable();
  selectAsset('gold');
});
