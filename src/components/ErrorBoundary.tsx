import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorInfo: null };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.message };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      let displayError = "Se ha producido un error inesperado.";
      try {
        const parsed = JSON.parse(this.state.errorInfo || '{}');
        if (parsed.error && parsed.error.includes('insufficient permissions')) {
          displayError = "No tiene permisos suficientes para realizar esta acción o ver estos datos.";
        }
      } catch (e) {}

      return (
        <div className="min-h-screen bg-beige flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-red-100 text-center">
            <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-8" />
            <h2 className="text-xl font-display uppercase tracking-widest mb-4">Error de Sistema</h2>
            <p className="text-sm text-gray mb-8 leading-relaxed">
              {displayError}
            </p>
            <div className="text-[10px] text-red-400 bg-red-50 p-4 rounded-2xl mb-8 font-mono break-all overflow-hidden max-h-32">
              {this.state.errorInfo}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full btn-premium py-4"
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
