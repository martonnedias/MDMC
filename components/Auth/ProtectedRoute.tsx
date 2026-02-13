import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    onNavigate: (view: any) => void;
    adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    onNavigate,
    adminOnly = false
}) => {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            // Salva a intenção de acesso para redirecionar após login (opcional)
            onNavigate('auth');
        }
    }, [user, loading, onNavigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">
                        Verificando credenciais JWT...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // O useEffect cuidará do redirecionamento
    }

    // Se adminOnly for true, verifica se o e-mail está na lista de permitidos
    if (adminOnly) {
        const allowedEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim());

        if (!user.email || !allowedEmails.includes(user.email)) {
            // Se não estiver na lista, redireciona para a home
            // Usamos um setTimeout para evitar warning de atualização durante render
            setTimeout(() => {
                alert('Acesso Negado: Seu usuário não tem permissão de administrador.');
                onNavigate('landing');
            }, 0);
            return null;
        }
    }

    return <>{children}</>;
};
