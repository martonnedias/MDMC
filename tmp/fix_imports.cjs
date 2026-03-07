const fs = require('fs');
const path = require('path');

const walk = function (dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

const components = ['SectionTitle', 'Button', 'SEO', 'Layout', 'Header', 'Footer', 'Toast', 'Faq', 'ProgressIndicator', 'PainPoints', 'Testimonials', 'Combos', 'Consultancy', 'CookieConsent', 'ErrorBoundary', 'FadeIn', 'Hero', 'Logo', 'MDConverteSection', 'ManifestoBanner', 'MarketingReport', 'Pricing', 'Services', 'ShareButtons', 'SitesAndLandingPages', 'SwotReport', 'SwotSection', 'Trust', 'TrustSeals', 'WhatsAppWidget'];

walk('C:\\Users\\tonne\\SITES\\MD-Solution\\src\\pages', function (err, results) {
    if (err) throw err;
    let fixedCount = 0;
    results.forEach(file => {
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;

        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        // Fix component imports like from './Button', '../../Button'
        components.forEach(comp => {
            const regex = new RegExp(`from\\s+['"](\\.\\/|\\.\\.\\/)+${comp}['"]`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, `from '@/src/components/${comp}'`);
                changed = true;
            }

            const regexIndex = new RegExp(`from\\s+['"](\\.\\/|\\.\\.\\/)+components\\/${comp}['"]`, 'g');
            if (regexIndex.test(content)) {
                content = content.replace(regexIndex, `from '@/src/components/${comp}'`);
                changed = true;
            }
        });

        // Fix AuthProvider import
        const authRegex = /from\s+['"](\.\/|\.\.\/)+Auth\/AuthProvider['"]/g;
        if (authRegex.test(content)) {
            content = content.replace(authRegex, `from '@/src/components/Auth/AuthProvider'`);
            changed = true;
        }
        const authRegex2 = /from\s+['"](\.\/|\.\.\/)+components\/Auth\/AuthProvider['"]/g;
        if (authRegex2.test(content)) {
            content = content.replace(authRegex2, `from '@/src/components/Auth/AuthProvider'`);
            changed = true;
        }

        // Fix lib imports
        const libRegex = /from\s+['"](\.\/|\.\.\/)+lib\/(SiteContext|formatters|supabase|useCart)['"]/g;
        if (libRegex.test(content)) {
            content = content.replace(libRegex, `from '@/src/lib/$2'`);
            changed = true;
        }

        // Fix services imports
        const serviceRegex = /from\s+['"](\.\/|\.\.\/)+services\/(leadService|adminService|aiService)['"]/g;
        if (serviceRegex.test(content)) {
            content = content.replace(serviceRegex, `from '@/src/services/$2'`);
            changed = true;
        }

        // Fix constants import
        const constantsRegex = /from\s+['"](\.\/|\.\.\/)+constants['"]/g;
        if (constantsRegex.test(content)) {
            content = content.replace(constantsRegex, `from '@/src/constants'`);
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('✔ Imports consertados em:', path.basename(file));
            fixedCount++;
        }
    });
    console.log(`\nFinalizado. ${fixedCount} arquivos modificados com sucesso.`);
});
