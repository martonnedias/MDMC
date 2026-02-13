import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthPageProps {
    onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.name,
                        },
                    },
                });
                if (error) throw error;
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                    queryParams: {
                        prompt: 'select_account'
                    }
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login com Google.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1931] relative flex flex-col justify-start items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Elements - Glassmorphism Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>

            <div className="relative w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldCheck size={12} />
                        Acesso Seguro JWT
                    </div>

                    <h2 className="text-4xl font-black text-white tracking-tighter">
                        {isLogin ? 'Bem-vindo de volta' : 'Inicie sua jornada'}
                    </h2>
                    <p className="mt-3 text-gray-400 font-medium">
                        {isLogin ? 'Gerencie sua estratégia com precisão.' : 'Crie sua conta estratégica gratuitamente.'}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative group mt-4">
                    {/* Inner highlight blur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>

                    <form className="space-y-5 relative" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                        placeholder="Digite seu nome comercial"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                    placeholder="exemplo@mdsolution.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha Premium</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/20 disabled:opacity-50 group/btn"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    {isLogin ? 'Entrar no Hub' : 'Criar Conta Estratégica'}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                            <span className="px-4 bg-[#0A1931] text-gray-500">Ou acelere com</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google Cloud Identity
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 font-medium mt-10">
                    {isLogin ? 'Novo parceiro estratégico?' : 'Já possui credenciais?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="ml-2 text-blue-400 font-black hover:text-blue-300 underline-offset-4 hover:underline transition-all ring-0"
                    >
                        {isLogin ? 'Solicitar Acesso' : 'Fazer Login'}
                    </button>
                </p>

                <div className="flex justify-center items-center gap-6 pt-12 mt-12 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Sparkles size={12} className="text-orange-500" />
                        Intelligence Inside
                    </div>
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Validated Security
                    </div>
                </div>
            </div>
        </div>
    );
};
