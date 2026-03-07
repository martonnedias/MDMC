import React, { useState, useEffect } from 'react';
import {
    User,
    Bell,
    Shield,
    Save,
    Camera,
    Mail,
    Phone,
    Globe
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { supabase } from '../../lib/supabase';

export const ClientSettings: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (data) setProfile(data);
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || saving) return;

        try {
            setSaving(true);
            const formData = new FormData(e.target as HTMLFormElement);
            const updates = {
                id: user.id,
                full_name: formData.get('full_name'),
                phone: formData.get('phone'),
                website: formData.get('website'),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            setProfile(updates);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            alert('Erro ao salvar alterações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie suas preferências de perfil, notificações e segurança.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navegação de Siderbar de Configurações */}
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold transition-all text-left">
                        <User size={18} />
                        Perfil
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-all text-left">
                        <Bell size={18} />
                        Notificações
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl font-medium transition-all text-left">
                        <Shield size={18} />
                        Segurança
                    </button>
                </div>

                {/* Área de Formulário */}
                <form onSubmit={handleSave} className="lg:col-span-3 space-y-8">
                    {/* Card de Perfil */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-blue-500 transition-colors">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-600" />
                                    )}
                                </div>
                                <button type="button" title="Alterar Foto de Perfil" className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{profile?.full_name || user?.email?.split('@')[0]}</h3>
                                <p className="text-gray-500 text-sm">Acesso Cliente • MD Solution</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="profile-fullname" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        id="profile-fullname"
                                        name="full_name"
                                        type="text"
                                        defaultValue={profile?.full_name || ''}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="profile-email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        id="profile-email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        disabled
                                        className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-gray-500 cursor-not-allowed outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="profile-phone" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Telefone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        id="profile-phone"
                                        name="phone"
                                        type="text"
                                        defaultValue={profile?.phone || ''}
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="profile-website" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        id="profile-website"
                                        name="website"
                                        type="text"
                                        defaultValue={profile?.website || ''}
                                        placeholder="https://seu-site.com"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                            >
                                <Save size={20} />
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>

                    {/* Ajuda com a Conta */}
                    <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                        <h4 className="text-rose-200 font-bold mb-2">Ajuda com a Conta</h4>
                        <p className="text-rose-100/60 text-sm mb-6 leading-relaxed">
                            Caso precise realizar alterações estruturais em sua conta ou tenant, entre em contato diretamente com nossa equipe de suporte para assistência personalizada.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
