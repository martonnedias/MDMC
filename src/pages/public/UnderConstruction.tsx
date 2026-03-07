import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Settings, Lock, Mail } from 'lucide-react';

const UnderConstruction: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center relative overflow-hidden">
            <Helmet>
                <title>Em Construção | MD Solution Marketing</title>
                <meta name="description" content="Estamos atualizando nossa plataforma de negócios para melhor atendê-los." />
            </Helmet>

            {/* Grid Background Effect */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Glow Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[100px] z-0 pointer-events-none fade-in"></div>

            <div className="z-10 text-center max-w-2xl px-6 relative">
                <div className="mx-auto w-24 h-24 mb-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,82,255,0.3)] fade-in" style={{ animationDelay: '0.1s' }}>
                    <Settings className="w-12 h-12 text-brand-blue animate-[spin_10s_linear_infinite]" />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight fade-in" style={{ animationDelay: '0.2s' }}>
                    Evoluindo nossa <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-teal-400">Inteligência Digital</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed fade-in" style={{ animationDelay: '0.3s' }}>
                    A MD Solution Marketing e Consultoria está passando por uma atualização estrutural profunda. Voltaremos com uma plataforma inédita focada 100% no aumento do seu faturamento empresarial.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in" style={{ animationDelay: '0.4s' }}>
                    <a href="mailto:contato@mdsolution.com.br" className="px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-full font-bold transition-all duration-300 flex items-center shadow-[0_0_20px_rgba(0,82,255,0.4)]">
                        <Mail className="w-5 h-5 mr-2" />
                        Falar com Especialista
                    </a>
                </div>
            </div>

            {/* Secret Admin Door */}
            <div className="absolute bottom-6 w-full text-center z-10 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <Link to="/acesso" className="inline-flex items-center text-sm text-slate-400 hover:text-white pb-1 group">
                    <Lock className="w-3 h-3 mr-2 group-hover:text-brand-blue transition-colors" />
                    Acesso Restrito
                </Link>
            </div>
        </div>
    );
};

export default UnderConstruction;
