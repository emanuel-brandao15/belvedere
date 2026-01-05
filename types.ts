
export enum AppTab {
  WELCOME = 'welcome',
  DASHBOARD = 'dashboard',
  PREDICTIVE = 'predictive',
  SUPPLIERS = 'suppliers'
}

export interface MilkDataPoint {
  region: string;
  volume: number;
  price: number;
  quality: number;
  timestamp: string;
}

export interface PredictionResult {
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  analysis: string;
  risks: string[];
}

export interface SupplierInfo {
  id: string;
  name: string;
  location: string;
  capacity: number;
  score: number;
}