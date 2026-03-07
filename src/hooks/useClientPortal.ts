import { useState, useEffect, useCallback } from 'react';
import { clientService, Ticket, Invoice, Contract } from '../services/clientService';
import { useAuth } from '../components/Auth/AuthProvider';

export const useClientPortal = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tenants, setTenants] = useState<any[]>([]);
    const [activeTenant, setActiveTenant] = useState<any>(null);
    const [stats, setStats] = useState({ openTickets: 0, pendingContracts: 0, openProposals: 0 });
    const [error, setError] = useState<string | null>(null);

    const loadInitialData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const myTenants = await clientService.getMyTenants();
            setTenants(myTenants);

            if (myTenants.length > 0) {
                // Por padrão, pega o primeiro tenant
                const tenant = myTenants[0].tenants;
                setActiveTenant({
                    ...tenant,
                    role: myTenants[0].role
                });

                const dashboardStats = await clientService.getDashboardStats(tenant.id);
                setStats(dashboardStats);
            }
        } catch (err: any) {
            console.error('Erro ao carregar dados do portal:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const refreshStats = async () => {
        if (activeTenant) {
            const dashboardStats = await clientService.getDashboardStats(activeTenant.id);
            setStats(dashboardStats);
        }
    };

    return {
        loading,
        tenants,
        activeTenant,
        setActiveTenant,
        stats,
        error,
        refreshStats
    };
};
