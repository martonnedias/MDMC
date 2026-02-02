import { supabase } from '../lib/supabase';

export interface SiteConfig {
    id: number;
    site_name: string;
    phone: string;
    whatsapp: string;
    instagram_url: string;
    facebook_url: string;
    youtube_url: string;
    primary_color: string;
    secondary_color: string;
    is_blog_active: boolean;
    is_swot_active: boolean;
}

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    category: string;
    status: 'draft' | 'published';
    created_at?: string;
}

export interface ServiceData {
    id?: string;
    name: string;
    description: string;
    price: string;
    features: string[];
    category: string;
    is_active: boolean;
    display_order: number;
}

class AdminService {
    async getSiteConfig(): Promise<SiteConfig | null> {
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .single();

        if (error) {
            console.error('Erro ao buscar config:', error);
            return null;
        }
        return data;
    }

    async updateSiteConfig(config: Partial<SiteConfig>): Promise<boolean> {
        const { error } = await supabase
            .from('site_config')
            .update(config)
            .eq('id', 1);

        return !error;
    }

    async getBlogPosts(): Promise<BlogPost[]> {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        return data || [];
    }

    async saveBlogPost(post: BlogPost): Promise<boolean> {
        const { error } = await supabase
            .from('blog_posts')
            .upsert(post);

        return !error;
    }

    async deleteBlogPost(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        return !error;
    }

    async getServices(): Promise<ServiceData[]> {
        const { data, error } = await supabase
            .from('services_data')
            .select('*')
            .order('display_order', { ascending: true });

        return data || [];
    }

    async saveService(service: ServiceData): Promise<boolean> {
        const { error } = await supabase
            .from('services_data')
            .upsert(service);

        return !error;
    }
}

export const adminService = new AdminService();
