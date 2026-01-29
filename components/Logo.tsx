
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fundo escuro, 'dark' para fundo claro
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  // Configuração de alturas máximas (max-height) conforme especificado pelo usuário
  const heights = {
    sm: 'max-h-[70px] md:max-h-[100px]', // Header scrolled (40px-50px range)
    md: 'max-h-[70px] md:max-h-[100px]', // Header top (60px)
    lg: 'max-h-[100px] md:max-h-[120px]'  // Footer (80px)
  };

  // Seleção automática do arquivo de imagem com base na variante
  // logo.png = versão escura (letras azuis/pretas)
  // logo-light.png = versão clara (letras brancas/rainbow)
  // FIXED: Usando logo-light.png fixo conforme solicitado (origem: dist/assets)
  const logoSrc = '/logo-light.png';

  return (
    <div className={`flex items-center group transition-all duration-300 ${className}`}>
      <img
        src={logoSrc}
        alt="MDigital Marketing e Consultoria"
        className={`${heights[size]} w-auto h-auto object-contain transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-110`}
        loading="eager"
        onError={(e) => {
          // Fallback visual caso a imagem não seja encontrada
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.parentElement;
          if (fallback) {
            fallback.innerHTML = `<div class="bg-brand-blue text-white font-heading font-bold px-4 py-2 rounded-xl text-sm">MDigital</div>`;
          }
        }}
      />
    </div>
  );
};

export default Logo;
