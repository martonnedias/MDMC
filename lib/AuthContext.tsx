import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Inicializa a sessão
        const initializeAuth = async () => {
            try {
                const currentSession = await authService.getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
            } catch (error) {
                console.error('Falha ao inicializar autenticação:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Escuta mudanças (sign in, sign out, token refresh)
        const { unsubscribe } = authService.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
