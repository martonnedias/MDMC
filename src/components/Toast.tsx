import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-emerald-50 border-emerald-100 text-emerald-800",
        error: "bg-red-50 border-red-100 text-red-800",
        info: "bg-blue-50 border-blue-100 text-blue-800"
    };

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    return (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-toast-in flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-sm ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-black tracking-tight">{message}</p>
            <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};
