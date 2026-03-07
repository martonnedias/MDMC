import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// React Error Boundaries MUST be class components (React limitation)
// Using explicit constructor + super pattern for maximum TS compatibility
export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('[ErrorBoundary] Erro capturado:', error, errorInfo);
    }

    render(): React.ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }

        const title = this.props.fallbackTitle || 'Algo deu errado';
        const errorMessage = this.state.error?.message || 'Erro desconhecido';

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
                        <AlertTriangle className="text-red-400" size={36} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-3">{title}</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                            Encontramos um problema inesperado. Tente recarregar a página ou volte para a tela inicial.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Detalhes técnicos</p>
                        <code className="text-xs text-red-400 font-mono break-all">{errorMessage}</code>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                            title="Recarregar página"
                        >
                            <RefreshCw size={16} /> Recarregar
                        </button>
                        <button
                            onClick={() => { window.location.href = '/'; }}
                            className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
                            title="Voltar para a página inicial"
                        >
                            <Home size={16} /> Início
                        </button>
                    </div>

                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        MD Solution • Suporte Técnico
                    </p>
                </div>
            </div>
        );
    }
}
