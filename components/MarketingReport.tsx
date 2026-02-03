import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from './Button';
import {
  FileText, Download, Share2, ArrowLeft, Loader2, Sparkles,
  Target, BarChart3, TrendingUp, CheckCircle2, Mail,
  AlertCircle, ShieldCheck, Zap, MessageSquare, Briefcase
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { CONTACT_INFO } from '../constants';
import ShareButtons from './ShareButtons';

interface MarketingReportProps {
  formData: any;
  onBack: () => void;
}

const MarketingReport: React.FC<MarketingReportProps> = ({ formData, onBack }) => {
  const [reportText, setReportText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateReport = async () => {
      setLoading(true);
      setError(null);

      const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        setError("Chave de API não configurada. Por favor, verique suas variáveis de ambiente ou o arquivo .env.local.");
        setLoading(false);
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: `Você é um Agente de IA especializado em análise estratégica de negócios, criado para a MD Solution Marketing & Consultoria.
          SUA FUNÇÃO: Analisar respostas de um briefing e gerar um Relatório de Diagnóstico profissional, conciso e humano.
          REGRAS DE OURO:
          - Nunca mencione ser uma IA.
          - Use português do Brasil profissional e empático.
          - Foque em análise de PRODUTO/SERVIÇO (preço, formas de pagamento, diferencial vs benchmarks).
          - Estrutura obrigatória: 1. Resumo Executivo, 2. Momento Atual, 3. Presença Digital, 4. Análise de Produto/Serviço (Posicionamento de preço, Facilidade de compra, Diferencial), 5. Atendimento e Vendas, 6. Posicionamento vs Concorrência, 7. Tabela de Benchmarks do Segmento, 8. Pontos Fortes, 9. Oportunidades (Ajuste de preço/parcelamento), 10. Recomendação de Plano (Essencial/Profissional/Premium), 11. Consultoria de Vendas (Se necessário), 12. Próximos Passos.`
        });

        const prompt = `Gere o relatório completo para a empresa "${formData.companyName}".
        DADOS DE ENTRADA:
        ${JSON.stringify(formData, null, 2)}
        
        Compare os dados de preço (${formData.priceRange}), parcelamento (${formData.maxInstallments}) e entrega (${formData.deliveryTime}) com os benchmarks típicos do segmento "${formData.segment}". Identifique se o preço está acima ou abaixo e se há barreiras de conversão no pagamento.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          setReportText(text);
        } else {
          throw new Error("Erro na geração do conteúdo.");
        }
      } catch (err) {
        console.error("Erro Gemini:", err);
        setError("Não foi possível gerar seu diagnóstico agora. Nossa equipe foi notificada.");
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [formData]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setGeneratingPdf(true);
    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `Diagnostico_MDSolution_${formData.companyName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    const success = await leadService.sendReportByEmail(formData.email, reportText);
    if (success) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }
    setSendingEmail(false);
  };

  if (loading) return (
    <div className="container mx-auto px-4 pt-32 pb-64">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-gray-100">
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 border-4 border-blue-50 border-t-brand-blue rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-brand-blue animate-pulse" size={32} />
        </div>
        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Gerando Auditoria 360º...</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-10">Estamos cruzando seus dados com benchmarks de <strong>{formData.segment}</strong> para criar um plano de ação real.</p>
        <div className="space-y-3 max-w-xs mx-auto text-left">
          <div className="flex items-center gap-3 text-sm text-gray-400 font-bold"><CheckCircle2 className="text-brand-green" size={16} /> Dados capturados</div>
          <div className="flex items-center gap-3 text-sm text-gray-400 font-bold"><Loader2 className="animate-spin text-brand-blue" size={16} /> Analisando competitividade de preço</div>
          <div className="flex items-center gap-3 text-sm text-gray-300 font-bold"><div className="w-4 h-4 rounded-full bg-gray-100"></div> Mapeando oportunidades de escala</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 pt-32 pb-64">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-red-100">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Ops! Algo deu errado</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={onBack}>Voltar</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-32 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 no-print">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Início
          </button>

          <div className="flex flex-col lg:flex-row items-center gap-6 w-full lg:w-auto">
            <ShareButtons title={`MD Solution - Diagnóstico de Marketing para ${formData.companyName}`} />
            <div className="h-10 w-px bg-gray-200 hidden lg:block"></div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleSendEmail} variant="secondary" className="px-6 py-2 text-sm bg-white" loading={sendingEmail}>
                {emailSent ? <span className="text-green-600 flex items-center gap-2"><CheckCircle2 size={16} /> Enviado!</span> : <span className="flex items-center gap-2"><Mail size={16} /> Enviar p/ E-mail</span>}
              </Button>
              <Button onClick={handleDownloadPDF} variant="secondary" className="px-6 py-2 text-sm bg-white" loading={generatingPdf}>
                <Download size={16} className="mr-2" /> {generatingPdf ? 'Gerando...' : 'Baixar PDF'}
              </Button>
              <Button onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.whatsapp}?text=Olá! Acabei de ler meu diagnóstico da ${formData.companyName} e quero marcar uma reunião.`)} variant="primary" className="px-6 py-2 text-sm">
                Falar com Estrategista
              </Button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <article ref={reportRef} className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-brand-darkBlue p-10 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">Auditoria Digital v2.5</div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">Relatório de Diagnóstico</h1>
              <p className="text-blue-100 text-lg md:text-xl font-medium">{formData.companyName} | {formData.segment}</p>
            </div>
          </div>

          <div className="p-8 md:p-16">
            <div className="prose prose-blue max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-700">
              {reportText.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('###')) return <h4 key={i} className="text-lg font-bold text-brand-blue mt-6 mb-3 uppercase tracking-wide">{trimmed.replace(/###/g, '').trim()}</h4>;
                if (trimmed.startsWith('##')) return <h3 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-5 border-b-2 border-brand-blue/10 pb-2">{trimmed.replace(/##/g, '').trim()}</h3>;
                if (trimmed.startsWith('#')) return <h2 key={i} className="text-3xl font-bold text-brand-darkBlue mt-12 mb-6">{trimmed.replace(/#/g, '').trim()}</h2>;
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) return <li key={i} className="ml-5 mb-2 list-disc marker:text-brand-orange pl-2">{trimmed.replace(/[-*]/, '').trim()}</li>;
                if (trimmed === '') return <div key={i} className="h-4" />;

                // Simulação de Tabela via Markdown simples (se a IA gerar)
                if (trimmed.includes('|')) return <div key={i} className="bg-gray-50 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 border border-gray-100">{trimmed}</div>;

                return <p key={i} className="mb-4 text-base leading-relaxed">{trimmed}</p>;
              })}
            </div>

            <div className="mt-20 pt-12 border-t border-gray-100 text-center">
              <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 mb-6">
                <ShieldCheck className="text-brand-green" size={20} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Validado pela Metodologia MD Solution</span>
              </div>
              <p className="text-[10px] text-gray-400 max-w-md mx-auto leading-relaxed">Este documento é estritamente confidencial e contém recomendações baseadas em dados proprietários. MD Solution Marketing & Consultoria © {new Date().getFullYear()}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default MarketingReport;