const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function fixJson() {
    console.log('Fetching services to check for broken JSON features...');
    const { data: services, error } = await supabase.from('services_data').select('*');

    if (error) {
        console.error('Error fetching:', error.message);
        return;
    }

    for (const s of services) {
        let features = s.features;
        let needsFix = false;

        // Check if it's a string that looks like it should be an array
        if (typeof features === 'string') {
            try {
                // Try to parse as JSON first
                const parsed = JSON.parse(features);
                if (Array.isArray(parsed)) {
                    console.log(`[${s.id}] Features is a valid JSON string array. No fix needed.`);
                } else {
                    console.log(`[${s.id}] Features is a string: "${features}". Converting to [string].`);
                    features = [features];
                    needsFix = true;
                }
            } catch (e) {
                // If it's not JSON, maybe it's just a raw comma-separated string or just a text
                console.log(`[${s.id}] Features is raw string: "${features}". Converting to array.`);
                if (features.includes(',')) {
                    features = features.split(',').map(f => f.trim());
                } else {
                    features = [features];
                }
                needsFix = true;
            }
        } else if (features === null) {
            // Only fix if it's supposed to be an array but it's null
            // Most pricing items should have features
            if (s.section_id === 'pricing' || s.category === 'sites') {
                console.log(`[${s.id}] Features is null. Setting to [].`);
                features = [];
                needsFix = true;
            }
        }

        if (needsFix) {
            console.log(`Updating [${s.id}] with:`, features);
            const { error: upError } = await supabase
                .from('services_data')
                .update({ features })
                .eq('id', s.id);

            if (upError) console.error(`Failed to update ${s.id}:`, upError.message);
            else console.log(`✓ Fixed ${s.id}`);
        }
    }
    console.log('JSON Fix Complete.');
}

fixJson();
