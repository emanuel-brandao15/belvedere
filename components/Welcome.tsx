import React from 'react';
import Logo from './Logo';
import { AppTab } from '../types';

interface WelcomeProps {
  onStart: (tab: AppTab) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 md:py-16 px-4 flex flex-col items-center text-center space-y-12">
      <div className="space-y-6">
        <Logo className="w-32 h-32 mx-auto drop-shadow-2xl" />
        <h1 className="text-5xl md:text-6xl font-bold text-[#507255]">Belvedere.AI</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Plataforma de análise e inteligência para compra de produtos do agronegócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div 
          onClick={() => onStart(AppTab.DASHBOARD)}
          className="bg-white p-8 rounded-3xl shadow-sm border border-[#6eb257]/30 hover:shadow-xl hover:border-[#488b49]/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#F9FBE7] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#488b49] group-hover:text-white transition-all">
            <i className="fas fa-chart-bar text-[#488b49] text-2xl group-hover:text-white"></i>
          </div>
          <h3 className="text-xl font-bold text-[#507255] mb-3">Visão Analítica</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Monitore produção, indicadores e mapas de densidade.
          </p>
        </div>

        <div 
          onClick={() => onStart(AppTab.PREDICTIVE)}
          className="bg-white p-8 rounded-3xl shadow-sm border border-[#6eb257]/30 hover:shadow-xl hover:border-[#488b49]/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#F9FBE7] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#488b49] group-hover:text-white transition-all">
            <i className="fas fa-brain text-[#488b49] text-2xl group-hover:text-white"></i>
          </div>
          <h3 className="text-xl font-bold text-[#507255] mb-3">Forecasting</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Predições de preços e volumes baseadas em IA.
          </p>
        </div>

        <div 
          onClick={() => onStart(AppTab.SUPPLIERS)}
          className="bg-white p-8 rounded-3xl shadow-sm border border-[#6eb257]/30 hover:shadow-xl hover:border-[#488b49]/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#F9FBE7] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#488b49] group-hover:text-white transition-all">
            <i className="fas fa-money-bill-wave text-[#488b49] text-2xl group-hover:text-white"></i>
          </div>
          <h3 className="text-xl font-bold text-[#507255] mb-3">Fornecedores</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Analise o ranking e o desempenho de parceiros.
          </p>
        </div>
      </div>

      <div className="pt-8">
        <button 
          onClick={() => onStart(AppTab.DASHBOARD)}
          className="bg-[#488b49] text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-[#3a6e3b] shadow-xl hover:shadow-[#488b49]/20 transition-all flex items-center gap-3"
        >
          <span>Acessar Painel Estratégico</span>
          <i className="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default Welcome;