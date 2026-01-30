
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import SectionTitle from './SectionTitle';

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 lg:pt-20 lg:pb-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Dúvidas comuns sobre nossos serviços"
          subtitle="Fique à vontade para conferir as respostas para as perguntas mais frequentes sobre nossos planos de marketing e consultoria."
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-heading font-semibold text-gray-900 text-lg pr-4">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-brand-orange shrink-0" />
                ) : (
                  <ChevronDown className="text-gray-400 shrink-0" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
