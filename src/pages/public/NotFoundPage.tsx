import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
                    <Ghost size={120} className="mx-auto text-blue-500 animate-bounce" strokeWidth={1} />
                </div>

                <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold text-gray-200 mb-4 tracking-tight">Página não encontrada</h2>

                <p className="text-gray-400 mb-10 leading-relaxed">
                    Parece que você se perdeu no labirinto estratégico.
                    A página que você procura foi movida ou nunca existiu.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Home size={18} />
                        Voltar para Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Voltar anterior
                    </button>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-900">
                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.2em]">
                        MD Solution • Strategic Intelligence
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
