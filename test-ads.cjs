require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function check() {
    const { data } = await supabase.from('services_data').select('*');
    const adsItems = data.filter(s => (s.page === 'ads' || s.category === 'marketing') && s.is_active !== false);
    const plans = adsItems.filter(i => i.section_id === 'pricing' || !i.section_id);
    console.log('PLANS TO DISPLAY:', plans.map(p => ({ name: p.name, page: p.page, category: p.category, section: p.section_id })));
}
check();
