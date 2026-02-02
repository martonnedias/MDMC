import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, MessageSquare, Handshake, AlertOctagon } from 'lucide-react';
import Button from './Button';
import { ViewState } from '../App';

interface CommentPolicyProps {
    onNavigate: (view: ViewState) => void;
}

const CommentPolicy: React.FC<CommentPolicyProps> = ({ onNavigate }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: <Handshake className="text-brand-blue" size={24} />,
            title: "1. Respeito e Cortesia",
            content: "Acreditamos que grandes ideias surgem de debates saudáveis. Mantenha o tom profissional e respeitoso. Ataques pessoais, linguagem ofensiva ou discriminação de qualquer natureza resultará na remoção imediata do comentário e bloqueio permanente do usuário."
        },
        {
            icon: <ShieldCheck className="text-brand-blue" size={24} />,
            title: "2. Veracidade e Qualidade",
            content: "Procure agregar valor à discussão. Comentários genéricos ou que não tenham relação com o tema do artigo serão moderados. Não é permitido o uso de identidades falsas ou a personificação de terceiros."
        },
        {
            icon: <AlertOctagon className="text-brand-blue" size={24} />,
            title: "3. Proibição de Spam e Promoção",
            content: "Nosso blog é um espaço de aprendizado, não uma vitrine publicitária. Links externos, anúncios de serviços concorrentes ou spam serão removidos automaticamente pelo nosso sistema de segurança."
        },
        {
            icon: <MessageSquare className="text-brand-blue" size={24} />,
            title: "4. Direitos e Moderação",
            content: "A MD Solution reserva-se o direito de editar ou excluir comentários que violem estas diretrizes. Ao comentar, você concede permissão para que seu feedback seja exibido publicamente de forma permanente."
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => onNavigate('blog' as any)}
                        className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Voltar ao Blog
                    </button>

                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-gray-900 mb-6 leading-tight">
                            Política de <span className="text-brand-blue">Comentários</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Bem-vindo à nossa comunidade! Estabelecemos estas regras para garantir que este espaço permaneça produtivo, seguro e inspirador para todos os leitores.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {sections.map((section, index) => (
                            <div key={index} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-brand-blue/30 transition-all duration-300">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    {section.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-brand-darkBlue p-10 md:p-12 rounded-[3rem] text-white text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <h2 className="text-3xl font-heading font-bold mb-6 relative z-10">Sua opinião é fundamental</h2>
                        <p className="text-blue-100/70 mb-10 max-w-2xl mx-auto relative z-10">
                            Nossa equipe de consultores lê e interage com todos os comentários. Ao participar, você está ajudando a elevar o nível do debate sobre marketing digital no Brasil.
                        </p>
                        <Button
                            onClick={() => onNavigate('blog' as any)}
                            variant="primary"
                            className="relative z-10 px-12"
                        >
                            Ir para o Blog
                        </Button>
                    </div>

                    <div className="mt-16 text-center text-gray-400 text-xs">
                        Última atualização: 02 de Fevereiro de 2026.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentPolicy;
