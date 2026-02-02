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
    logo_url?: string;
    theme?: {
        colors?: {
            background: string;
            card_background: string;
            header_background: string;
            footer_background: string;
            text_primary: string;
            text_secondary: string;
        };
        typography?: {
            font_family: string;
            heading_font: string;
        };
        border_radius?: string;
    };
    content?: {
        hero_title?: string;
        hero_subtitle?: string;
        hero_cta?: string;
        sections?: {
            [key: string]: {
                title?: string;
                subtitle?: string;
                background_color?: string;
                text_color?: string;
                button_text?: string;
            }
        }
    };
}

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    category: string;
    status: 'published' | 'draft';
    created_at?: string;
    likes?: number;
    dislikes?: number;
    views?: number;
}

export interface BlogComment {
    id?: string;
    post_id: string;
    parent_id?: string | null;
    author_name: string;
    content: string;
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
    subtitle?: string;
    cta_text?: string;
    badge_text?: string;
    extra_info?: string;
    is_highlighted?: boolean;
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
            .upsert({ ...config, id: 1 });

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

    async syncDefaultServices(defaults: ServiceData[]): Promise<boolean> {
        try {
            for (const service of defaults) {
                const { data: existing } = await supabase
                    .from('services_data')
                    .select('id')
                    .eq('name', service.name)
                    .eq('category', service.category)
                    .maybeSingle();

                if (!existing) {
                    await this.saveService(service);
                }
            }
            return true;
        } catch (error) {
            console.error('Erro na sincronização:', error);
            return false;
        }
    }

    async deleteService(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('services_data')
            .delete()
            .eq('id', id);
        return !error;
    }

    async uploadImage(file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `blog/${fileName}`;

            // Bucket 'assets' deve existir no Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);

            if (uploadError) {
                console.warn('Erro no upload Storage, usando Base64 fallback:', uploadError);
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            }

            const { data } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err) {
            console.error('Erro fatal no uploadImage:', err);
            return null;
        }
    }

    async getComments(postId: string): Promise<BlogComment[]> {
        const { data, error } = await supabase
            .from('blog_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao buscar comentários:', error);
            return [];
        }
        return data || [];
    }

    async addComment(comment: BlogComment): Promise<BlogComment | null> {
        const { data, error } = await supabase
            .from('blog_comments')
            .insert(comment)
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar comentário:', error);
            return null;
        }
        return data;
    }

    async reactToPost(postId: string, type: 'like' | 'dislike'): Promise<boolean> {
        const { data: post } = await supabase
            .from('blog_posts')
            .select('likes, dislikes')
            .eq('id', postId)
            .single();

        if (!post) return false;

        const updateData: any = {};
        if (type === 'like') {
            updateData.likes = (post.likes || 0) + 1;
        } else {
            updateData.dislikes = (post.dislikes || 0) + 1;
        }

        const { error } = await supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', postId);

        return !error;
    }

    async incrementViewCount(postId: string): Promise<void> {
        try {
            const { data } = await supabase
                .from('blog_posts')
                .select('views')
                .eq('id', postId)
                .single();

            await supabase
                .from('blog_posts')
                .update({ views: (data?.views || 0) + 1 })
                .eq('id', postId);
        } catch (error) {
            console.error('Erro ao incrementar views:', error);
        }
    }

    async getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('likes', { ascending: false }) // Use likes as popularity for now
            .limit(limit);

        return data || [];
    }
}

export const adminService = new AdminService();
