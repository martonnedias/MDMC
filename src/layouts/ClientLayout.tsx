import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    Files,
    CreditCard,
    LifeBuoy,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell
} from 'lucide-react';
import { ClientPortalProvider, usePortal } from '../components/Client/ClientPortalProvider';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon size={20} className={active ? 'text-white' : 'group-hover:text-white transition-colors'} />
        <span className="font-medium">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
    </Link>
);

const ClientLayoutContent = () => {
    const { user, signOut } = useAuth();
    const { activeTenant, loading: portalLoading } = usePortal();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { to: '/cliente', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/cliente/relatorios', icon: FileText, label: 'Relatórios' },
        { to: '/cliente/aprovacoes', icon: CheckSquare, label: 'Aprovações' },
        { to: '/cliente/arquivos', icon: Files, label: 'Arquivos' },
        { to: '/cliente/financeiro', icon: CreditCard, label: 'Financeiro' },
        { to: '/cliente/suporte', icon: LifeBuoy, label: 'Suporte' },
    ];

    if (portalLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Sincronizando seu Painel...</p>
        </div>
    );

    if (!activeTenant) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-10 text-center">
            <div className="max-w-md space-y-6">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                    <LifeBuoy size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
                <p className="text-gray-400">Sua conta ainda não está vinculada a nenhuma empresa no MD Solution. Entre em contato com nosso suporte para ativar seu acesso.</p>
                <button onClick={() => signOut()} className="px-8 py-3 bg-gray-900 border border-gray-800 text-white rounded-2xl font-bold">Encerrar Sessão</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex overflow-hidden">
            {/* Overlay para mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Desktop */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 transform
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <span className="text-xl font-bold">MD</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-blue-500 uppercase tracking-tighter">MD Portal</span>
                            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent truncate max-w-[140px] block">
                                {activeTenant?.name || 'Cliente'}
                            </span>
                        </div>
                    </div>
                    <button
                        className="lg:hidden text-gray-400"
                        onClick={() => setSidebarOpen(false)}
                        title="Fechar Menu Lateral"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                    {navigation.map((item) => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.to}
                            onClick={() => setSidebarOpen(false)}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <SidebarItem
                        to="/cliente/configuracoes"
                        icon={Settings}
                        label="Configurações"
                        active={location.pathname === '/cliente/configuracoes'}
                        onClick={() => setSidebarOpen(false)}
                    />
                    <button
                        onClick={() => signOut()}
                        title="Sair do Portal"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-400"
                            onClick={() => setSidebarOpen(true)}
                            title="Abrir Menu Lateral"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden lg:block text-gray-400 font-medium truncate max-w-xs">
                            {activeTenant?.name} • <span className="text-gray-600 text-xs text-nowrap">ID: {activeTenant?.id?.slice(0, 8)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 text-gray-400 hover:text-white transition-colors"
                            title="Ver Notificações"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-gray-900" />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-800 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-white">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{activeTenant?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export const ClientLayout: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) {
        return <Navigate to="/acesso" replace />;
    }

    return (
        <ClientPortalProvider>
            <ClientLayoutContent />
        </ClientPortalProvider>
    );
};
