import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Printer, Share2, AlertCircle, FileText } from 'lucide-react';
import Button from '@/src/components/Button';

interface ReportData {
    content_html: string;
    report_type: string;
    created_at: string;
    summary_json: any;
}

const ReportView: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchReport = async () => {
            setLoading(true);
            try {
                // Try calling the edge function
                const { data, error: functionError } = await supabase.functions.invoke('get-report-by-token', {
                    method: 'POST',
                    body: { token }
                });

                if (functionError) {
                    console.warn("Edge function failed, trying database directly as fallback...", functionError);
                    // Fallback to direct DB query if RLS permits or if development
                    const { data: link, error: linkError } = await supabase
                        .from('report_public_links')
                        .select('report_id')
                        .eq('token', token)
                        .single();

                    if (linkError || !link) {
                        setError('Relatório não encontrado ou link expirado/inválido.');
                        setLoading(false);
                        return;
                    }

                    const { data: reportData, error: reportError } = await supabase
                        .from('reports')
                        .select('content_html, report_type, created_at, summary_json')
                        .eq('id', link.report_id)
                        .single();

                    if (reportError) {
                        setError('Erro ao carregar o conteúdo do relatório.');
                    } else {
                        setReport(reportData);
                    }
                } else if (data && data.error) {
                    setError(data.error);
                } else {
                    setReport(data);
                }

            } catch (err: any) {
                setError('Um erro inesperado ocorreu. Tente novamente mais tarde.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchReport();
    }, [token, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-gold text-brand-gold rounded-full"></div>
                    <div className="w-3 h-3 bg-brand-blue text-brand-blue rounded-full"></div>
                    <div className="w-3 h-3 bg-brand-gold text-brand-gold rounded-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-md w-full border border-red-100">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Button onClick={() => navigate('/')} variant="primary" fullWidth>Voltar ao Início</Button>
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen bg-[#F4F7F9] pt-24 pb-20 print:pt-0 print:pb-0 print:bg-white">
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                {/* Header Action Bar - Hidden in print */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print:hidden">
                    <div className="flex items-center gap-3 text-brand-darkBlue">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                            <FileText size={24} className="text-brand-blue" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Relatório Automático</h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                                {new Date(report.created_at).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="secondary" onClick={handleShare} className="flex-1 sm:flex-none">
                            <Share2 size={16} className="mr-2" /> Copiar Link
                        </Button>
                        <Button variant="primary" onClick={handlePrint} className="flex-1 sm:flex-none bg-brand-darkBlue hover:bg-brand-blue shadow-lg">
                            <Printer size={16} className="mr-2" /> Salvar / Imprimir
                        </Button>
                    </div>
                </div>

                {/* Report Content */}
                <div className="bg-white rounded-[2rem] shadow-2xl p-0 overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none">
                    <div
                        className="report-html-content p-6 md:p-12 print:p-0"
                        dangerouslySetInnerHTML={{ __html: report.content_html }}
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { background-color: white !important; }
                    nav, footer { display: none !important; }
                    .print\\:hidden { display: none !important; }
                    .report-html-content { margin: 0; padding: 0; }
                }
                `
            }} />
        </div>
    );
};

export default ReportView;
