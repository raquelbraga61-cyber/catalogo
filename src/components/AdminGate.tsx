import React, { useState } from 'react';
import { Lock, ShieldAlert, Key, ArrowRight, User } from 'lucide-react';

interface AdminGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminGate({ onSuccess, onCancel }: AdminGateProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'sacolao online' && password === '2026sacolao.R.B') {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      // Clean password field on error
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl border border-[#bfc9bc]/30 shadow-md p-8 md:p-10 space-y-6">
        
        {/* Header decoration */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-[#176c33]/10 rounded-full flex items-center justify-center text-[#176c33] shadow-inner">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Painel Administrativo
            </h2>
            <p className="text-xs text-[#707a6e] mt-1">
              Este painel de gestão é restrito apenas a administradores da loja.
            </p>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#40493f] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#176c33]" />
              Usuário de Acesso
            </label>
            <div className="relative">
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Insira o usuário de gerente..."
                className={`w-full h-12 px-4 bg-[#f7fbf2] border rounded-full text-sm font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none transition-all ${
                  error ? 'border-red-500 bg-red-50/50 focus:ring-red-500' : 'border-[#bfc9bc]/40'
                }`}
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#40493f] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#176c33]" />
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Insira a senha de gerente..."
                className={`w-full h-12 px-4 bg-[#f7fbf2] border rounded-full text-sm font-semibold text-[#181d18] focus:ring-2 focus:ring-[#176c33] focus:outline-none transition-all ${
                  error ? 'border-red-500 bg-red-50/50 focus:ring-red-500' : 'border-[#bfc9bc]/40'
                }`}
              />
            </div>
            
            {error && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1 animate-shake">
                <ShieldAlert className="w-3.5 h-3.5" />
                Usuário ou senha incorretos. Tente novamente!
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-[#40493f] rounded-full text-xs font-bold transition-all cursor-pointer"
            >
              Voltar ao Início
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#176c33] hover:bg-[#115326] text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#176c33]/15 cursor-pointer hover:shadow-lg active:scale-95"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
