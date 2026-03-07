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
export const formatCPFCNPJ = (value: string): string => {
    if (!value) return '';
    value = value.replace(/\D/g, '');

    if (value.length <= 11) {
        // CPF
        return value
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    } else {
        // CNPJ
        return value
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }
};

export const validateCPFCNPJ = (value: string): boolean => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 11) return validateCPF(cleanValue);
    if (cleanValue.length === 14) return validateCNPJ(cleanValue);
    return false;
};

const validateCPF = (cpf: string): boolean => {
    if (/^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

const validateCNPJ = (cnpj: string): boolean => {
    if (/^(\d)\1+$/.test(cnpj)) return false;
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    return true;
};

