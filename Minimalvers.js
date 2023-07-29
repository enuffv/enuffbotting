const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const {
    executablePath
} = require('puppeteer');
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');
const selector = require('./modules/constant/selector/selectorindex');
const {
    Config
} = require('./modules/constant/BrowserConfig');
const {
    randomUserAgent,
    Logger,
    getvideos,
    manualComment,
    likeVideos
} = require('./modules');


puppeteer.use(StealthPlugin);

const spinners = new Spinners(cliSpinners.star.frames, {
    text: 'Loading',
    stream: process.stdout,
    onTick(frame, index) {
        process.stdout.write(frame);
    },
});

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

spinners.add('comment', {
    text: 'Loading',
    color: 'yellow',
});

StealthPlugin.enabledEvasions.delete('iframe.contentWindow');
['chrome.runtime', 'navigator.languages'].forEach((a) => StealthPlugin.enabledEvasions.delete(a));
const paths = `${process.cwd()}/ublock`;

async function autoyt(paths, browserConfig, readLog) {
    const config = require('./config');

    let browser = null;

    const proxyList = fs.readFileSync(config.proxiesFile, 'utf-8').split('\n').map(line => line.trim());
    let proxyIndex = 0; // Keep track of the current proxy index

    let page = null;
    let proxyWorks = false;

    const proxy = proxyList[proxyIndex];
    while (true) {

        if (browser) {
            await page.close();
        } else {
            browser = await puppeteer.launch({
                ...browserConfig,
                executablePath: executablePath(),
                args: [`--proxy-server=${proxy}`],
            });
        }

        page = await browser.newPage();

        try {
            await page.setViewport({
                width: 1366,
                height: 768,
            });
            await page.evaluateOnNewDocument(() => {
                delete navigator.__proto__.webdriver;
            });
            await page.setUserAgent(randomUserAgent.UA());

            await Promise.all([page.goto(config.profile)]);
            page.waitForNavigation();
            // some code to try and find the youtube logo when it loads
            const destico = await page.waitForSelector('#logo-icon > yt-icon-shape > icon-shape > div', {
                visible: true,
              });
            if (destico) {
                proxyWorks = true;
                console.log(`${proxy} > connection: ✔️`);
                break;
            } 
            else () =>
                proxyWorks = false;
                await page.waitForTimeout(5000);
                console.log(`${proxy} > connection: ❌ -> ♻️.`);
    
                await browser.close();
                browser = null;
                proxyIndex = (proxyIndex + 1) % proxyList.length; // Increase proxy value for the line in text file
    
            } catch (error) {
                console.log(error);
            }
        }

    const cookiesFile = fs.readFileSync('cookieslist.json', 'utf-8');
    const cookiesList = JSON.parse(cookiesFile);
    const totalCookieSets = cookiesList.length;

    for (let currentIndex = 0; currentIndex < totalCookieSets; currentIndex++) {
        const currentCookieSet = cookiesList[currentIndex];

        await page.setViewport({
            width: 1452,
            height: 768,
        });
        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });
        await page.setUserAgent(randomUserAgent.UA());

        const cookies = currentCookieSet.map(cookie => {
            const {sameSite, ...rest} = cookie;
            return sameSite ? {...rest,sameSite} : rest;
        });

        try {
            await page.setCookie(...cookies);
            await page.reload({
                waitUntil: 'domcontentloaded'
            });
        } catch (error) {
            console.error('Error setting cookies:', error);
        }
        
        await page.waitForSelector(selector.videosTab, {
            timeout: 8000
        });
        await page.click(selector.videosTab);
        delay(8000);
        await getvideos.extracturls(proxy, page, readLog, manualComment, likeVideos, delay, spinners)
    }
    await browser.close();
}


module.exports = function readLog() {
    const data = fs.readFileSync('./logs/successCommenting.log', 'utf8');
    return data;
}

const browserConfig = Config(paths);
autoyt(paths, browserConfig).catch(error => console.error(error));
