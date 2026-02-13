
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://miadxjhglynefwufxajd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FuSHF0wsibMSHO1dscVYGg_GIjj41g9';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixData() {
    try {
        console.log('--- Fetching Services to Fix ---');
        const { data: services, error: fetchError } = await supabase
            .from('services_data')
            .select('*');

        if (fetchError) {
            console.error('Fetch Error:', fetchError);
            return;
        }

        console.log(`Analyzing ${services.length} items...`);

        for (const s of services) {
            let updates = {};
            let needsFix = false;

            // Map Category to Page if Page is missing
            if (!s.page || s.page === 'undefined') {
                needsFix = true;
                if (s.category === 'marketing') updates.page = 'ads';
                else if (s.category === 'swot') updates.page = 'swot-service';
                else if (s.category === 'gmb') updates.page = 'gmb';
                else if (s.category === 'combos') updates.page = 'landing';
                else if (s.category === 'social_media') updates.page = 'social-media';
                else updates.page = 'landing'; // default
            }

            // Set Section ID if missing
            if (!s.section_id || s.section_id === 'undefined') {
                needsFix = true;
                updates.section_id = 'pricing'; // Most current items are pricing plans
            }

            // Ensure is_active is boolean true if null
            if (s.is_active === null) {
                needsFix = true;
                updates.is_active = true;
            }

            if (needsFix) {
                console.log(`Fixing [${s.id}] "${s.name}":`, updates);
                const { error: updateError } = await supabase
                    .from('services_data')
                    .update(updates)
                    .eq('id', s.id);

                if (updateError) console.error(`  Error fixing ${s.id}:`, updateError);
                else console.log(`  Fixed.`);
            }
        }

        console.log('--- DONE ---');
    } catch (err) {
        console.error('Exception:', err);
    }
}

fixData();
