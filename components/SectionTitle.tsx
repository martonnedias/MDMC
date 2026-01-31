import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  alignment = 'center',
  light = false
}) => {
  return (
    <div className={`mb-8 lg:mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${alignment === 'center' ? 'mx-auto' : ''} ${light ? 'text-blue-100' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 lg:mt-6 flex ${alignment === 'center' ? 'justify-center' : 'justify-start'} gap-1`}>
        <div className="h-1.5 w-24 bg-brand-orange rounded-full" />
        <div className="h-1.5 w-8 bg-brand-gold rounded-full opacity-60" />
      </div>
    </div>
  );
};

export default SectionTitle;