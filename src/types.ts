export interface MarketBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  eventNote?: string;
}

export interface FractionalResultPoint {
  date: string;
  originalPrice: number;
  fractionalValue: number;
  stationaryScore: number;
  hurstExponent: number;
  regime: 'persistent' | 'random_walk' | 'mean_reverting';
  memoryStressIndex: number;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
  signalReason?: string;
}

export type AssetCategory = 'all' | 'metal' | 'egx' | 'forex' | 'nft' | 'otc';

export interface Instrument {
  id: string;
  name: string;
  nameAr: string;
  symbol: string;
  category: 'metal' | 'egx' | 'forex' | 'nft' | 'otc';
  currency: string;
  description: string;
  descriptionAr: string;
  historicalContext: string;
  historicalContextAr: string;
  data: MarketBar[];
}

export interface BacktestTrade {
  index: number;
  date: string;
  predictedDirection: 'UP' | 'DOWN';
  entryPrice: number;
  exitPrice: number;
  actualReturnPct: number;
  isCorrect: boolean;
  hurstAtEntry: number;
  fracDiffAtEntry: number;
  confidenceScore: number; // 0 - 100%
  rationaleAr: string;
  rationaleEn: string;
}

export interface BacktestSummary {
  cutoffIndex: number;
  cutoffDate: string;
  totalPredictions: number;
  successfulPredictions: number;
  hitRatePct: number; // e.g., 78.6%
  profitFactor: number; // e.g., 2.35
  cumulativeReturnPct: number; // e.g., +44.2%
  maxDrawdownPct: number; // e.g., -6.8%
  trades: BacktestTrade[];
}

export interface FractionalConfig {
  orderD: number;          // Fractional differentiation order, e.g., 0.40
  weightThreshold: number; // Cutoff threshold for weights, e.g. 1e-4
  hurstWindow: number;     // Window size for rolling Hurst calculation, e.g. 30
  autoOptimalD: boolean;   // Automatically search for minimum d with stationary p-value < 0.05
}

export interface MemoryKernelWeight {
  lag: number;
  weight: number;
  absWeight: number;
  cumulativeImpact: number;
}

export interface QuantitativeMetrics {
  currentD: number;
  optimalD: number;
  memoryRetentionPct: number; // e.g., 88.4%
  stationarityPValue: number; // ADF test p-value proxy
  isStationary: boolean;
  currentHurst: number;
  hurstRegime: 'persistent' | 'random_walk' | 'mean_reverting';
  memoryDecayHalfLifeBars: number;
  criticalResonanceRisk: number; // 0 to 100%
  expectedEdgePct: number; // realistic theoretical statistical edge
}
