
import React from 'react';
import { useSiteConfig } from '../lib/SiteContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fundo escuro, 'dark' para fundo claro
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const { config } = useSiteConfig();
  // Configuração de alturas máximas (max-height) conforme especificado pelo usuário
  const heights = {
    sm: 'max-h-[100px] max-w-[100px] w-auto h-auto',  // Scrolled Header
    md: 'max-h-[100px] max-w-[100px] w-auto h-auto',  // Static Header
    lg: 'max-h-[120px] max-w-[120px] w-auto h-auto'   // Footer
  };

  // Seleção automática do arquivo de imagem com base na variante
  // Usar BASE_URL para funcionar no GitHub Pages (caminho relativo ao deploy)
  // logo.png = versão escura (letras azuis/pretas)
  // logo-light.png = versão clara (letras brancas/rainbow)
  const base = import.meta.env.BASE_URL;
  const defaultLogo = `${base}${variant === 'light' ? 'logo-light.png' : 'logo.png'}`;
  const logoSrc = config.logo_url && variant === 'dark' ? config.logo_url : defaultLogo;

  return (
    <div className={`flex items-center gap-3 group transition-all duration-300 ${className}`}>
      <img
        src={logoSrc}
        alt="MD Solution Marketing e Consultoria"
        className={`${heights[size]} mt-0 mb-0 object-contain transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-110`}
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
      {config.slogan && (
        <div className={`hidden md:flex flex-col border-l border-gray-200 pl-3 py-1 ${variant === 'light' ? 'border-white/20' : 'border-gray-200'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-tight ${variant === 'light' ? 'text-white' : 'text-gray-900'}`}>
            {config.slogan}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
