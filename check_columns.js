
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://miadxjhglynefwufxajd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FuSHF0wsibMSHO1dscVYGg_GIjj41g9';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkColumns() {
    try {
        console.log('--- Testing "page" column existence ---');
        const { data, error } = await supabase
            .from('services_data')
            .select('page')
            .limit(1);

        if (error) {
            console.error('Column "page" does NOT seem to exist:', error.message);
        } else {
            console.log('Column "page" exists.');
        }

        console.log('\n--- Testing "section_id" column existence ---');
        const { data: data2, error: error2 } = await supabase
            .from('services_data')
            .select('section_id')
            .limit(1);

        if (error2) {
            console.error('Column "section_id" does NOT seem to exist:', error2.message);
        } else {
            console.log('Column "section_id" exists.');
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

checkColumns();
