const puppeteer = require('puppeteer');

(async () => {
    //   const browser = await puppeteer.launch({
    //     // headless: "new", // Set to true for headless mode
    //   });
    const path = require('path');
    // const browser = await puppeteer.launch({ headless: false })
    const browser = await puppeteer.launch({ 
        // executablePath: '/usr/local/bin/chromium',
        executablePath: '/usr/bin/chromium-browser',
        ignoreDefaultArgs: ['--mute-audio'],
        args: ['--autoplay-policy=no-user-gesture-required'],
        headless: "new", 
        // headless: false 
    })
    
    const page = await browser.newPage();
    // await page.waitForNavigation();

    const website = path.join('file:',__dirname, 'index.html');
    // const website = `file:${path.join(__dirname, 'index.html')}`;

    // console.log(stringPath);
    // console.log(website);
    await page.goto(website);
    //   await page.goto('www.google.com'); // Replace with the actual file path

    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second before clicking start audio .. 
    await page.click('#button_1');
    console.log('Clicking Start Audio button');

    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 seconds
    await page.click('#button_3');
    console.log('Clicking Run Websocket button');

    //   await browser.close();
})();
