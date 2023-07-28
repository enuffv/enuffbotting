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
    autoscroll,
    likeVideos
} = require('./modules');

const treeKill = require('tree-kill');


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

    while (true) {
        const proxy = proxyList[proxyIndex]; // Get the current proxy from the list

        if (browser) {
            // Close the previous page before navigating to the target page with a new proxy
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
            // If we reach this point, the proxy works and the target page loads successfully
            proxyWorks = true;
        } catch (error) {
            console.log(`${proxy} > not working, rotating next one`);
            proxyWorks = false;
        }

        if (proxyWorks) {
          // Break from the proxy loop if the proxy works and the target page loads successfully
          break;
        } else {
          // Wait for 5 seconds before using the next proxy
          await page.waitForTimeout(5000);
          await page.reload({ waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(3000);
        
          // Close the current browser and set up a new proxy
          await browser.close();
          browser = null;
          proxyIndex = (proxyIndex + 1) % proxyList.length; // Increment the proxy index and reset to 0 if it reaches the end of the list

        }        
    }

    // Rest of the code for performing browser page actions using the working proxy
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
            const {
                sameSite,
                ...rest
            } = cookie;
            return sameSite ? {
                ...rest,
                sameSite
            } : rest;
        });

        try {
            await page.setCookie(...cookies);
        } catch (error) {
            console.error('Error setting cookies:', error);
        }

        const waitForNavigation = page.waitForNavigation();

        await Promise.all([page.goto(config.profile)]);
        await waitForNavigation;

        await page.waitForSelector(selector.videosTab, { timeout: 8000 });
        await page.click(selector.videosTab);
        await delay(2550);

        try {
            await getvideos.extracturls(browser, page, spinners, readLog);
            spinners.succeed('comment', {
                text: 'Commenting On Video..',
                color: 'yellow',
            });
            await page.waitForSelector(selector.catchErrorInComment, {
                timeout: 4000,
            });
            spinners.update('comment', {
                text: 'Comments Disabled',
                color: 'red',
            });
            try {
                await page.evaluate(() => {
                    window.scrollBy(0, -550);
                });
                await page.evaluate(() => {
                    document.querySelector('div#placeholder-area').click();
                });
                const usrhandle = await page.evaluate(() => {
                    const element = document.querySelector('.style-scope.ytd-comment-renderer:first-child');
                    return element ? element.innerText : null;
                });
                const usrurl = await page.evaluate(() => {
                    const element = document.querySelector('#author-text:first-child');
                    return element ? element.href : null;
                });
                await manualComment.manualComment(page, spinners, config);
                await autoscroll._autoScroll(page);
                spinners.succeed('comment', {
                    text: `${usrhandle} Successfully Commented.`,
                    color: 'green',
                });
            } catch (error) {
                console.log(error);
            }
            await delay(4000);
            await likeVideos.likeVideos(page);

            try {
                Logger.log('./logs/successCommenting.log', usrhandle, usrurl, tweet, 'success');
            } catch (e) {
                console.log(e);
                Logger.log('./logs/errorCommenting.log', usrhandle, usrurl, tweet, 'failed', e);
            }
        } catch (error) {
            console.log(error);
            await browser.close();
        }

    }
    await browser.close();
}

module.exports = function readLog() {
    const data = fs.readFileSync('./logs/successCommenting.log', 'utf8');
    return data;
}

const browserConfig = Config(paths);
autoyt(paths, browserConfig).catch(error => console.error(error));
