const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const {
    executablePath
} = require('puppeteer');
const cliSpinners = require('cli-spinners');
const Spinners = require('spinnies');
const fs = require('fs');
const selector = require("./modules/constant/selector/selectorindex");
const {
    Config,
    manualComment
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

// async function MANUAL(browserconfig) {
//     const config = require('./config');
//     const useProxies = config.proxies;
//     let proxies = [];

//     if (useProxies) {
//         const proxiesFile = fs.readFileSync(config.proxiesFile, 'utf-8');
//         proxies = proxiesFile.split('\n');
//     }

//     const browser = await puppeteer.launch({
//         ...browserConfig,
//         executablePath: executablePath(),
//     });
//     const page = await browser.newPage();

//     const cookiesFile = fs.readFileSync('cookieslist.json', 'utf-8');
//     const cookiesList = JSON.parse(cookiesFile);
//     const totalCookieSets = cookiesList.length;

//     for (let currentIndex = 0; currentIndex < totalCookieSets; currentIndex++) {
//         const page = await browser.newPage();
//         await page.setViewport({
//             width: 1366,
//             height: 768
//         });
//         await page.evaluateOnNewDocument(() => {
//             delete navigator.__proto__.webdriver;
//         });
//         await page.setUserAgent(randomUserAgent.UA());

//         const currentCookieSet = cookiesList[currentIndex];
//         const currentProxy = useProxies ? proxies[currentIndex % proxies.length] : null;

//         const cookies = currentCookieSet.map(cookie => {
//             const {sameSite, ...rest} = cookie;
//             return sameSite ? {...rest, sameSite} : rest;
//         });

//         try {
//             await page.setCookie(...cookies);
//         } catch (error) {
//             console.error('Error setting cookies:', error);
//         }

//         await page.goto(config.profile);
//         await pages.evaluate(() => {
//             document.querySelector('#avatar-btn').click();
//         });
//         const handle = await pages.evaluate(() => {
//             document.querySelector('#channel-handle').innerHTML();
//         });

//         await delay();
//         await page.click(selector.videosTab);


//         await delay();
//         let linked = await Promise.all((await page.$$(selector.videoTitleinSearch)).map(async a => {
//             return {
//                 url: await (await a.getProperty('href')).jsonValue()
//             };
//         }));
//         const linkz = linked.filter((el) => el.url != null);
//         spinners.add('hasil', {
//             text: `FOUND: ${linkz.length} LINKS`,
//             color: 'yellow',
//         });
        
//         const link = linkz.sort(() => Math.random() - Math.random()).slice(0, Math.min(linkz.length));

//         for (let j = 0; j < link.length; j++) {
//             if (readLog().includes(link[j])) {
//                 spinners.add('already', {
//                     text: 'The video has been commented..',
//                     color: 'blue',
//                 });
//                 continue;
//             }
//             spinners.add('comment', {
//                 text: 'Now commenting in the video..',
//                 color: 'yellow',
//             });
//             const tweet = link[j].url;
//             const title = link[j].title;
//             page.goto(tweet);

//             // Wait for the video to load
//             await delay();

//             // Get the video duration
//             const videoDuration = await newPage.evaluate(() => {
//                 const video = document.querySelector('vid#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-durationeo');
//                 return video.duration;
//             });

//             // Watch half of the video
//             await newPage.waitForTimeout(videoDuration * 0.5 * 1000);

//             // Scroll down to load more comments
//             await newPage.evaluate(() => {
//                 const commentsSection = document.querySelector('#comments');
//                 commentsSection.scrollIntoView({
//                     behavior: 'smooth'
//                 });
//             });

//             // Get the total comment count
//             let commentCountText = await newPage.evaluate(() => {
//                 const commentCountElement = document.querySelector('#count > yt-formatted-string > span:nth-child(1)');
//                 return commentCountElement.innerText;
//             });

//             // Like the bot's own comment
//             if (commentCountText === "0") {
//                 await newPage.click(selector.likeComment);
//                 await delay(Math.floor(Math.random() * 4000) + 2000);
//             }

//             // Scroll up
//             await newPage.evaluate(() => {
//                 window.scrollBy(0, -500);
//             });

//             // Like the video
//             await newPage.click(selector.likeVideo);

//             // Watch the rest of the video
//             const remainingVideoTime = videoDuration - (videoDuration * 0.5);
//             await newPage.waitForTimeout(remainingVideoTime * 1000);
//             completedVideos.add(index);

//             // Go back to the previous page (YouTube homepage)
//             await newPage.goBack();

//             // Close the video tab
//             await newPage.close();

//             // Mark the video URL as completed
//             completedVideos.add(videoLink);
//         }

//         await pages.setUserAgent(randomUserAgent.UA());
//         try {
//             if (config.seqComment === true) {
//             } else {
//                 // console.log(tweet);
//             }
//             try {
//                 await likeVideos.likeVideos(config.likeAmount, pages);
//             } catch (error) {
//                 console.log(error);
//             }
//             await pages.bringToFront();
//             await pages.waitForTimeout(4000);
//             await pages.evaluate(() => {
//                 window.scrollBy(0, 550);
//             });
//             try {
//                 await pages.waitForSelector(selector.catchErrorInComment, {
//                     timeout: 4000
//                 });
//                 console.log("Can't Comment");
//                 await pages.close();
//             } catch {
//                 await pages.waitForSelector(selector.inputComment, {
//                     timeout: 4000,
//                 });
//                 await manualComment.manualComment(pages, spinners, config);

//                 await page.waitForTimeout(delay);
//                 await pages.close();
//                 spinners.succeed('comment', {
//                     text: 'Success commenting',
//                     color: 'yellow',
//                 });
//                 Logger.log('./logs/succesCommenting.log', usrhandle, tweet, 'success')
//             }
//         } catch (e) {
//             console.log(e);
//             //   await pages.close();
//             Logger.log('./logs/errorCommenting.log', usrhandle, tweet, 'failed', e)
//         }
//         currentIndex++; // Move to the next cookie set
//         await browser.close();
//     }

//     function readLog() {
//         const data = fs.readFileSync('./logs/succesCommenting.log', 'utf8');
//         return data;
//     };
// }


async function autoyt(browserconfig) {
    const config = require('./config');
    const useProxies = config.proxies;
    let proxies = [];

    if (useProxies) {
        const proxiesFile = fs.readFileSync(config.proxiesFile, 'utf-8');
        proxies = proxiesFile.split('\n');
    }

    const browser = await puppeteer.launch({
        ...browserConfig,
        executablePath: executablePath(),
    });
    const page = await browser.newPage();

    const cookiesFile = fs.readFileSync('cookieslist.json', 'utf-8');
    const cookiesList = JSON.parse(cookiesFile);
    const totalCookieSets = cookiesList.length;

    for (let currentIndex = 0; currentIndex < totalCookieSets; currentIndex++) {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1366,
            height: 768
        });
        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });
        await page.setUserAgent(randomUserAgent.UA());

        const currentCookieSet = cookiesList[currentIndex];
        const currentProxy = useProxies ? proxies[currentIndex % proxies.length] : null;

        const cookies = currentCookieSet.map(cookie => {
            const {sameSite, ...rest} = cookie;
            return sameSite ? {...rest, sameSite} : rest;
        });

        try {
            await page.setCookie(...cookies);
        } catch (error) {
            console.error('Error setting cookies:', error);
        }

        await page.goto(config.profile);
        await delay();
          
        await page.click(selector.videosTab);
        await delay();

        const linked = await page.$$eval('#contents #video-title', (videoTitles) => {
            return videoTitles.map((title) => {
              return {
                url: title.href,
                title: title.textContent.trim()
              };
            });
          });
          
          const randomCount = Math.floor(Math.random() * 4) + 2; // Random count between 2 and 5
          const links = linked.sort(() => Math.random() - Math.random()).slice(0, randomCount);
          
          console.log(`FOUND: ${links.length} LINKS`);
          
          const urls = links.map((link) => link.url); // Extract URLs from links array
          
          for (let j = 0; j < urls.length; j++) {
            const url = urls[j];
            if (readLog().includes(url)) {
              console.log('The video has been commented..');
              continue;
            }
          
            console.log('Now commenting on the video..');
            await page.goto(url);
      
            // Wait for the video to load
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
            // Retrieve the text of the video's time duration
            const durationText = await page.$eval('span.ytp-time-duration', (element) => element.textContent);
      
            // Convert the duration to seconds and calculate the wait time as half of that
            const durationInSeconds = convertions(durationText);
            const waitTime = durationInSeconds / 2;
            await page.waitForTimeout(waitTime * 1000);
      
            // Get the video duration
            const videoDuration = await page.evaluate(() => {
              const video = document.querySelector('video');
              return video.duration;
            });
      
            // Watch half of the video
            await page.waitForTimeout(videoDuration * 0.5 * 1000);
      
            // Scroll down to load more comments
            await page.evaluate(() => {
              const commentsSection = document.querySelector('#comments');
              commentsSection.scrollIntoView({
                behavior: 'smooth'
              });
            });
      
            // Get the total comment count
            let commentCountText = await page.evaluate(() => {
              const commentCountElement = document.querySelector('#count > yt-formatted-string > span:nth-child(1)');
              return commentCountElement.innerText;
            });
      
            // Like the bot's own comment
            if (commentCountText === "0") {
              await page.click(selector.likeComment);
              await delay(Math.floor(Math.random() * 4000) + 2000);
            }
      
            // Scroll up
            await page.evaluate(() => {
              window.scrollBy(0, -500);
            });
      
            // Like the video
            await page.click(selector.likeVideo);
      
            // Watch the rest of the video
            const remainingVideoTime = videoDuration - (videoDuration * 0.5);
            await page.waitForTimeout(remainingVideoTime * 1000);
            completedVideos.add(index);
      
            // Go back to the previous page (YouTube homepage)
            await page.goBack();
      
            // Close the video tab
            await page.close();
      
            // Mark the video URL as completed
            completedVideos.add(currentVideo.url);
        }

        currentIndex++; // Move to the next cookie set
        await browser.close();
    }
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
