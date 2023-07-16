const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const {
    executablePath,
    getvideos,
    manualComment,
} = require('puppeteer');
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');
const selector = require("./modules/constant/selector/selectorindex");
const {
    Config
} = require("./modules/constant/BrowserConfig")
const {
    randomUserAgent
} = require('./modules');

const spinners = new Spinners(cliSpinners.star.frames, {
    text: 'Loading',
    stream: process.stdout,
    onTick(frame, index) {
        process.stdout.write(frame);
    },
});
puppeteer.use(StealthPlugin);
const paths = `${process.cwd()}/ublock`;
const delay = () => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 30000)));

const certaindelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

StealthPlugin.enabledEvasions.delete('iframe.contentWindow');
['chrome.runtime', 'navigator.languages'].forEach((a) => StealthPlugin.enabledEvasions.delete(a));

async function autoyt(browserconfig) {
    const config = require('./config');

    const browser = await puppeteer.launch({
        ...browserConfig,
        executablePath: executablePath(),
    });

    const cookiesFile = fs.readFileSync('cookieslist.json', 'utf-8');
    const cookiesList = JSON.parse(cookiesFile);
    const totalCookieSets = cookiesList.length;

    for (let currentIndex = 0; currentIndex < totalCookieSets; currentIndex++) {
        const currentCookieSet = cookiesList[currentIndex];

        const page = await browser.newPage();
        await page.setViewport({
            width: 1366,
            height: 768
        });
        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });
        await page.setUserAgent(randomUserAgent.UA());

        const cookies = currentCookieSet.map(cookie => {
            const {sameSite, ...rest} = cookie;
            return sameSite ? {...rest, sameSite} : rest;
        });

        try {
            await page.setCookie(...cookies);
        } catch (error) {
            console.error('Error setting cookies:', error);
        }

        const waitForNavigation = page.waitForNavigation();

        await Promise.all([page.goto(config.profile)]);
        await waitForNavigation;

        await page.click(selector.videosTab);
        await delay();

        try {
            await getvideos.extracturls(pages);
        } catch (error) {
            console.log(error);
            await browser.close();
        }

        const durationInSeconds = convertions(durationText);
        const waitTime = durationInSeconds / 2;

        // Watch half of the video
        await videoPage.waitForTimeout(waitTime * 1000);

        await pages.waitForTimeout(4000);
        await pages.evaluate(() => {
            window.scrollBy(0, 550);
        });

        try {
            spinners.add('comment', {
                text: 'Now commenting in the video..',
                color: 'yellow',
            });
            await pages.waitForSelector(selector.catchErrorInComment, {
                timeout: 4000
            });
            spinners.update('comment', {
                text: 'Comments Disabled',
                color: 'red',
            });
            try {
                await pages.evaluate(() => {
                    window.scrollBy(0, -550);
                });
                await likeVideos.likeVideos(pages);
            } catch (error) {
                console.log(error);
            }
            await delay();
            await pages.close();
        } catch {
            await pages.waitForSelector(selector.inputComment, {
                timeout: 4000,
            });
            await pages.evaluate(() => {
                document.querySelector('div#placeholder-area').click();
            });
            await manualComment.manualComment(pages, spinners, config);
            await autoscroll._autoScroll(pages);
            spinners.succeed('comment', {
                text: 'Success commenting',
                color: 'green',
            });

            try {
                Logger.log('./logs/succesCommenting.log', config.usernamegoogle, tweet, 'success')
            } catch (e) {
                console.log(e);
                Logger.log('./logs/errorCommenting.log', config.usernamegoogle, tweet, 'failed', e)
            }
        }
        await videoPage.close();
        completedVideos.add(link.url);
    }
    await page.close();
}

// Helper function to convert video duration to seconds
function convertions(durationText) {
    const timeParts = durationText.split(':');
    const hours = parseInt(timeParts[0]) || 0;
    const minutes = parseInt(timeParts[1]) || 0;
    const seconds = parseInt(timeParts[2]) || 0;

    return (hours * 3600) + (minutes * 60) + seconds;
}

function readLog() {
    const data = fs.readFileSync('./logs/succesCommenting.log', 'utf8');
    return data;
}


const browserConfig = Config();
autoyt(browserConfig);
