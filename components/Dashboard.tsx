import React, { useState } from 'react';
import MilkPriceDashboard from './MilkPriceDashboard';
import AgroProductsDashboard from './AgroProductsDashboard';

type SubTab = 'milk' | 'agro';

const Dashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('milk');

  const SubTabButton: React.FC<{ tab: SubTab; label: string }> = ({ tab, label }) => {
    const isActive = activeSubTab === tab;
    return (
      <button
        onClick={() => setActiveSubTab(tab)}
        className={`px-6 py-3 text-sm font-bold transition-all focus:outline-none ${
          isActive
            ? 'text-[#488b49] border-b-2 border-[#c5e063]'
            : 'text-gray-400 hover:text-[#507255]'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#507255]">Visão Analítica</h2>
          <p className="text-gray-500">Dados integrados da Base de Dados - Sincronizado em 05/01/2025 às 01:00</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-[#6eb257] px-4 py-2 rounded-xl text-sm text-[#507255] hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <i className="fas fa-download"></i> Exportar
          </button>
          <button className="bg-[#488b49] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#3a6e3b] flex items-center gap-2 shadow-md">
            <i className="fas fa-sync"></i> Atualizar
          </button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#6eb257]/30">
        <div className="flex items-center border-b border-gray-100">
          <SubTabButton tab="milk" label="Preço do Leite" />
          <SubTabButton tab="agro" label="Preços do Agronegócio" />
        </div>
        <div className="p-4 md:p-6">
          {activeSubTab === 'milk' && <MilkPriceDashboard />}
          {activeSubTab === 'agro' && <AgroProductsDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
