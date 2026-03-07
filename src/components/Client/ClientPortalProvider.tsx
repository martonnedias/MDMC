import React, { createContext, useContext, ReactNode } from 'react';
import { useClientPortal } from '../../hooks/useClientPortal';

interface ClientPortalContextType {
    loading: boolean;
    activeTenant: any;
    stats: { openTickets: number; pendingContracts: number; openProposals: number };
    tenants: any[];
    setActiveTenant: (tenant: any) => void;
    refreshStats: () => Promise<void>;
    error: string | null;
}

const ClientPortalContext = createContext<ClientPortalContextType | undefined>(undefined);

export const ClientPortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const portalData = useClientPortal();

    return (
        <ClientPortalContext.Provider value={portalData}>
            {children}
        </ClientPortalContext.Provider>
    );
};

export const usePortal = () => {
    const context = useContext(ClientPortalContext);
    if (context === undefined) {
        throw new Error('usePortal must be used within a ClientPortalProvider');
    }
    return context;
};
