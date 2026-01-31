
import React from 'react';
import { Share2, MessageCircle, Facebook, Linkedin, Link2 } from 'lucide-react';

interface ShareButtonsProps {
    title: string;
    url?: string;
    className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, className = '' }) => {
    const currentUrl = url || window.location.href;
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(currentUrl);

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: 'bg-[#25D366] hover:bg-[#128C7E]'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'bg-[#1877F2] hover:bg-[#0d65d9]'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'bg-[#0A66C2] hover:bg-[#084d91]'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUrl);
        alert('Link copiado para a área de transferência!');
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                <Share2 size={12} /> Compartilhar
            </div>
            <div className="flex flex-wrap gap-2">
                {shareLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all duration-300 ${link.color} shadow-lg shadow-black/5 hover:scale-105 active:scale-95`}
                    >
                        <link.icon size={14} /> {link.name}
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold transition-all duration-300 hover:bg-gray-200 shadow-lg shadow-black/5 hover:scale-105 active:scale-95"
                >
                    <Link2 size={14} /> Copiar Link
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
