import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from './Button';
import {
  FileText, Download, Share2, ArrowLeft, Loader2, Sparkles,
  Target, BarChart3, TrendingUp, CheckCircle2, Mail,
  AlertCircle, ShieldCheck, Zap, MessageSquare, Briefcase, Copy
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
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const loadingWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateReport = async () => {
      setLoading(true);
      setError(null);

      // Auto-scroll to loading section
      if (loadingWrapperRef.current) {
        const yOffset = -100;
        const y = loadingWrapperRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        setError("Chave de API não configurada. Por favor, verique suas variáveis de ambiente ou o arquivo .env.local.");
        setLoading(false);
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash", // Use 2.0 stabilized
          systemInstruction: `Você é um Consultor Sênior de Marketing Digital e Estratégia Comercial, especializado em análise imparcial de negócios.

**SUA MISSÃO:** Fornecer uma auditoria honesta, baseada em dados, que ajude o empresário a tomar decisões informadas.

**DICA DE FORMATAÇÃO DE TABELAS:**
Ao criar tabelas de benchmark, utilize exatamente este formato Markdown para que o sistema renderize corretamente:
| Característica | Sua Empresa | Concorrente A | Concorrente B |
| :--- | :--- | :--- | :--- |
| Preço | Valor X | Valor Y | Valor Z |

**ESTRUTURA OBRIGATÓRIA:**
1. RESUMO EXECUTIVO
2. DIAGNÓSTICO SITUACIONAL
3. ANÁLISE COMPETITIVA (Use a tabela de Benchmarks aqui)
4. PONTOS FORTES
5. GARGALOS CRÍTICOS
6. OPORTUNIDADES
7. RECOMENDAÇÃO ESTRATÉGICA
8. PRÓXIMOS PASSOS`
        });

        const prompt = `Gere o relatório completo para a empresa "${formData.companyName}".
        DADOS DE ENTRADA:
        ${JSON.stringify(formData, null, 2)}
        
        Compare os dados de preço (${formData.priceRange}), parcelamento (${formData.maxInstallments}) e entrega (${formData.deliveryTime}) com os benchmarks típicos do segmento "${formData.segment}".`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          setReportText(text);
          // Scroll to top of report when ready
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          throw new Error("EMPTY_RESPONSE");
        }
      } catch (err: any) {
        console.error("Erro Gemini:", err);

        let userMsg = "O serviço de Inteligência Artificial está temporariamente indisponível. Por favor, tente novamente mais tarde.";

        if (err.message?.includes('429')) {
          userMsg = "Muitas solicitações simultâneas. Aguarde 60 segundos e tente gerar novamente.";
        } else if (err.message?.includes('SAFETY')) {
          userMsg = "Os dados fornecidos acionaram um filtro de segurança. Por favor, revise as informações da empresa.";
        } else if (err.message === 'EMPTY_RESPONSE') {
          userMsg = "A IA não conseguiu processar sua resposta. Tente simplificar os dados do formulário.";
        }

        setError(userMsg);
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

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="container mx-auto px-4 pt-44 lg:pt-60 pb-64" ref={loadingWrapperRef}>
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 lg:p-20 text-center border border-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          <div className="relative mb-12 inline-block">
            {/* Multi-layered Loader */}
            <div className="w-32 h-32 border-4 border-gray-50 border-t-brand-blue border-r-brand-orange rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-gray-50 border-b-brand-blue border-l-brand-orange rounded-full animate-spin-slow opacity-50"></div>
            <Sparkles className="absolute inset-0 m-auto text-brand-orange animate-pulse" size={40} />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
              <Loader2 className="animate-spin" size={14} /> Processamento em Tempo Real
            </div>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-brand-darkBlue leading-tight">
              Gerando sua Auditoria <br /><span className="text-brand-blue">Estratégica 360º</span>
            </h3>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Nossa IA está cruzando seus dados com benchmarks de <strong className="text-brand-darkBlue font-black italic">{formData.segment}</strong> para identificar seus gargalos de faturamento.
            </p>
          </div>

          {/* Progress Steps Simulation */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { label: 'Capturando Dados', status: 'done', icon: CheckCircle2 },
              { label: 'Analise Competitiva', status: 'loading', icon: Loader2 },
              { label: 'Plano de Escala', status: 'pending', icon: Target },
            ].map((step, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border-2 transition-all duration-500 ${step.status === 'done' ? 'bg-green-50 border-green-100' : step.status === 'loading' ? 'bg-blue-50 border-blue-100 shadow-lg scale-105' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${step.status === 'done' ? 'bg-green-500 text-white' : step.status === 'loading' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <step.icon size={18} className={step.status === 'loading' ? 'animate-spin' : ''} />
                  </div>
                  <span className={`text-sm font-bold ${step.status === 'done' ? 'text-green-700' : step.status === 'loading' ? 'text-brand-blue' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 pt-44 lg:pt-60 pb-64">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-red-100">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-brand-darkBlue">Ops! Conexão Interrompida</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={onBack} variant="primary">Tentar Novamente</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-44 lg:pt-60 pb-32">
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
              <Button onClick={handleCopyReport} variant="secondary" className="px-6 py-2 text-sm bg-white border-2 border-gray-100 hover:border-brand-blue/30">
                {copied ? <span className="text-green-600 flex items-center gap-2"><CheckCircle2 size={16} /> Copiado!</span> : <span className="flex items-center gap-2 text-gray-600 font-bold font-heading"><Copy size={16} /> Copiar Texto</span>}
              </Button>
              <Button onClick={handleSendEmail} variant="secondary" className="px-6 py-2 text-sm bg-white border-2 border-gray-100" loading={sendingEmail}>
                {emailSent ? <span className="text-green-600 flex items-center gap-2"><CheckCircle2 size={16} /> Enviado!</span> : <span className="flex items-center gap-2 font-heading font-bold text-gray-600"><Mail size={16} /> E-mail</span>}
              </Button>
              <Button onClick={handleDownloadPDF} variant="secondary" className="px-6 py-2 text-sm bg-white border-2 border-gray-100" loading={generatingPdf}>
                <Download size={16} className="mr-2" /> <span className="font-heading font-bold text-gray-600">{generatingPdf ? 'Gerando...' : 'PDF'}</span>
              </Button>
              <Button onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.whatsapp}?text=Olá! Acabei de ler meu diagnóstico da ${formData.companyName} e quero marcar uma reunião.`)} variant="primary" className="px-6 py-2 text-sm shadow-lg shadow-brand-orange/20">
                Falar com Estrategista
              </Button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <article ref={reportRef} className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-darkBlue via-brand-darkBlue to-blue-900 p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/10">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl transform -rotate-3">
                    <div className="text-brand-darkBlue font-black text-3xl">MD</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black tracking-tight">MD Solution</h3>
                    <p className="text-sm text-blue-200 font-bold uppercase tracking-widest">Estratégia & Marketing</p>
                  </div>
                </div>
                <div className="text-sm text-blue-100 flex flex-col gap-2 font-medium">
                  <span className="flex items-center gap-2 md:justify-end text-brand-orange uppercase text-[10px] font-black tracking-[0.2em] mb-1">Canais Oficiais</span>
                  <p className="flex items-center gap-2 md:justify-end opacity-80 backdrop-blur-sm bg-white/5 px-4 py-1 rounded-full"><Mail size={14} className="text-brand-orange" /> {CONTACT_INFO.email}</p>
                  <p className="flex items-center gap-2 md:justify-end opacity-80 backdrop-blur-sm bg-white/5 px-4 py-1 rounded-full"><MessageSquare size={14} className="text-brand-orange" /> {CONTACT_INFO.whatsappFormatted}</p>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl border border-white/20">
                  <ShieldCheck size={14} /> Auditoria Estratégica v3.0
                </div>
                <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-[1.1] tracking-tight">Diagnóstico <br />de Marketing Digital</h1>
                <div className="inline-block p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-3">
                  <p className="text-brand-orange text-xl md:text-2xl font-black mb-0.5">{formData.companyName}</p>
                  <p className="text-xs text-blue-200 uppercase font-black tracking-[0.3em]">{formData.segment}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-20">
            <div className="prose prose-blue max-w-none prose-headings:font-heading prose-headings:font-black prose-p:text-gray-600 prose-p:text-lg prose-p:leading-relaxed">
              {reportText.split('\n').map((line, i) => {
                const trimmed = line.trim();
                // Custom Rendering
                if (trimmed.startsWith('###')) return <h4 key={i} className="text-xl font-black text-brand-blue mt-10 mb-5 uppercase tracking-widest flex items-center gap-3"><span className="w-8 h-1 bg-brand-orange rounded-full"></span>{trimmed.replace(/###/g, '').trim()}</h4>;
                if (trimmed.startsWith('##')) return <h3 key={i} className="text-3xl font-black text-brand-darkBlue mt-16 mb-8 border-l-8 border-brand-orange pl-6 leading-tight uppercase">{trimmed.replace(/##/g, '').trim()}</h3>;
                if (trimmed.startsWith('#')) return <h2 key={i} className="text-4xl font-black text-brand-darkBlue mt-20 mb-10 pb-4 border-b-2 border-gray-100">{trimmed.replace(/#/g, '').trim()}</h2>;
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) return <li key={i} className="ml-5 mb-4 list-none flex items-start gap-4 text-gray-700 font-medium group"><CheckCircle2 className="text-brand-orange mt-1 shrink-0 group-hover:scale-110 transition-transform" size={20} />{trimmed.replace(/[-*]/, '').trim()}</li>;
                if (trimmed === '') return <div key={i} className="h-6" />;

                // Enhanced Table Rendering
                if (trimmed.includes('|')) {
                  const cells = trimmed.split('|').filter(c => c.trim());
                  if (cells.length === 0 || trimmed.includes(':---')) return null;

                  const isHeader = cells.some(c => c.includes('**')) || i === 0 || cells[0].toLowerCase().includes('característica');

                  return (
                    <div key={i} className="overflow-x-auto my-12 -mx-4 md:mx-0 scrollbar-hide">
                      <table className="w-full min-w-[600px] border-collapse bg-white rounded-[2rem] overflow-hidden shadow-2xl border-2 border-brand-darkBlue">
                        <tbody>
                          <tr className={isHeader ? "bg-brand-darkBlue text-white" : "border-b border-gray-100 hover:bg-blue-50/50 transition-colors"}>
                            {cells.map((cell, idx) => (
                              <td key={idx} className={`px-6 py-6 text-sm ${isHeader ? 'font-black uppercase tracking-widest text-[11px]' : 'text-gray-800 font-bold'} ${idx === 0 ? 'bg-gray-900/5' : ''}`}>
                                {cell.replace(/\*\*/g, '').trim()}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return <p key={i} className="mb-6">{trimmed}</p>;
              })}
            </div>

            {/* Footer */}
            <div className="mt-32 pt-16 border-t-4 border-gray-50 relative">
              <div className="absolute -top-1 left-0 w-24 h-1 bg-brand-orange"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Suporte Técnico</h4>
                  <p className="text-base text-gray-900 font-bold">{CONTACT_INFO.email}</p>
                  <p className="text-base text-gray-900 font-bold">{CONTACT_INFO.whatsappFormatted}</p>
                </div>
                <div className="text-center bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-inner">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Próximo Passo Decisivo</h4>
                  <Button
                    onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.whatsapp}?text=Olá! Li meu diagnóstico da ${formData.companyName} e gostaria de agendar uma reunião estratégica.`, '_blank')}
                    variant="primary"
                    className="px-8 py-4 text-xs shadow-2xl shadow-brand-orange/40 hover:-translate-y-1 transition-transform"
                  >
                    AGENDAR REUNIÃO ESTRATÉGICA
                  </Button>
                </div>
                <div className="text-right space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Canal Digital</h4>
                  <p className="text-base text-gray-900 font-black italic">mdsolution.com.br</p>
                </div>
              </div>

              <div className="text-center pt-12 border-t border-gray-50">
                <div className="inline-flex items-center gap-3 bg-green-50 px-8 py-4 rounded-full border border-green-100 mb-10 shadow-sm">
                  <ShieldCheck className="text-green-600" size={24} />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Diagnóstico Validado pela Metodologia MD Solution</span>
                </div>
                <p className="text-[11px] text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  Este documento digital é estritamente confidencial. As recomendações geradas por Inteligência Artificial devem ser filtradas pela equipe técnica da MD Solution em reunião de alinhamento.
                  <br /><br />
                  <strong>MD Solution Marketing & Consultoria</strong> © {new Date().getFullYear()} • Todos os direitos reservados
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default MarketingReport;