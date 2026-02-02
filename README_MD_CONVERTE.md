# Landing Page MD Converte

## 📋 Visão Geral

Landing page completa e profissional para o produto **MD Converte** - uma plataforma de atendimento, CRM e automação focada em negócios locais.

**Tagline:** "Conversas organizadas, vendas multiplicadas"

---

## 🎨 Identidade Visual

### Paleta de Cores

```css
/* Primária - Ação/Botões/Destaques */
--laranja-conversao: #FF7A2F

/* Secundária - Marca/Cabeçalhos */
--azul-petroleo: #0C3452

/* Backgrounds */
--fundo-claro: #F5F7FA
--azul-claro: #E2ECF7

/* Textos */
--cinza-texto: #2B2B2B
--cinza-secundario: #9CA3AF
```

### Tipografia

- **Fonte principal:** Poppins, Montserrat ou Inter (via sistema)
- **Títulos:** Font-bold (700)
- **Corpo:** Font-regular (400)

---

## 🏗️ Estrutura da Página

### 1. Hero Section (Dobra Principal)
- Título principal com destaque em gradiente laranja
- 4 bullets de benefícios com ícones
- 2 CTAs (primário e secundário)
- Mockup/visualização do dashboard

### 2. Problema
- Apresenta as 4 principais dores do público
- Cards com ícones e descrições
- Layout em grid responsivo

### 3. Solução (4 Pilares)
- **Atendimento Centralizado** (MessageSquare)
- **CRM Simples e Poderoso** (Target)
- **Automação Inteligente** (Zap)
- **Relatórios de Desempenho** (BarChart3)

### 4. Funcionalidades Detalhadas
- 4 seções explicando cada funcionalidade
- Layout alternado (imagem esquerda/direita)
- Mockups ilustrativos

### 5. Para Quem é
- 5 nichos de mercado principais
- Ícones personalizados por setor
- Grid responsivo

### 6. Como Funciona (3 Passos)
- Passo a passo simplificado
- Badges numerados
- Timeline visual

### 7. Prova Social
- Banner com destaque para MD Solution
- 3 badges de valor
- Background com gradiente azul

### 8. Planos/Comercial
- 2 cards: Implantação e Mensalidade
- Destaque visual no card recorrente
- CTA para diagnóstico gratuito

### 9. FAQ (5 Perguntas)
- Accordion interativo
- Animação suave de abertura/fechamento
- Perguntas mais frequentes respondidas

### 10. CTA Final + Formulário
- Formulário de captura de leads
- 4 campos: Nome, Email, Telefone, Tipo de Negócio
- Integração com WhatsApp

---

## 🔧 Customização

### Alterar Cores

Procure por estas classes no código:

```typescript
// Laranja primário
from-[#FF7A2F] to-[#FF9A5A]
bg-[#FF7A2F]
text-[#FF7A2F]

// Azul petróleo
from-[#0C3452] to-[#1a5a8a]
bg-[#0C3452]
text-[#0C3452]

// Fundos
bg-[#F5F7FA]
bg-[#E2ECF7]
```

### Alterar Textos

Todos os textos estão diretamente no componente `MDConverteServicePage.tsx`. Procure pelas seções:

1. **HERO SECTION** (linha ~30)
2. **PROBLEM SECTION** (linha ~160)
3. **SOLUTION SECTION** (linha ~220)
4. **FEATURES** (linha ~310)
5. **FAQ** (linha ~780)

### Alterar Mockups/Imagens

Atualmente a página usa placeholders simulados. Para adicionar imagens reais:

1. Adicione as imagens na pasta `public/images/md-converte/`
2. Substitua os divs de mockup por tags `<img>`

Exemplo:
```typescript
// Antes (mockup simulado)
<div className="bg-gradient-to-br from-[#0C3452] to-[#1a5a8a] rounded-2xl...">
  {/* conteúdo simulado */}
</div>

// Depois (imagem real)
<img 
  src="/images/md-converte/dashboard-preview.png" 
  alt="Dashboard MD Converte"
  className="rounded-2xl shadow-2xl"
/>
```

### Alterar Formulário de Contato

O formulário atual redireciona para WhatsApp. Para mudar:

**Localização:** Seção `FINAL CTA` (linha ~820)

**Integração atual:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const message = `...`;
  window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
};
```

**Para integrar com EmailJS ou outro serviço:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Sua lógica de envio aqui
  await sendToYourService(formData);
};
```

### Adicionar/Remover Perguntas FAQ

Localização: linha ~780

```typescript
const faqItems = [
  {
    question: 'Sua pergunta aqui?',
    answer: 'Sua resposta aqui.'
  },
  // Adicione mais itens conforme necessário
];
```

### Modificar Nichos de Mercado

Localização: seção "WHO IS IT FOR" (linha ~660)

```typescript
const niches = [
  { 
    icon: SeuIcone, 
    name: 'Nome do Nicho', 
    color: 'from-color-500 to-color-600' 
  },
  // Adicione mais nichos
];
```

