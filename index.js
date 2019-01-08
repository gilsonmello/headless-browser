const puppeteer = require('puppeteer');

(async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.on('requestfailed', function(request) {
        console.log("Request error! ", request.url(), request.resourceType());
    });
    await page.on("request", (request) => {
        if (request.resourceType() === "image" || request.resourceType() === "font" || request.resourceType() === "media") {
            console.log("Request intercepted! ", request.url(), request.resourceType());
            request.abort();
        } else {
            console.log("Request intercepted! ", request.url(), request.resourceType());
            request.continue();
        } 
    });
    await page.setDefaultNavigationTimeout(100000);
    await page.goto(url, {
        waitUntil: 'load',
        waitLoad: true, 
        waitNetworkIdle: true,
        networkIdle2Timeout: 9000,
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    await page.waitFor(10000);
    await page.screenshot({path: 'example.png'});

    await browser.close();
})('http://lottoyou.classicred.com.br/scratch_cards');

