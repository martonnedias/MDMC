import React from 'react';
import { ShieldCheck, Lock, Award, CheckCircle2, Server } from 'lucide-react';

const TrustSeals: React.FC = () => {
    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-300">

                    {/* SSL / Security */}
                    <div className="flex items-center gap-3 group cursor-help" title="Conexão criptografada de ponta a ponta">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-green-500 group-hover:text-green-600 transition-colors">
                            <Lock size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-600 transition-colors">Site Seguro</p>
                            <p className="text-xs font-bold text-slate-600">Certificado SSL 256-bit</p>
                        </div>
                    </div>

                    {/* LGPD */}
                    <div className="flex items-center gap-3 group cursor-help" title="Respeitamos seus dados conforme a Lei Geral de Proteção de Dados">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-brand-blue group-hover:text-brand-blue transition-colors">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-blue transition-colors">Privacidade</p>
                            <p className="text-xs font-bold text-slate-600">Compliance LGPD</p>
                        </div>
                    </div>

                    {/* Google Safe Browsing */}
                    <div className="flex items-center gap-3 group cursor-help" title="Verificado pelo Google Safe Browsing">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-red-500 group-hover:text-red-500 transition-colors">
                            <CheckCircle2 size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500 transition-colors">Verificado</p>
                            <p className="text-xs font-bold text-slate-600">Google Safe Browsing</p>
                        </div>
                    </div>

                    {/* Technology */}
                    <div className="flex items-center gap-3 group cursor-help" title="Hospedado em servidores de alta performance">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-purple-500 group-hover:text-purple-500 transition-colors">
                            <Server size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-purple-500 transition-colors">Infraestrutura</p>
                            <p className="text-xs font-bold text-slate-600">AWS Cloud Server</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustSeals;
