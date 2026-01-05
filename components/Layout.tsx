import React, { useState } from 'react';
import { AppTab } from '../types';
import Logo from './Logo';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ tab, label, icon }: { tab: AppTab; label: string; icon: string }) => (
    <button 
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-6 py-4 transition-all border-r-4 ${
        activeTab === tab 
          ? 'bg-[#488b49]/10 text-[#488b49] border-[#c5e063] font-bold' 
          : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-[#488b49]'
      }`}
    >
      <i className={`fas ${icon} w-6`}></i>
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9FBE7]">
      {/* Mobile Header */}
      <header className="md:hidden bg-[#488b49] text-white p-4 flex items-center justify-between sticky top-0 z-[60] shadow-md">
        <div className="flex items-center space-x-2" onClick={() => setActiveTab(AppTab.WELCOME)}>
          <div className="bg-white p-1 rounded-md">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg">Belvedere.AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#6eb257]/30 shadow-2xl transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div 
            className="p-8 flex flex-col items-center cursor-pointer border-b border-gray-50"
            onClick={() => {
              setActiveTab(AppTab.WELCOME);
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="bg-[#F9FBE7] p-3 rounded-2xl mb-4 shadow-inner">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold text-[#507255] tracking-tight">Belvedere.AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <NavItem tab={AppTab.WELCOME} label="Início" icon="fa-home" />
            <NavItem tab={AppTab.DASHBOARD} label="Visão Analítica" icon="fa-chart-bar" />
            <NavItem tab={AppTab.PREDICTIVE} label="Forecasting" icon="fa-brain" />
            <NavItem tab={AppTab.SUPPLIERS} label="Fornecedores" icon="fa-money-bill-wave" />
          </nav>

          {/* User Profile Info */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#c5e063] overflow-hidden">
                <img src="https://picsum.photos/seed/farmer/100/100" alt="User" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Emanuel Brandão</p>
                <p className="text-[10px] text-gray-400">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Updated Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-6 px-8 text-center text-gray-400 text-sm">
          <div className="container mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="font-bold text-gray-500">Belvedere.AI</span>
              <span className="mx-2">|</span>
              2026 - Plataforma de inteligência para o agronegócio
            </div>
            <div className="bg-[#6eb257]/10 border border-[#6eb257]/20 p-3 rounded-lg max-w-2xl mx-auto flex items-start gap-3 text-left shadow-sm">
              <i className="fas fa-shield-alt text-[#488b49] mt-1"></i>
              <p className="text-[11px] text-[#507255] leading-tight">
                <strong>VALIDAÇÃO OBRIGATÓRIA:</strong> As respostas e análises geradas na plataforma são feitas por uma IA e devem ser utilizadas como ferramentas de apoio. 
                Os resultados devem ser <strong>sempre checados e validados por um humano</strong> antes de decisões estratégicas.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
