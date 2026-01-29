import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIAL_CONTENT } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-brand-darkBlue relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Quote size={300} fill="white" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Histórias de quem confia na MDigital
            </h2>
            <div className="h-1 w-20 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-brand-orange text-white p-3 rounded-full shadow-lg">
              <Quote size={24} fill="currentColor" />
            </div>

            <p className="text-gray-700 text-lg md:text-xl italic leading-relaxed text-center mb-8">
              "{TESTIMONIAL_CONTENT.text}"
            </p>

            <div className="flex flex-col items-center justify-center border-t border-gray-100 pt-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 overflow-hidden border-2 border-brand-blue">
                <img 
                    src="https://picsum.photos/seed/businessman/200/200" 
                    alt="Foto do cliente" 
                    className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-heading font-bold text-gray-900 text-lg">
                {TESTIMONIAL_CONTENT.author}
              </h4>
              <p className="text-brand-blue font-medium text-sm">
                {TESTIMONIAL_CONTENT.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;