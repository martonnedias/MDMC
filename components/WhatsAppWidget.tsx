import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';

const WhatsAppWidget: React.FC = () => {
  const { config } = useSiteConfig();
  return (
    <a
      href={`https://wa.me/${config.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle size={28} fill="white" className="text-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium pl-0 group-hover:pl-2 text-white">
        Fale conosco
      </span>
    </a>
  );
};

export default WhatsAppWidget;