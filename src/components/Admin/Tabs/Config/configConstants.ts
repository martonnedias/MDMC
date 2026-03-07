export const SIZES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];

export const SOCIAL_STYLES = [
    { label: 'Arredondado (Round)', value: 'round' },
    { label: 'Quadrado (Square)', value: 'square' },
    { label: 'Vidro (Glass)', value: 'glass' },
    { label: 'Minimalista', value: 'minimal' },
    { label: 'Contorno (Outline)', value: 'outline' }
];

export const SOCIAL_DISPLAY_TYPES = [
    { label: 'Apenas Ícones', value: 'icon' },
    { label: 'Apenas Texto', value: 'text' },
    { label: 'Ícones + Texto', value: 'both' }
];

export const moveItem = (list: any[], index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return list;
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    return newList;
};
