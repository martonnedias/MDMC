import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Credentials not found. Skipping sitemap generation.');
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const SITE_URL = 'https://mdsolution.com.br';

async function generateSitemap() {
    try {
        const now = new Date().toISOString();
        const urls = [
            { loc: '/', lastmod: now, priority: '1.0', changefreq: 'weekly' },
            { loc: '/sobre', lastmod: now, priority: '0.7', changefreq: 'monthly' },
            { loc: '/blog', lastmod: now, priority: '0.9', changefreq: 'daily' },
            { loc: '/planos', lastmod: now, priority: '0.9', changefreq: 'weekly' },
            // Serviços estáticos
            { loc: '/google-meu-negocio', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/anuncios-pagos', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/sites', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/consultoria', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/swot-service', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/social-media', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/crm', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            { loc: '/md-converte', lastmod: now, priority: '0.8', changefreq: 'monthly' },
            // Funis de conversão
            { loc: '/marketing-diagnosis', lastmod: now, priority: '0.7', changefreq: 'monthly' },
            { loc: '/planos-swot', lastmod: now, priority: '0.7', changefreq: 'monthly' },
            // Páginas estáticas adicionais
            { loc: '/teste-gratuito', lastmod: now, priority: '0.7', changefreq: 'monthly' },
            { loc: '/contato', lastmod: now, priority: '0.7', changefreq: 'monthly' },
            // Legal
            { loc: '/termos', lastmod: now, priority: '0.3', changefreq: 'yearly' },
            { loc: '/privacidade', lastmod: now, priority: '0.3', changefreq: 'yearly' },
            { loc: '/regras-comunidade', lastmod: now, priority: '0.3', changefreq: 'yearly' },
        ];

        // Fetch CMS Pages
        const { data: pages } = await supabase
            .from('cms_pages')
            .select('slug, updated_at, page_type')
            .eq('status', 'published')
            .eq('is_active', true);

        if (pages) {
            pages.forEach(page => {
                const prefix = page.page_type === 'service' ? 'servicos' : 'pagina';
                urls.push({
                    loc: `/${prefix}/${page.slug}`,
                    lastmod: new Date(page.updated_at || new Date()).toISOString(),
                    priority: '0.7',
                    changefreq: 'weekly'
                });
            });
        }

        // Fetch Services that have slugs (Direct Package Links)
        const { data: services } = await supabase
            .from('services_data')
            .select('slug, updated_at')
            .eq('is_active', true)
            .not('slug', 'is', null);

        if (services) {
            services.forEach(service => {
                if (service.slug) {
                    urls.push({
                        loc: `/servicos/${service.slug}`,
                        lastmod: new Date(service.updated_at || new Date()).toISOString(),
                        priority: '0.7',
                        changefreq: 'weekly'
                    });
                }
            });
        }

        // Fetch Blog Posts
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('status', 'published');

        if (posts) {
            posts.forEach(post => {
                urls.push({
                    loc: `/blog/${post.slug}`,
                    lastmod: new Date(post.updated_at || new Date()).toISOString(),
                    priority: '0.6',
                    changefreq: 'weekly'
                });
            });
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;


        // Ensure public folder exists
        const publicDir = path.resolve(__dirname, 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemap);
        console.log('✅ Sitemap gerado com sucesso em public/sitemap.xml');

    } catch (err) {
        console.error('❌ Erro gerando sitemap:', err);
    }
}

generateSitemap();
