import React from 'react';
import { AlertCircle, Clock, TrendingDown, SearchX } from 'lucide-react';
import { PAIN_CONTENT } from '../constants';
import SectionTitle from './SectionTitle';

const icons = [TrendingDown, Clock, SearchX, AlertCircle];

const PainPoints: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle title={PAIN_CONTENT.title} alignment="center" />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {PAIN_CONTENT.items.map((point, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="flex gap-4 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-gray-900 text-lg mb-1">{point.title}</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <p className="text-2xl font-heading font-semibold text-brand-blue">
              {PAIN_CONTENT.transition}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;