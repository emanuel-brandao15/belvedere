import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LabelList
} from 'recharts';
import { rawMilkPriceData } from '../constants';

const stateColors: { [key: string]: string } = {
  RS: '#197134', SC: '#488b49', PR: '#6eb257', SP: '#9acd32', MG: '#c5e063',
  GO: '#d2ac31', BA: '#dbb876', ES: '#6d3617', MS: '#a0522d', RJ: '#8b4513'
};


const MilkPriceDashboard: React.FC = () => {
  const allStates = useMemo(() => [...new Set(rawMilkPriceData.map(d => d.estado).filter(s => s && s.trim() !== ''))].sort(), []);
  const [selectedState, setSelectedState] = useState<string>(allStates[0] || '');

  const { kpis, evolutionData, averagePriceByState, averagePriceByYear } = useMemo(() => {
    // 1. Find the latest date from the raw data
    const latestDateTime = rawMilkPriceData.reduce((max, d) => {
      const [day, month, year] = d.data.split('-').map(Number);
      const currentDate = new Date(year, month - 1, day).getTime();
      return currentDate > max ? currentDate : max;
    }, 0);
    const latestDateObj = new Date(latestDateTime);
    const latestDateString = `${String(latestDateObj.getDate()).padStart(2, '0')}-${String(latestDateObj.getMonth() + 1).padStart(2, '0')}-${latestDateObj.getFullYear()}`;
    
    // 2. Filter data for KPIs based on the latest date
    const latestPricesData = rawMilkPriceData
        .filter(d => d.data === latestDateString && d.preco_leite_produtor > 0);

    const nationalAverage = latestPricesData.reduce((sum, item) => sum + item.preco_leite_produtor, 0) / (latestPricesData.length || 1);

    const allPrices = rawMilkPriceData.filter(d => d.preco_leite_produtor > 0).map(d => d.preco_leite_produtor);
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

    const kpiValues = {
        average: nationalAverage,
        max: maxPrice,
        min: minPrice,
        states: latestPricesData.length,
    };
    
    // 3. Prepare data for Evolution Chart (for selected state)
    const evolutionChartData = rawMilkPriceData
      .filter(d => d.estado === selectedState && d.preco_leite_produtor > 0)
      .map(item => {
        const [day, month, year] = item.data.split('-');
        return {
          date: new Date(Number(year), Number(month) - 1, Number(day)),
          name: new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit'}),
          "Preço": item.preco_leite_produtor
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // 4. Prepare data for Average Price by State Chart
    const statePriceData: { [key: string]: { sum: number, count: number } } = {};
    rawMilkPriceData.forEach(d => {
      if (d.preco_leite_produtor > 0) {
        if (!statePriceData[d.estado]) {
          statePriceData[d.estado] = { sum: 0, count: 0 };
        }
        statePriceData[d.estado].sum += d.preco_leite_produtor;
        statePriceData[d.estado].count++;
      }
    });
    const avgPriceByState = Object.keys(statePriceData)
      .map(estado => ({
        estado,
        "Preço Médio": statePriceData[estado].sum / statePriceData[estado].count
      }))
      .sort((a, b) => a["Preço Médio"] - b["Preço Médio"]);

    // 5. Prepare data for Average Price by Year Chart
    const yearPriceData: { [key: string]: { sum: number, count: number } } = {};
    rawMilkPriceData.forEach(d => {
      if (d.preco_leite_produtor > 0) {
        const year = d.data.split('-')[2];
        if (!yearPriceData[year]) {
          yearPriceData[year] = { sum: 0, count: 0 };
        }
        yearPriceData[year].sum += d.preco_leite_produtor;
        yearPriceData[year].count++;
      }
    });
    const avgPriceByYear = Object.keys(yearPriceData)
      .map(year => ({
        year,
        "Preço Médio": yearPriceData[year].sum / yearPriceData[year].count
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    return { 
        kpis: kpiValues,
        evolutionData: evolutionChartData,
        averagePriceByState: avgPriceByState,
        averagePriceByYear: avgPriceByYear
    };
  }, [selectedState]);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBox title="Preço Médio Nacional (último mês)" value={`R$ ${kpis.average.toFixed(2)}`} />
        <KPIBox title="Maior Preço Registrado" value={`R$ ${kpis.max.toFixed(2)}`} />
        <KPIBox title="Menor Preço Registrado" value={`R$ ${kpis.min.toFixed(2)}`} />
        <KPIBox title="Estados com Registro (última data)" value={kpis.states.toString()} />
      </div>

      {/* Evolution Chart */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h3 className="font-bold text-[#507255]">Evolução do Preço do Leite por Estado (R$/L)</h3>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full sm:w-auto border-gray-200 bg-white rounded-lg p-2 text-sm text-gray-700 focus:ring-[#488b49] focus:border-[#488b49] outline-none shadow-sm"
          >
            {allStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={['dataMin - 0.1', 'dataMax + 0.1']} tickFormatter={(value) => `R$${Number(value).toFixed(2)}`} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="Preço" name={`Preço em ${selectedState}`} stroke={stateColors[selectedState] || '#197134'} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-[#507255] mb-6">Preço médio do leite nos Estados do Brasil (R$/L)</h3>
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={averagePriceByState} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0"/>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="estado" width={40} tick={{ fill: '#374151', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `R$ ${value.toFixed(2)}`}/>
                    <Bar dataKey="Preço Médio" fill="#d2ac31" barSize={15} radius={[0, 10, 10, 0]}>
                       <LabelList 
                          dataKey="Preço Médio" 
                          position="right" 
                          formatter={(value: number) => `R$${value.toFixed(2)}`}
                          style={{ fill: '#a0522d', fontSize: 11, fontWeight: 500 }}
                       />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-[#507255] mb-6">Preço médio do leite ao longo dos anos (R$/L)</h3>
          <div className="h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={averagePriceByYear} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                    <XAxis dataKey="year" tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }}/>
                    <YAxis tickFormatter={(value) => `R$${Number(value).toFixed(2)}`} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => `R$ ${value.toFixed(2)}`}/>
                    <Bar dataKey="Preço Médio" fill="#488b49" barSize={40} radius={[10, 10, 0, 0]}>
                      <LabelList 
                        dataKey="Preço Médio" 
                        position="top" 
                        formatter={(value: number) => value.toFixed(2)}
                        style={{ fill: '#507255', fontSize: 11, fontWeight: 'bold' }}
                        offset={8}
                      />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};


const KPIBox: React.FC<{title: string, value: string}> = ({title, value}) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-xs font-medium truncate">{title}</p>
        <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold text-[#507255]">{value}</span>
        </div>
    </div>
)

export default MilkPriceDashboard;