
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://miadxjhglynefwufxajd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FuSHF0wsibMSHO1dscVYGg_GIjj41g9';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSanity() {
    try {
        const { data: services, error: serviceError } = await supabase
            .from('services_data')
            .select('*');

        if (serviceError) {
            console.error('Error:', serviceError);
            return;
        }

        console.log(`Checking ${services.length} services...`);

        // Check for broken JSON in features
        services.forEach(s => {
            if (typeof s.features === 'string') {
                try {
                    JSON.parse(s.features);
                } catch (e) {
                    console.warn(`[${s.id}] BROKEN FEATURES STRING:`, s.features);
                }
            }
        });

        // Check for empty names
        const emptyNames = services.filter(s => !s.name);
        if (emptyNames.length > 0) {
            console.warn('Items with empty names found:', emptyNames.length);
        }

        // Check mapping to pages (which we know are missing)
        const untagged = services.filter(s => !s.page);
        console.log(`Untagged items: ${untagged.length}`);

    } catch (err) {
        console.error(err);
    }
}

checkSanity();
