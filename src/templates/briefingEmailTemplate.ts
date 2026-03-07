import { BriefingPayload } from '../services/adminService';

/**
 * Formata os dados do briefing em um layout de e-mail profissional e organizado
 */
export function formatBriefingAsHTML(data: BriefingPayload): string {
    const labels: Record<string, string> = {
        name: 'Nome do Gestor', email: 'E-mail', phone: 'WhatsApp', whatsapp: 'WhatsApp',
        companyName: 'Empresa', company_name: 'Empresa', segment: 'Segmento', businessTime: 'Tempo de Mercado', teamSize: 'Equipe',
        differential: 'Diferencial Competitivo', qualityRating: 'Nota de Qualidade', clientRelationship: 'Relacionamento',
        mainStrength: 'Ponto Forte Principal', keyProcess: 'Processo Chave', executionAbility: 'Execução (1-5)',
        dailyChallenge: 'Desafio Diário', financialOrg: 'Org. Financeira', processOrg: 'Org. Processos',
        mainWeakness: 'Fraqueza Principal', delegationAbility: 'Nível Delegação', specificBottleneck: 'Gargalo Específico',
        expansionDemand: 'Demanda de Expansão', biggestOpportunity: 'Oportunidade', techUsage: 'Uso de Tech',
        customerClarity: 'Clareza do Cliente', mainGoal6m: 'Meta 6 Meses', projectIdea: 'Ideia de Projeto',
        marketConcern: 'Preocupação Mercado', competitionRating: 'Concorrência', mainThreat: 'Ameaça Principal',
        adaptationAbility: 'Adaptação', dependencyLevel: 'Dependência de Clientes', financialHealth: 'Saúde Financeira',
        currentWorry: 'Preocupação Atual', mainGoal12m: 'Meta 12 Meses', directionClarity: 'Clareza Direção',
        firstImprovement: 'Primeira Melhoria', longTermDream: 'Sonho de Longo Prazo',
        changeDisposition: 'Disposição Mudança', biggestObstacle: 'Maior Obstáculo', recommendationOpenness: 'Abertura',
        plan: 'Plano Selecionado'
    };

    const sections = [
        { title: '📋 Cadastro e Empresa', fields: ['name', 'email', 'phone', 'companyName', 'segment', 'businessTime', 'teamSize'] },
        { title: '💪 Análise Interna (Forças)', fields: ['differential', 'mainStrength', 'clientRelationship', 'executionAbility'] },
        { title: '⚠️ Análise Interna (Fraquezas)', fields: ['dailyChallenge', 'mainWeakness', 'financialOrg', 'processOrg', 'delegationAbility', 'specificBottleneck'] },
        { title: '🚀 Oportunidades (Mercado)', fields: ['expansionDemand', 'biggestOpportunity', 'techUsage', 'customerClarity', 'projectIdea'] },
        { title: '🛡️ Ameaças (Riscos)', fields: ['marketConcern', 'competitionRating', 'mainThreat', 'adaptationAbility', 'dependencyLevel', 'financialHealth'] },
        { title: '🎯 Visão e Objetivos', fields: ['currentWorry', 'mainGoal6m', 'mainGoal12m', 'directionClarity', 'firstImprovement', 'longTermDream'] },
        { title: '⚙️ Disposição e Próximos Passos', fields: ['changeDisposition', 'biggestObstacle', 'recommendationOpenness', 'plan'] }
    ];

    let html = `
    <div style="background-color: #f4f7f9; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
        
        <!-- Header -->
        <div style="background-color: #0047FF; padding: 35px 40px; text-align: left;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Auditoria Estratégica SWOT</h1>
          <p style="color: #b3c7ff; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Novo Briefing Recebido</p>
        </div>

        <div style="padding: 40px;">
          <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 30px;">
            Olá, <strong>Administrador</strong>.<br>
            Um novo diagnóstico SWOT foi concluído no site. Abaixo estão as informações detalhadas para a sua análise.
          </p>
  `;

    sections.forEach(section => {
        html += `
      <div style="margin-bottom: 35px;">
        <h2 style="font-size: 18px; color: #0047FF; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px; margin-bottom: 15px; font-weight: 700;">${section.title}</h2>
        <table style="width: 100%; border-collapse: collapse;">
    `;

        section.fields.forEach(field => {
            const value = data[field as keyof BriefingPayload];
            if (value !== undefined && value !== null && value !== '') {
                html += `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; vertical-align: top; width: 40%;">
              <span style="font-size: 13px; font-weight: 700; color: #667c99; text-transform: uppercase; letter-spacing: 0.5px;">${labels[field] || field}</span>
            </td>
            <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f0f4f8; vertical-align: top;">
              <span style="font-size: 15px; color: #2c3e50; line-height: 1.5;">${String(value)}</span>
            </td>
          </tr>
        `;
            }
        });

        html += `</table></div>`;
    });

    html += `
            < !--Footer -->
                <div style="margin-top: 20px; padding-top: 30px; border-top: 2px solid #f0f4f8; text-align: center;" >
                    <p style="font-size: 14px; color: #95a5a6; margin: 0;" > Este é um relatório gerado automaticamente pela plataforma < strong > MD Solution < /strong>.</p >
                        <div style="margin-top: 15px;" >
                            <a href="#" style = "color: #0047FF; text-decoration: none; font-size: 13px; font-weight: 600;" > Acessar Dashboard </a>
                                < span style = "margin: 0 10px; color: #e1e8ed;" >| </span>
                                    < a href = "mailto:contato@mdsolution.com.br" style = "color: #0047FF; text-decoration: none; font-size: 13px; font-weight: 600;" > Suporte Técnico </a>
                                        </div>
                                        </div>
                                        </div>

                                        < div style = "background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e1e8ed;" >
                                            <p style="font-size: 12px; color: #bdc3c7; margin: 0;" >& copy; ${new Date().getFullYear()} MD Solution Estratégia Digital.Todos os direitos reservados.</p>
                                                </div>
                                                </div>
                                                </div>
                                                    `;

    return html;
}
