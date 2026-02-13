import React from 'react';

interface SectionTitleProps {
  title: string | React.ReactNode;
  subtitle?: string;
  badge?: string;
  alignment?: 'left' | 'center';
  light?: boolean;
}


const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badge,
  alignment = 'center',
  light = false
}) => {
  return (
    <div className={`mb-12 lg:mb-16 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      {badge && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border ${light
          ? 'bg-white/10 text-white border-white/20'
          : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'
          }`}>
          {badge}
        </span>
      )}

      {typeof title === 'string' ? (
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tighter leading-[1.1] ${light ? 'text-white' : 'text-brand-darkBlue'
            }`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      ) : (
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tighter leading-[1.1] ${light ? 'text-white' : 'text-brand-darkBlue'
            }`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p className={`text-xl lg:text-2xl max-w-3xl font-medium leading-relaxed ${alignment === 'center' ? 'mx-auto' : ''
          } ${light ? 'text-blue-100/90' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}

      <div className={`mt-8 flex ${alignment === 'center' ? 'justify-center' : 'justify-start'} gap-1.5`}>
        <div className="h-1.5 w-20 bg-brand-orange rounded-full" />
        <div className={`h-1.5 w-6 rounded-full ${light ? 'bg-white/30' : 'bg-brand-blue opacity-60'}`} />
      </div>
    </div>
  );
};


export default SectionTitle;
