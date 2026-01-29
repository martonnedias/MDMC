import React from 'react';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { TRUST_CONTENT } from '../constants';

const icons = [ShieldCheck, Users, HeartHandshake];

const Trust: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900">
                {TRUST_CONTENT.title}
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {TRUST_CONTENT.text1}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
                {TRUST_CONTENT.text2}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {TRUST_CONTENT.points.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                    <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all">
                        <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon size={32} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                )
            })}
        </div>

        {/* Mini Manifesto */}
        <div className="bg-brand-blue p-8 md:p-12 rounded-2xl text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl font-serif italic mb-6 leading-relaxed">
                    {TRUST_CONTENT.manifesto}
                </p>
                <p className="font-bold text-brand-orange text-lg">— Equipe MDigital</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;