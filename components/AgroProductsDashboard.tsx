import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  AreaChart, Area 
} from 'recharts';
import { agroProductsData } from '../constants';

const AgroProductsDashboard: React.FC = () => {
    
  const { chartData, kpis } = useMemo(() => {
    const latestData = agroProductsData[agroProductsData.length - 1];
    const kpiValues = {
      dolar: latestData?.Dolar || 0,
      boi: latestData?.valor_boigordo || 0,
    };
    
    // FIX: The data has month information in the 'day' part of the string.
    const formattedChartData = agroProductsData.map(d => {
        const [year, _ , month] = d.data.split('-');
        const correctDate = new Date(Number(year), Number(month) - 1, 1);
        return {
            ...d,
            dateFormatted: correctDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        }
    });

    return { chartData: formattedChartData, kpis: kpiValues };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPIBox title="Cotação do Dólar (hoje)" value={`R$ ${kpis.dolar.toFixed(2)}`} />
        <KPIBox title="Valor do Boi Gordo (hoje)" value={`R$ ${kpis.boi.toFixed(2)}`} />
      </div>

      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-[#507255] mb-6">Correlação: Boi Gordo e Dólar</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="dateFormatted" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis yAxisId="left" label={{ value: 'Preço (R$)', angle: -90, position: 'insideLeft', fill: '#507255', fontSize: 12 }} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Dólar (R$)', angle: 90, position: 'insideRight', fill: '#d2ac31', fontSize: 12 }} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="valor_boigordo" name="Boi Gordo" stroke="#6d3617" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="Dolar" name="Dólar" stroke="#d2ac31" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

       <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
        <h3 className="font-bold text-[#507255] mb-6">Composição do Índice Geral de Preços do Agronegócio</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
               <defs>
                <linearGradient id="colorGraos" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c5e063" stopOpacity={0.8}/><stop offset="95%" stopColor="#c5e063" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorPecuaria" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6d3617" stopOpacity={0.8}/><stop offset="95%" stopColor="#6d3617" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorHortifruti" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#488b49" stopOpacity={0.8}/><stop offset="95%" stopColor="#488b49" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorCanaCafe" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d2ac31" stopOpacity={0.8}/><stop offset="95%" stopColor="#d2ac31" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
              <XAxis dataKey="dateFormatted" tick={{ fill: '#9CA3AF', fontSize: 12 }}/>
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="indice_precos_graos" name="Grãos" stackId="1" stroke="#c5e063" fill="url(#colorGraos)" />
              <Area type="monotone" dataKey="indice_precos_pecuaria" name="Pecuária" stackId="1" stroke="#6d3617" fill="url(#colorPecuaria)" />
              <Area type="monotone" dataKey="indice_precos_hortifruti" name="Hortifruti" stackId="1" stroke="#488b49" fill="url(#colorHortifruti)" />
              <Area type="monotone" dataKey="indice_precos_canacafe" name="Cana & Café" stackId="1" stroke="#d2ac31" fill="url(#colorCanaCafe)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const KPIBox: React.FC<{title: string, value: string, isPositive?: boolean}> = ({title, value, isPositive}) => {
    const colorClass = isPositive === undefined ? 'text-[#507255]' : isPositive ? 'text-[#488b49]' : 'text-red-500';
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs font-medium truncate">{title}</p>
            <div className="flex items-end gap-2 mt-1">
                <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
            </div>
        </div>
    )
}

export default AgroProductsDashboard;
