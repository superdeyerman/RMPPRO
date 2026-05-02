import React from 'react';
import { Crown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-[#f5f2ed] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-border text-center">
        <Crown className="text-[#c5a059] w-16 h-16 mx-auto mb-8" />
        <h1 className="text-3xl font-serif tracking-widest uppercase mb-2">Reverencia</h1>
        <h2 className="text-sm tracking-[0.3em] uppercase text-[#c5a059] font-light mb-12">Majestad</h2>
        <p className="text-sm text-gray mb-12 leading-relaxed">
          Bienvenida al Sistema Inteligente Central. Por favor, inicie sesión para acceder a su panel personalizado.
        </p>
        <button 
          onClick={login}
          className="w-full bg-[#1a1a1a] text-white py-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#c5a059] transition-all uppercase text-xs tracking-widest"
        >
          <User className="w-4 h-4" />
          Ingresar con Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
