
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
    console.log('Testing Supabase connection...');

    // Check site_config
    const { data: config, error: configError } = await supabase.from('site_config').select('*');
    if (configError) console.error('Error fetching site_config:', configError);
    else console.log('site_config:', config);

    // Check blog_posts
    const { data: posts, error: postsError } = await supabase.from('blog_posts').select('*');
    if (postsError) console.error('Error fetching blog_posts:', postsError);
    else console.log('blog_posts count:', posts?.length || 0);

    // Check services_data
    const { data: services, error: servicesError } = await supabase.from('services_data').select('*');
    if (servicesError) console.error('Error fetching services_data:', servicesError);
    else console.log('services_data count:', services?.length || 0);
}

debug();
