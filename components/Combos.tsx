import React from 'react';
import { COMBOS_CONTENT } from '../constants';
import { adminService } from '../services/adminService';
import SectionTitle from './SectionTitle';
import { Plus } from 'lucide-react';

const Combos: React.FC = () => {
  const [displayCombos, setDisplayCombos] = React.useState<any[]>(COMBOS_CONTENT);

  React.useEffect(() => {
    const fetchCombos = async () => {
      const data = await adminService.getServices();
      const comboPlans = data.filter(s => s.category === 'combos');
      if (comboPlans.length > 0) {
        setDisplayCombos(comboPlans.map((s, index) => {
          const defaultCombo = COMBOS_CONTENT[index] || COMBOS_CONTENT[0];
          return {
            name: s.name || defaultCombo.name,
            includes: s.description || defaultCombo.includes,
            advantage: s.extra_info || s.price || defaultCombo.advantage
          };
        }));
      }
    };
    fetchCombos();
  }, []);
  return (
    <section className="py-12 lg:py-20 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Potencialize seus resultados com Marketing + Vendas"
          subtitle="O segredo das empresas que mais crescem é unir a atração de novos clientes com um atendimento impecável."
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayCombos.map((combo, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="bg-brand-blue p-4 text-center">
                  <h3 className="text-white font-heading font-bold text-lg">{combo.name}</h3>
                </div>
                <div className="p-6 text-center">
                  <div className="text-gray-800 font-medium mb-4 min-h-[3rem] flex items-center justify-center">
                    {combo.includes}
                  </div>
                  <div className="h-px w-16 bg-gray-200 mx-auto mb-4"></div>
                  <p className="text-green-600 font-bold bg-green-50 py-2 px-4 rounded-full inline-block text-sm">
                    {combo.advantage}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm italic">
            Consulte os valores promocionais dos combos falando com nossa equipe.
          </p>
        </div>
      </div>
    </section >
  );
};

export default Combos;