export const formatPhone = (value: string): string => {
    if (!value) return '';
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.substring(0, 11); // Limita a 11 dígitos

    if (value.length > 10) {
        // Celular com 9 dígitos: (11) 91234-5678
        return value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 5) {
        // Fixo ou Celular incompleto: (11) 1234-5678
        return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
        // Apenas DDD: (11) 123...
        return value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else {
        // Menos que 2 dígitos
        return value.replace(/^(\d{0,2})$/, '($1');
    }
};
