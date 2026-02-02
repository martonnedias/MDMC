/**
 * Utilitários para manipulação de datas com fuso horário brasileiro (GMT-3)
 */

// Fuso horário do Brasil (Brasília)
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte uma data UTC do Supabase para o horário local do Brasil
 */
export const convertToLocalTime = (utcDate: string | Date): Date => {
    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;

    // Retorna a data já ajustada para o timezone do navegador
    return new Date(date.toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE }));
};

/**
 * Formata uma data para exibição no formato brasileiro
 */
export const formatDateBR = (date: string | Date, options?: {
    includeTime?: boolean;
    short?: boolean;
}): string => {
    const localDate = typeof date === 'string' ? new Date(date) : date;

    if (options?.short) {
        return localDate.toLocaleDateString('pt-BR', {
            timeZone: BRAZIL_TIMEZONE,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    if (options?.includeTime) {
        return localDate.toLocaleString('pt-BR', {
            timeZone: BRAZIL_TIMEZONE,
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return localDate.toLocaleDateString('pt-BR', {
        timeZone: BRAZIL_TIMEZONE,
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

/**
 * Formata uma data de forma relativa (ex: "há 2 horas", "ontem")
 */
export const formatRelativeTime = (date: string | Date): string => {
    const localDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - localDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return 'agora mesmo';
    } else if (diffMin < 60) {
        return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHour < 24) {
        return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else if (diffDay === 1) {
        return 'ontem';
    } else if (diffDay < 7) {
        return `há ${diffDay} dias`;
    } else if (diffDay < 30) {
        const weeks = Math.floor(diffDay / 7);
        return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffDay < 365) {
        const months = Math.floor(diffDay / 30);
        return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
        const years = Math.floor(diffDay / 365);
        return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
};

/**
 * Retorna a data/hora atual no fuso horário do Brasil
 */
export const getNowBrazil = (): Date => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE }));
};

/**
 * Converte uma data local para UTC (para salvar no banco)
 */
export const convertToUTC = (localDate: Date): string => {
    return localDate.toISOString();
};

/**
 * Formata apenas a hora no formato brasileiro
 */
export const formatTimeBR = (date: string | Date): string => {
    const localDate = typeof date === 'string' ? new Date(date) : date;

    return localDate.toLocaleTimeString('pt-BR', {
        timeZone: BRAZIL_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Verifica se uma data é hoje
 */
export const isToday = (date: string | Date): boolean => {
    const localDate = typeof date === 'string' ? new Date(date) : date;
    const today = getNowBrazil();

    return localDate.toLocaleDateString('pt-BR', { timeZone: BRAZIL_TIMEZONE }) ===
        today.toLocaleDateString('pt-BR', { timeZone: BRAZIL_TIMEZONE });
};

/**
 * Verifica se uma data é desta semana
 */
export const isThisWeek = (date: string | Date): boolean => {
    const localDate = typeof date === 'string' ? new Date(date) : date;
    const now = getNowBrazil();
    const diffMs = now.getTime() - localDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays < 7;
};
