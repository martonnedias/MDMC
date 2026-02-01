
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fundo escuro, 'dark' para fundo claro
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  // Configuração de alturas máximas (max-height) conforme especificado pelo usuário
  const heights = {
    sm: 'max-h-[100px] max-w-[100px] w-auto h-auto',  // Header (100px)
    md: 'h-[100px] w-auto',            // Header - altura fixa 100px
    lg: 'max-h-[120px] w-auto h-auto'  // Footer
  };

  // Seleção automática do arquivo de imagem com base na variante
  // Usar BASE_URL para funcionar no GitHub Pages (caminho relativo ao deploy)
  // logo.png = versão escura (letras azuis/pretas)
  // logo-light.png = versão clara (letras brancas/rainbow)
  const base = import.meta.env.BASE_URL;
  const logoSrc = `${base}${variant === 'light' ? 'logo-light.png' : 'logo.png'}`;

  return (
    <div className={`flex items-center group transition-all duration-300 ${className}`}>
      <img
        src={logoSrc}
        alt="MD Solution Marketing e Consultoria"
        className={`${heights[size]} mt-0 mb-0 mx-[50px] object-contain transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-110`}
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
