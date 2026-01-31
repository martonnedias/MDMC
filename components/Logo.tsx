
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fundo escuro, 'dark' para fundo claro
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  // Configuração de alturas máximas (max-height) conforme especificado pelo usuário
  const heights = {
    sm: 'max-h-[60px] md:max-h-[90px]', // Scrolled
    md: 'max-h-[100px] md:max-h-[175px]', // Header
    lg: 'max-h-[120px] md:max-h-[175px]'  // Footer
  };

  // Seleção automática do arquivo de imagem com base na variante
  // logo.png = versão escura (letras azuis/pretas)
  // logo-light.png = versão clara (letras brancas/rainbow)
  const logoSrc = variant === 'light' ? '/logo-light.png' : '/logo.png';

  return (
    <div className={`flex items-center group transition-all duration-300 ${className}`}>
      <img
        src={logoSrc}
        alt="MD Solution Marketing e Consultoria"
        className={`${heights[size]} w-auto h-auto object-contain transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-110`}
        loading="eager"
        onError={(e) => {
          // Fallback visual caso a imagem não seja encontrada
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.parentElement;
          if (fallback) {
            fallback.innerHTML = `<div class="bg-brand-blue text-white font-heading font-bold px-4 py-2 rounded-xl text-sm">MD Solution</div>`;
          }
        }}
      />
    </div>
  );
};

export default Logo;
