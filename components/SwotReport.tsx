import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from './Button';
import {
  FileText, Download, Share2, ArrowLeft, Loader2, Sparkles,
  Zap, AlertTriangle, Lightbulb, TrendingUp, Target, ShieldCheck,
  PackageSearch, Clock, Mail, CheckCircle2, AlertCircle
} from 'lucide-react';
import { leadService } from '../services/leadService';

import ShareButtons from './ShareButtons';

interface SwotReportProps {
  formData: any;
  onBack: () => void;
}

const SwotReport: React.FC<SwotReportProps> = ({ formData, onBack }) => {
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
        setError("Chave de API não configurada. Verifique o arquivo .env.local");
        setLoading(false);
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: "Você é um(a) consultor(a) de negócios especialista em Análise SWOT e planejamento estratégico para pequenas e médias empresas. Seu papel é pegar as respostas de um questionário SWOT completo e transformar isso em um relatório estratégico personalizado, claro, humano, prático, sem termos técnicos desnecessários e sem mencionar em nenhum momento que este conteúdo foi gerado por inteligência artificial. REGRAS DE ESTILO: - Nunca use 'IA', 'algoritmo', 'modelo'. Use 'Com base nas suas respostas', 'Nesta análise'. - Português do Brasil, claro, simples e acolhedor. - Fale na segunda pessoa ('você', 'sua empresa'). - Estrutura obrigatória: 1. Capa/Intro, 2. Resumo Executivo, 3. Forças, 4. Fraquezas, 5. Oportunidades, 6. Ameaças, 7. Plano de Ação Priorizado (30 dias, 3-6 meses, 6-12 meses), 8. Considerações Finais."
        });

        const prompt = `Gere um relatório SWOT estratégico completo para a empresa "${formData.companyName}" do segmento "${formData.segment}". 
        
        Contexto coletado:
        - Diferencial: ${formData.differential}
        - Ponto Forte: ${formData.mainStrength}
        - Ponto Fraco: ${formData.mainWeakness}
        - Oportunidade: ${formData.biggestOpportunity}
        - Ameaça: ${formData.mainThreat}
        - Meta 12 meses: ${formData.mainGoal12m}
        - Desafio: ${formData.dailyChallenge}
        
        Use as informações detalhadas do briefing para criar recomendações práticas de gestão e marketing.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          setReportText(text);
        } else {
          throw new Error("Resposta vazia da API");
        }
      } catch (err) {
        console.error("Erro na Gemini API:", err);
        setError("Ocorreu um erro ao processar sua análise estratégica. Verifique sua conexão ou tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [formData]);

  const handleSendEmail = async () => {
    if (!formData.email) {
      alert("E-mail não encontrado no formulário.");
      return;
    }
    setSendingEmail(true);
    try {
      const success = await leadService.sendReportByEmail(formData.email, reportText);
      if (success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch (err) {
      alert("Erro ao simular o envio do e-mail.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setGeneratingPdf(true);

    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `Relatorio_SWOT_${formData.companyName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf defined in index.html
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      // Fallback to print
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-brand-blue rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-brand-blue animate-pulse" size={32} />
        </div>
      </div>
      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 animate-pulse">Consultando Especialista Digital...</h3>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        Nossa inteligência está cruzando os dados da <strong>{formData.companyName}</strong> com as melhores práticas do segmento de <strong>{formData.segment}</strong>.
      </p>
      <div className="mt-12 space-y-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2 justify-center"><CheckCircle2 size={16} className="text-brand-green" /> Auditoria Interna Concluída</div>
        <div className="flex items-center gap-2 justify-center"><CheckCircle2 size={16} className="text-brand-blue" /> Analisando Riscos de Mercado</div>
        <div className="flex items-center gap-2 justify-center"><Loader2 size={16} className="text-brand-orange animate-spin" /> Redigindo Plano de Ação</div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="container mx-auto px-4 pt-32 pb-64">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 border border-gray-100">
        <LoadingState />
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 pt-32 pb-64">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-red-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Falha na Geração</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={onBack} variant="primary">Tentar Novamente</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-32 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 no-print">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Início
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ShareButtons title={`MD Solution - Análise SWOT para ${formData.companyName}`} />
            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
            <Button
              onClick={handleDownloadPDF}
              loading={generatingPdf}
              variant="outline"
              className="!border-brand-blue !text-brand-blue hover:!bg-brand-blue hover:!text-white px-6 py-2"
              withIcon
            >
              Baixar Relatório (PDF)
            </Button>
          </div>
        </div>

        {/* Relatório Estruturado */}
        <article ref={reportRef} className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          {/* Capa do Relatório */}
          <div className="bg-brand-darkBlue p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-6 shadow-lg">Documento Estratégico</div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">Plano de Auditoria SWOT</h1>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-blue-100 font-medium text-sm md:text-base">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg"><PackageSearch size={18} /> {formData.companyName}</span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg"><Target size={18} /> {formData.segment}</span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg"><Clock size={18} /> {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Corpo do Texto formatado */}
          <div className="p-8 md:p-16 bg-white">
            <div className="prose prose-blue max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700">
              {reportText.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('###')) return <h4 key={i} className="text-xl font-heading font-bold text-brand-blue mt-8 mb-4">{trimmed.replace(/###/g, '').trim()}</h4>;
                if (trimmed.startsWith('##')) return <h3 key={i} className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-5 border-b pb-3 border-gray-100">{trimmed.replace(/##/g, '').trim()}</h3>;
                if (trimmed.startsWith('#')) return <h2 key={i} className="text-3xl font-heading font-bold text-brand-darkBlue mt-12 mb-6 border-b-2 pb-4 border-brand-blue/10">{trimmed.replace(/#/g, '').trim()}</h2>;
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) return <li key={i} className="ml-5 mb-3 list-disc marker:text-brand-orange pl-2">{trimmed.replace(/[-*]/, '').trim()}</li>;
                if (trimmed === '') return <div key={i} className="h-4" />;
                return <p key={i} className="mb-6 text-lg text-gray-700 leading-relaxed font-normal">{trimmed}</p>;
              })}
            </div>

            {/* Rodapé de Branding */}
            <div className="mt-20 pt-12 border-t border-gray-100 text-center">
              <div className="bg-gray-50 inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-brand-blue font-bold text-sm mb-6 border border-gray-100">
                <ShieldCheck size={20} className="text-brand-green" />
                <span>Validado pela Metodologia MD Solution © {new Date().getFullYear()}</span>
              </div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                Este diagnóstico é estritamente confidencial e foi gerado com base nos dados fornecidos pelo usuário em {new Date().toLocaleString('pt-BR')}.
              </p>
            </div>
          </div>
        </article>

        {/* Footer de Engajamento */}
        <div className="mt-12 text-center no-print bg-blue-50 p-8 rounded-[2rem] border border-blue-100 shadow-sm">
          <h4 className="text-xl font-heading font-bold text-brand-darkBlue mb-3">Deseja implementar este plano com nossa ajuda?</h4>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Nossos estrategistas podem te guiar passo a passo na execução dessas recomendações para acelerar seus resultados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => window.open(`https://wa.me/5511999999999?text=Olá! Acabei de gerar meu relatório SWOT para a ${formData.companyName} e gostaria de marcar uma reunião estratégica.`)} variant="primary" className="bg-green-500 hover:bg-green-600 border-none shadow-green-500/20">
              Falar com Consultor no WhatsApp
            </Button>
            <Button onClick={onBack} variant="secondary">Voltar ao Início</Button>
          </div>
        </div>
      </div >
    </div >
  );
};

export default SwotReport;