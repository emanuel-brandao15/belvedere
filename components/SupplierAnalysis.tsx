import React from 'react';

const SupplierAnalysis: React.FC = () => {
  const suppliers = [
    { id: 34491, name: 'Cooperativa Sul-Leite', region: 'PR', quality: 94, volume: '120k', price: 2.31, rating: 4.8 },
    { id: 93008, name: 'Fazenda Boa Vista', region: 'MG', quality: 89, volume: '45k', price: 2.28, rating: 4.2 },
    { id: 34542, name: 'Laticínios Horizonte', region: 'SC', quality: 96, volume: '210k', price: 2.35, rating: 4.9 },
    { id: 93044, name: 'Fazenda Imperial Goiana', region: 'GO', quality: 82, volume: '88k', price: 2.15, rating: 3.5 },
    { id: 35030, name: 'Bovinos e Suínos Medley S.A', region: 'GO', quality: 91, volume: '150k', price: 2.30, rating: 4.5 },
    { id: 10023, name: 'Fazenda Conceição Gonçalves', region: 'SP', quality: 91, volume: '80k', price: 2.55, rating: 3.9 },
    { id: 17209, name: 'Melves Produção Laticínios', region: 'SP', quality: 91, volume: '150k', price: 2.53, rating: 4.7 },
    { id: 91221, name: 'Fazenda Barretos', region: 'MG', quality: 91, volume: '300k', price: 2.11, rating: 4.9 },
    { id: 91099, name: 'Chacára dos Anjos', region: 'MG', quality: 91, volume: '12k', price: 2.72, rating: 3.4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#507255]">Fornecedores</h2>
          <p className="text-gray-500">Gestão de parceiros logísticos</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
            <input 
              type="text" 
              placeholder="Buscar parceiro..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-[#6eb257]/40 rounded-xl text-sm text-black placeholder:text-gray-500 focus:ring-[#488b49] focus:border-[#488b49] outline-none shadow-sm min-w-[240px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#6eb257]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F9FBE7] border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-[#507255] uppercase tracking-widest">Fornecedor</th>
                <th className="px-6 py-5 text-xs font-bold text-[#507255] uppercase tracking-widest text-center">UF</th>
                <th className="px-6 py-5 text-xs font-bold text-[#507255] uppercase tracking-widest">Volume de Leite/Mês</th>
                <th className="px-6 py-5 text-xs font-bold text-[#507255] uppercase tracking-widest">Último preço praticado</th>
                <th className="px-6 py-5 text-xs font-bold text-[#507255] uppercase tracking-widest relative group">
                  <div className="flex items-center gap-1 cursor-help">
                    <span>Score</span>
                    <i className="fas fa-info-circle text-gray-300"></i>
                  </div>
                  <div className="absolute top-full left-0 mt-2 w-max max-w-xs p-3 bg-white text-black text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 border border-gray-200 text-left normal-case font-medium">
                    O score é calculado com base na análise histórica da empresa como nossa fornecedora.
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-[#F9FBE7]/80 transition-all group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-[#507255] group-hover:text-[#488b49]">{s.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">SAP_UID_{s.id}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{s.region}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">{s.volume} L</td>
                  <td className="px-6 py-5 text-sm font-bold text-[#488b49]">R$ {s.price.toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <i className="fas fa-star text-[#c5e063] text-xs"></i>
                      <span className="text-sm font-black text-gray-800">{s.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalysis;