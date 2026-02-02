# 🕐 Configuração de Fuso Horário - Brasil (GMT-3)

## Resumo das Alterações

O sistema agora está configurado para exibir todas as datas no **fuso horário brasileiro (America/Sao_Paulo - GMT-3)**, garantindo que os horários mostrados aos usuários correspondam ao horário local do Brasil.

## Arquivos Criados

### `lib/dateUtils.ts`
Biblioteca completa de utilitários para manipulação de datas com suporte ao fuso horário brasileiro.

## Funções Disponíveis

### 📅 `formatDateBR(date, options?)`
Formata datas no padrão brasileiro.

**Opções:**
- `short: true` → Formato curto: `02/02/2026`
- `includeTime: true` → Com horário: `02 de fevereiro de 2026 às 15:44`
- Padrão → Formato longo: `02 de fevereiro de 2026`

**Exemplo:**
```typescript
formatDateBR('2026-02-02T18:44:00Z') 
// → "02 de fevereiro de 2026"

formatDateBR('2026-02-02T18:44:00Z', { short: true })
// → "02/02/2026"

formatDateBR('2026-02-02T18:44:00Z', { includeTime: true })
// → "02 de fevereiro de 2026 às 15:44"
```

### ⏰ `formatRelativeTime(date)`
Exibe tempo relativo (ex: "há 2 horas", "ontem").

**Exemplo:**
```typescript
formatRelativeTime('2026-02-02T14:00:00Z')
// → "há 1 hora"

formatRelativeTime('2026-02-01T18:00:00Z')
// → "ontem"

formatRelativeTime('2026-01-26T18:00:00Z')
// → "há 1 semana"
```

### 🕒 `formatTimeBR(date)`
Formata apenas o horário.

**Exemplo:**
```typescript
formatTimeBR('2026-02-02T18:44:00Z')
// → "15:44"
```

### 🌎 `getNowBrazil()`
Retorna a data/hora atual no fuso horário do Brasil.

**Exemplo:**
```typescript
const agora = getNowBrazil();
// → Date object com horário de Brasília
```

### 🔄 `convertToUTC(localDate)`
Converte uma data local para UTC (para salvar no banco).

**Exemplo:**
```typescript
const dataLocal = new Date('2026-02-02T15:44:00');
const dataUTC = convertToUTC(dataLocal);
// → "2026-02-02T18:44:00.000Z"
```

### ✅ `isToday(date)` e `isThisWeek(date)`
Verifica se uma data é hoje ou desta semana.

**Exemplo:**
```typescript
isToday('2026-02-02T18:00:00Z') // → true
isThisWeek('2026-01-30T18:00:00Z') // → true
```

## Componentes Atualizados

### ✅ BlogList.tsx
- Datas dos posts exibidas no formato curto brasileiro
- Linha 109: `formatDateBR(post.created_at, { short: true })`

### ✅ BlogPostDetail.tsx
- Data de publicação do artigo no formato longo
- Linha 188: `formatDateBR(post.created_at)`

## Como o Fuso Horário Funciona

### 1. **Armazenamento no Banco (Supabase)**
- Todas as datas são armazenadas em **UTC** (padrão internacional)
- Exemplo: `2026-02-02T18:44:00.000Z`

### 2. **Exibição para o Usuário**
- As datas são convertidas automaticamente para **GMT-3** (Brasília)
- UTC: `2026-02-02T18:44:00Z` → BR: `02/02/2026 15:44`

### 3. **Conversão Automática**
```typescript
// Supabase retorna: "2026-02-02T18:44:00.000Z" (UTC)
// formatDateBR converte para: "02 de fevereiro de 2026" (GMT-3)
```

## Benefícios

✅ **Consistência**: Todas as datas seguem o mesmo padrão  
✅ **Precisão**: Horários corretos para usuários brasileiros  
✅ **Internacionalização**: Fácil adicionar outros fusos horários no futuro  
✅ **Manutenibilidade**: Funções centralizadas em um único arquivo  
✅ **UX Melhorada**: Datas em formato familiar para brasileiros  

## Próximos Passos (Opcional)

### Para adicionar mais funcionalidades:

1. **Datas Relativas nos Comentários**
   ```typescript
   // Em vez de "02/02/2026"
   // Mostrar "há 2 horas" para comentários recentes
   formatRelativeTime(comment.created_at)
   ```

2. **Indicador de "Novo"**
   ```typescript
   {isToday(post.created_at) && (
     <span className="badge-new">Novo!</span>
   )}
   ```

3. **Agrupamento por Data**
   ```typescript
   // Agrupar posts: "Hoje", "Esta Semana", "Mês Passado"
   if (isToday(post.created_at)) {
     // Seção "Hoje"
   } else if (isThisWeek(post.created_at)) {
     // Seção "Esta Semana"
   }
   ```

## Testando

Para verificar se está funcionando:

1. Crie um post no admin
2. Verifique a data exibida na lista de posts
3. Abra o post e confira a data de publicação
4. Compare com o horário atual do Brasil

**Exemplo de Teste:**
- Horário do servidor (UTC): `18:44`
- Horário exibido (GMT-3): `15:44` ✅

---

**Implementado em:** 02/02/2026  
**Fuso Horário:** America/Sao_Paulo (GMT-3)  
**Desenvolvido por:** MD Solution
