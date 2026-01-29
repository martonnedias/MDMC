import React, { useState } from 'react';
import { CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../constants';
import Button from './Button';

const Checklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const scrollToPlans = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="bg-brand-blue p-6 text-white text-center">
            <h2 className="text-2xl font-heading font-bold mb-2">
              Diagnóstico Rápido: Como está sua presença digital?
            </h2>
            <p className="text-blue-100">
              Marque os itens que correspondem à sua realidade hoje:
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="space-y-4">
              {CHECKLIST_ITEMS.map((item, index) => {
                const isChecked = checkedItems.includes(index);
                return (
                  <div 
                    key={index} 
                    onClick={() => toggleItem(index)}
                    className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                      isChecked 
                        ? 'bg-red-50 border-red-200 shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mt-0.5 shrink-0 ${isChecked ? 'text-red-500' : 'text-gray-300'}`}>
                      {isChecked ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <p className={`text-lg ${isChecked ? 'text-red-800 font-medium' : 'text-gray-600'}`}>
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>

            {checkedItems.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-orange-100 text-orange-700 p-3 rounded-full mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Atenção! Você marcou {checkedItems.length} {checkedItems.length === 1 ? 'ponto' : 'pontos'} de alerta.
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-lg">
                    Esses problemas estão impedindo seu negócio de crescer. A boa notícia é que a MDigital resolve exatamente isso.
                  </p>
                  <Button onClick={scrollToPlans} variant="primary" withIcon>
                    Ver soluções para o meu negócio
                  </Button>
                </div>
              </div>
            )}

            {checkedItems.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-6 italic">
                Selecione as opções acima para ver seu diagnóstico.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checklist;