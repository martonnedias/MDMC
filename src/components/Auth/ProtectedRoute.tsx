import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    adminOnly = false
}) => {
    const { user, isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/acesso');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">
                        Verificando credenciais...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (adminOnly && !isAdmin) {
        setTimeout(() => {
            alert('Acesso Negado: Seu usuário não tem permissão de administrador.');
            navigate('/');
        }, 0);
        return null;
    }

    return <>{children}</>;
};
