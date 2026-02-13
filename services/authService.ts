import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export const authService = {
    /**
     * Obtém a sessão atual
     */
    async getSession(): Promise<Session | null> {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Erro ao buscar sessão:', error.message);
            return null;
        }
        return session;
    },

    /**
     * Obtém o usuário atual
     */
    async getUser(): Promise<User | null> {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Erro ao buscar usuário:', error.message);
            return null;
        }
        return user;
    },

    /**
     * Faz logout
     */
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error.message);
            throw error;
        }
    },

    /**
     * Escuta mudanças no estado de autenticação
     */
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
        return subscription;
    }
};
