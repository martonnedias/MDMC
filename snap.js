const { run } = require('react-snap');

run({
    include: ["/", "/blog", "/showcase"],
    source: "dist",
    puppeteerArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
    ],
    puppeteerExecutablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
}).catch(error => {
    console.error(error);
    process.exit(1);
});
