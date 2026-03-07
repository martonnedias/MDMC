import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';

export const AdminLayout: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-8 text-center text-gray-500">Caregando...</div>;

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Futuro: Verificar se é role de admin de fato
    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">
            <Outlet />
        </div>
    );
};
