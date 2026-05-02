import React from 'react';
import { Crown } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
    <Crown className="text-[#c5a059] w-12 h-12 animate-pulse mb-4" />
    <p className="text-[#c5a059] text-[10px] uppercase tracking-[0.3em]">Cargando Ecosistema...</p>
  </div>
);

export default LoadingScreen;
