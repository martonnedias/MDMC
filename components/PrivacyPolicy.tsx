
import React from 'react';
import SectionTitle from './SectionTitle';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-64 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
          <SectionTitle title="Política de Privacidade" alignment="left" />

          <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
            <p className="text-lg leading-relaxed">
              Na <strong>MD Solution Marketing & Consultoria</strong>, a privacidade e a segurança dos seus dados são prioridades fundamentais. Esta política explica como coletamos, usamos e protegemos suas informações em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center mb-4">
                  <Eye size={20} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Transparência</h4>
                <p className="text-sm">Explicamos claramente o que fazemos com cada dado coletado em nossos formulários.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center mb-4">
                  <Lock size={20} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Segurança</h4>
                <p className="text-sm">Utilizamos protocolos de criptografia para garantir que seus dados não vazem.</p>
              </div>
            </div>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">1. Coleta de Dados</h3>
              <p>Coletamos informações através de dois canais principais neste site:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Formulário de Contato:</strong> Nome, e-mail, telefone e interesse comercial.</li>
                <li><strong>Diagnóstico Estratégico (Briefing):</strong> Dados detalhados sobre sua empresa, faturamento, objetivos e presença digital.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">2. Uso das Informações</h3>
              <p>As informações coletadas são utilizadas exclusivamente para:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Entrar em contato para agendar reuniões ou apresentações de propostas.</li>
                <li>Analisar o cenário do seu negócio e montar um plano de ação personalizado.</li>
                <li>Melhorar nossa comunicação e oferta de serviços.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">3. Compartilhamento de Dados</h3>
              <p>
                <strong>A MD Solution não vende, aluga ou compartilha seus dados pessoais com terceiros</strong> para fins de marketing. Seus dados só são acessados por nossa equipe interna de estrategistas e consultores.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">4. Seus Direitos (LGPD)</h3>
              <p>Como titular dos dados, você tem o direito de:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Confirmar a existência de tratamento de seus dados.</li>
                <li>Acessar seus dados gratuitamente.</li>
                <li>Solicitar a correção ou exclusão total de suas informações de nossa base de dados a qualquer momento.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">5. Cookies</h3>
              <p>
                Utilizamos cookies básicos para melhorar sua experiência de navegação e entender como você interage com nossa landing page, visando otimizar nossos processos de conversão.
              </p>
            </section>

            <div className="bg-brand-darkBlue p-8 rounded-2xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-brand-orange" size={28} />
                <h4 className="text-xl font-bold">Compromisso Ético</h4>
              </div>
              <p className="opacity-90 leading-relaxed">
                Respeitamos o esforço que você faz para construir seu negócio. Tratar seus dados com respeito é o primeiro passo para construirmos uma parceria de sucesso baseada na confiança.
              </p>
            </div>

            <div className="pt-8 border-t border-gray-100 mt-12">
              <p className="text-sm italic">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
