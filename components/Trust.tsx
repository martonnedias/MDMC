import React from 'react';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { TRUST_CONTENT } from '../constants';

const icons = [ShieldCheck, Users, HeartHandshake];

const Trust: React.FC = () => {
    return (
        <section id="sobre" className="py-24 lg:py-40 bg-brand-blueLight/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 text-brand-darkBlue uppercase tracking-tighter">
                        {TRUST_CONTENT.title}
                    </h2>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                        {TRUST_CONTENT.text1}
                    </p>
                    <p className="text-xl text-brand-blue leading-relaxed font-black italic">
                        {TRUST_CONTENT.text2}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {TRUST_CONTENT.points.map((item, index) => {
                        const Icon = icons[index % icons.length];
                        return (
                            <div key={index} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden hover:scale-[1.02] flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-slate-50 text-brand-orange rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-sm">
                                    <Icon size={32} />
                                </div>
                                <h3 className="font-heading font-black text-xl mb-4 text-brand-darkBlue uppercase tracking-tighter">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{item.text}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Mini Manifesto */}
                <div className="bg-brand-blue p-12 lg:p-20 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="text-2xl md:text-3xl font-heading font-bold italic mb-10 leading-relaxed">
                            {TRUST_CONTENT.manifesto}
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-1 bg-brand-orange rounded-full mb-4"></div>
                            <p className="font-black text-brand-orange text-xl uppercase tracking-widest">— Equipe MD Solution</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Trust;