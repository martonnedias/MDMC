
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://miadxjhglynefwufxajd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FuSHF0wsibMSHO1dscVYGg_GIjj41g9';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
    try {
        const { data: services, error: serviceError } = await supabase
            .from('services_data')
            .select('*');

        if (serviceError) {
            console.error('Service Error:', serviceError);
        } else {
            console.log(`Found ${services.length} services.`);
            services.forEach(s => {
                console.log(`ID: ${s.id} | Name: "${s.name}" | Page: "${s.page}" | Sec: "${s.section_id}" | Cat: "${s.category}" | Ord: ${s.display_order}`);
            });
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

checkData();
