require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
    const { data, error } = await supabase.from('blog_posts').select('id, slug');
    if (error) {
        console.error('Error fetching:', error);
        return;
    }
    for (const post of data) {
        let newSlug = post.slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (newSlug !== post.slug) {
            console.log(`Updating ${post.slug} to \n${newSlug}`);
            const { error: updateError } = await supabase.from('blog_posts').update({ slug: newSlug }).eq('id', post.id);
            if (updateError) {
                console.error('Error updating:', updateError);
            }
        }
    }
    console.log('Done slug fixing');
}
fix();
