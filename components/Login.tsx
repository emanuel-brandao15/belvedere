import React, { useState } from 'react';
import Logo from './Logo';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // Simple validation for simulation
      if (email && password) {
        onLoginSuccess();
      } else {
        setError('Por favor, preencha todos os campos.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FBE7] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#6eb257]/30 text-center animate-in fade-in zoom-in-95 duration-500">
          <Logo className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#507255] mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-500 mb-8">Acesse sua conta para continuar.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-[#488b49] focus:border-[#488b49] outline-none"
                placeholder="seu.email@empresa.com"
              />
            </div>
            
            <div>
              <label htmlFor="password"  className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-100 bg-gray-50 rounded-xl p-3 text-sm text-black focus:ring-[#488b49] focus:border-[#488b49] outline-none"
                placeholder="********"
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#488b49] text-white py-4 rounded-2xl font-bold hover:bg-[#3a6e3b] shadow-lg shadow-[#488b49]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Entrando...
                </>
              ) : (
                <>
                  Entrar na Plataforma
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-8">
            Esqueceu sua senha? <a href="#" className="font-bold text-[#488b49] hover:underline">Recuperar</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
