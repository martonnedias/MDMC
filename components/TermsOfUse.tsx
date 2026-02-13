
import React from 'react';
import SectionTitle from './SectionTitle';

const TermsOfUse: React.FC = () => {
  return (
    <div className="pt-44 lg:pt-60 pb-64 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
          <SectionTitle title="Termos de Uso" alignment="left" />

          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p className="text-lg">
              Bem-vindo à <strong>MD Solution Marketing & Consultoria</strong>. Ao acessar este site e utilizar nossos serviços, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
            </p>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h3>
              <p>
                O uso deste site constitui a aceitação plena de todos os termos aqui descritos. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços ou acessar este site.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">2. Descrição dos Serviços</h3>
              <p>
                A MD Solution oferece serviços de marketing digital, estratégias de anúncios pagos, consultoria de vendas e presença em redes sociais. O escopo específico de cada serviço será detalhado em contrato individualizado para cada cliente.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">3. Uso Responsável</h3>
              <p>
                O usuário se compromete a fornecer informações verídicas e precisas em nossos formulários de contato e diagnóstico. É proibido o uso deste site para atividades ilegais ou para a transmissão de conteúdo malicioso.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">4. Propriedade Intelectual</h3>
              <p>
                Todo o conteúdo deste site (textos, design, logotipos, ícones) é de propriedade exclusiva da MD Solution ou de seus licenciadores e está protegido pelas leis de direitos autorais brasileiras e internacionais. A reprodução não autorizada é proibida.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">5. Limitação de Responsabilidade</h3>
              <p>
                Embora trabalhemos para garantir os melhores resultados, o marketing digital depende de variáveis de mercado e comportamentais externas. A MD Solution não garante lucros específicos, mas compromete-se com a execução técnica de excelência das estratégias acordadas.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">6. Alterações nos Termos</h3>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento, sem aviso prévio. Recomendamos a revisão periódica desta página.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-100 mt-12">
              <p className="text-sm italic">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
