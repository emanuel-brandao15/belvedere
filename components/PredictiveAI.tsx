import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  BarChart, Bar, LabelList, ReferenceLine
} from 'recharts';
import { rawMilkPriceData } from '../constants';

// FIX: Added optional 'date' property to allow sorting of historical data and access to the last date for predictions.
interface ForecastDataPoint {
  name: string;
  historicalPrice?: number | null;
  predictedPrice?: number | null;
  date?: Date;
}

interface FeatureImportance {
  name: string;
  importance: number;
}

interface PredictionResult {
  forecastData: ForecastDataPoint[];
  featureImportance: FeatureImportance[];
  lastHistoricalDate: string;
}

const PredictiveAI: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    months: 3,
    volume: 50000,
    season: 'Entressafra'
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 1. Process historical data to get national average per month
    const monthlyAverages: { [key: string]: { sum: number, count: number, date: Date } } = {};
    rawMilkPriceData.forEach(item => {
      if(item.preco_leite_produtor > 0) {
        const [day, month, year] = item.data.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        const key = `${year}-${String(month).padStart(2, '0')}`;
        
        if (!monthlyAverages[key]) {
          monthlyAverages[key] = { sum: 0, count: 0, date: date };
        }
        monthlyAverages[key].sum += item.preco_leite_produtor;
        monthlyAverages[key].count++;
      }
    });

    const historicalData: ForecastDataPoint[] = Object.keys(monthlyAverages)
      .map(key => ({
        date: monthlyAverages[key].date,
        name: monthlyAverages[key].date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        historicalPrice: monthlyAverages[key].sum / monthlyAverages[key].count,
        predictedPrice: null,
      }))
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    // 2. Simulate prediction
    const lastHistoricalPoint = historicalData[historicalData.length - 1];
    let lastPrice = lastHistoricalPoint.historicalPrice || 0;
    const lastDate = lastHistoricalPoint.date!;
    
    const predictedData: ForecastDataPoint[] = [];
    for (let i = 1; i <= formData.months; i++) {
        const newDate = new Date(lastDate);
        newDate.setMonth(newDate.getMonth() + i);
        
        // Simple simulation: +2% per month
        const newPrice = lastPrice * Math.pow(1.02, i);

        predictedData.push({
            name: newDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            historicalPrice: null,
            predictedPrice: newPrice,
        });
    }

    // 3. Combine data for chart
    const fullForecastData = [...historicalData, ...predictedData];
    
    // 4. Simulate feature importance
    const featureImportance = [
        { name: 'Custo da Ração', importance: 45 },
        { name: 'Câmbio (Dólar)', importance: 25 },
        { name: 'Clima', importance: 15 },
        { name: 'Demanda Interna', importance: 10 },
        { name: 'Exportações', importance: 5 },
    ].sort((a, b) => a.importance - b.importance);

    setPrediction({
        forecastData: fullForecastData,
        featureImportance: featureImportance,
        lastHistoricalDate: lastHistoricalPoint.name,
    });

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#507255]">Forecasting</h2>
          <p className="text-gray-500">Projeção de preços do leite para os próximos meses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handlePredict} className="bg-white p-6 rounded-3xl shadow-sm border border-[#6eb257]/40 space-y-6 sticky top-8">
            <h3 className="font-bold text-lg text-center text-[#507255]">Parâmetros da Previsão</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Período de Previsão</label>
                <select 
                  value={formData.months}
                  onChange={(e) => setFormData({...formData, months: Number(e.target.value)})}
                  className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-[#488b49] focus:border-[#488b49] outline-none"
                >
                  <option value={1}>1 Mês</option>
                  <option value={3}>3 Meses</option>
                  <option value={6}>6 Meses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Volume de Compra (L)</label>
                <input 
                  type="number" 
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: Number(e.target.value)})}
                  className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-[#488b49] focus:border-[#488b49] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sazonalidade</label>
                <select 
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-[#488b49] focus:border-[#488b49] outline-none"
                >
                  <option>Safra</option>
                  <option>Entressafra</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#488b49] text-white py-4 rounded-2xl font-bold hover:bg-[#3a6e3b] shadow-lg shadow-[#488b49]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processando...
                </>
              ) : (
                "Gerar previsão"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-9">
          {prediction ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#6eb257]/40 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="font-bold text-[#507255] mb-6">Projeção de Preço do Leite (R$/L)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prediction.forecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={['dataMin - 0.1', 'dataMax + 0.1']} tickFormatter={(value) => `R$${Number(value).toFixed(2)}`} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                      <Legend />
                      <ReferenceLine x={prediction.lastHistoricalDate} stroke="#d946ef" strokeDasharray="4 4" label={{ value: 'Início da Previsão', position: 'insideTopRight', fill: '#d946ef', fontSize: 10 }} />
                      <Line type="monotone" dataKey="historicalPrice" name="Preço Histórico" stroke="#507255" strokeWidth={3} dot={false} connectNulls />
                      <Line type="monotone" dataKey="predictedPrice" name="Previsão" stroke="#c5e063" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#6eb257]/40 animate-in fade-in slide-in-from-right-4 duration-700">
                <h3 className="font-bold text-[#507255] mb-6">Fatores de Influência na Variação de Preço (Simulado)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prediction.featureImportance} layout="vertical" margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#374151', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `${value}%`} />
                      <Bar dataKey="importance" fill="#488b49" barSize={20} radius={[0, 10, 10, 0]}>
                        <LabelList 
                          dataKey="importance" 
                          position="right" 
                          formatter={(value: number) => `${value}%`}
                          style={{ fill: '#507255', fontSize: 12, fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/40 border-2 border-dashed border-[#6eb257]/40 rounded-3xl flex flex-col items-center justify-center p-20 text-center h-full">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 rotate-3">
                <i className="fas fa-microchip text-[#c5e063] text-3xl"></i>
              </div>
              <h4 className="text-[#507255] font-bold text-lg mb-2">Motor Inativo</h4>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Configure os parâmetros ao lado para gerar uma nova projeção de mercado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAI;
