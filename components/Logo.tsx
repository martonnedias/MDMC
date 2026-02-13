
import React from 'react';
import { useSiteConfig } from '../lib/SiteContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' para fundo escuro, 'dark' para fundo claro
  customHeight?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark', customHeight }) => {
  const { config } = useSiteConfig();
  // Configuração de alturas máximas (max-height) conforme especificado pelo usuário
  const heights = {
    sm: 'w-[100px] h-auto',
    md: 'w-[100px] h-auto',
    lg: 'w-[120px] h-auto'
  };

  // Seleção automática do arquivo de imagem com base na variante
  // logo.png = versão escura (letras azuis/pretas)
  // logo-light.png = versão clara (letras brancas/rainbow)
  const base = import.meta.env.BASE_URL;
  const defaultLogo = `${base}${variant === 'light' ? '1.png' : '2.png'}`;

  // Logic: 
  // 1. If variant is light (dark bg), try config.logo_light_url, then config.logo_footer_url (if footer?), then default.
  // 2. If variant is dark (light bg), try config.logo_url, then default.

  let logoSrc = defaultLogo;
  if (variant === 'light') {
    logoSrc = config.logo_light_url || config.logo_url || defaultLogo;
  } else {
    logoSrc = config.logo_url || defaultLogo;
  }

  // Size override
  // If config provides specific heights, use them instead of standard classes if we are in header/footer context?
  // Since Logo doesn't know if it's header or footer easily without props, we rely on usage.
  // BUT the user asked to "edit size".
  // Config has `logo_height_header` and `logo_height_footer`.
  // Ideally Header passes `className={config.logo_height_header}`.
  // But Header passes "size='md'" currently.
  // I will prioritize `className` passed to Logo if it contains height, but here className is usually margins.
  // I will check if I can use a dynamic style attribute or Tailwind class based on config.

  // However, Header.tsx uses this component. I will update Header.tsx to pass the configured height as a prop or class.
  // For now, let's just fix the Source selection.

  // Size override
  // Allow custom height class if provided (e.g. from config)
  const heightClass = customHeight || heights[size] || 'h-10'; // Default to h-10 if unknown

  const imgClass = `${heightClass} mt-0 mb-0 object-contain transition-all duration-500 group-hover:scale-[1.02] group-hover:brightness-110`;

  return (
    <div className={`flex items-center gap-3 group transition-all duration-300 ${className}`}>
      <img
        src={logoSrc}
        alt="MD Solution Marketing e Consultoria"
        className={imgClass}
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