---

## 📱 Responsividade

A landing page foi desenvolvida com abordagem **mobile-first** e possui breakpoints para:

- **Mobile:** < 768px (layout em coluna única)
- **Tablet:** 768px - 1024px (layout em 2 colunas)
- **Desktop:** > 1024px (layout completo em grid)

### Classes Tailwind Responsivas Usadas:

```
md:grid-cols-2    // 2 colunas no tablet
lg:grid-cols-3    // 3 colunas no desktop
lg:text-6xl       // Textos maiores no desktop
lg:py-24          // Padding vertical maior no desktop
```

---

## 🌐 Acesso à Página

### URL Direta
A página pode ser acessada através do hash: `#md-converte`

**Exemplo:** `https://seudominio.com/#md-converte`

### Navegação pelo Menu
A página está integrada ao menu "Soluções" do header como primeira opção.

### Navegação Programática
```typescript
onNavigate('md-converte')
```

---

## ✨ Recursos Especiais

### Animações e Interatividade

1. **Hover Effects:** Todos os cards têm scale e shadow ao passar o mouse
2. **FAQ Accordion:** Animação suave de abertura/fechamento
3. **Form Validation:** Campos obrigatórios validados antes do envio
4. **Floating Elements:** Ícones animados com bounce e pulse
5. **Gradient Backgrounds:** Elementos com gradientes modernos

### Acessibilidade

- ✅ Estrutura semântica HTML5
- ✅ Labels associados aos inputs
- ✅ Contraste de cores adequado
- ✅ Foco visível em elementos interativos
- ✅ Textos alternativos descritivos

### SEO

- ✅ Título da página: "MD Solution / MD Converte"
- ✅ Estrutura de headings hierárquica (h1, h2, h3)
- ✅ Meta descriptions (configurar no index.html)
- ✅ URLs amigáveis com hash routing

---

## 📞 Contato e Suporte

### Alterar Número de WhatsApp

Localização: linha ~833

```typescript
window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
//                            ↑
//                    Altere este número
```

### Adicionar Links de Termos e Privacidade

Os links estão no formulário:
```typescript
<a href="#termos" className="...">Termos de Uso</a>
<a href="#privacidade" className="...">Política de Privacidade</a>
```

Para linkar com as páginas existentes do site:
```typescript
<button onClick={() => onNavigate('terms')}>Termos de Uso</button>
<button onClick={() => onNavigate('privacy')}>Política de Privacidade</button>
```

---

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

### Preview Local

```bash
npm run dev
```

Acesse: `http://localhost:5173/#md-converte`

---

## 📊 Métricas e Analytics

### Eventos Recomendados para Rastreamento

1. **Cliques no CTA Hero:** "Quero conhecer o MD Converte"
2. **Visualização do vídeo:** "Ver o sistema funcionando"
3. **Scroll para seção:** Funcionalidades, Planos, FAQ
4. **Envio de formulário:** Lead capturado
5. **Clique em FAQ:** Pergunta expandida

### Exemplo de Integração com Google Analytics

```typescript
// No handleSubmit do formulário
window.gtag('event', 'form_submit', {
  'event_category': 'MD Converte',
  'event_label': 'Lead Capturado'
});
```

---

## 🎯 Próximos Passos Sugeridos

1. **Adicionar imagens/screenshots reais** do sistema MD Converte
2. **Criar vídeo demonstrativo** do produto
3. **Adicionar depoimentos** de clientes na seção de prova social
4. **Configurar tracking** de conversões e eventos
5. **Implementar chat ao vivo** ou chatbot
6. **A/B Testing** dos CTAs e headlines
7. **Otimizar SEO** com meta tags específicas
8. **Adicionar schema markup** para rich snippets

---

## 📝 Notas Importantes

- **Nunca mencione "Bolten"** na página (plataforma whitelabel)
- **Tom de voz:** Humano, direto, prático, focado em resultados
- **Evitar jargão técnico** excessivo
- **Foco em benefícios**, não apenas features
- **Sempre incluir prova social** e cases quando disponíveis

---

## 🐛 Troubleshooting

### Página não carrega
- Verifique se o import está correto no `App.tsx`
- Confirme que 'md-converte' está no tipo `ViewState`
- Verifique o console do navegador para erros

### Formulário não envia
- Confirme que todos os campos required estão preenchidos
- Verifique o número do WhatsApp na função `handleSubmit`
- Teste a URL gerada no console antes de abrir

### Estilos quebrados
- Confirme que o Tailwind está processando as classes
- Verifique se não há conflitos de classes CSS
- Rode `npm run build` para ver se há erros de compilação

---

## 📄 Licença

Este projeto faz parte do ecossistema MD Solution. Uso interno.

**Desenvolvido por:** MD Solution  
**Data:** Fevereiro 2026  
**Versão:** 1.0.0
