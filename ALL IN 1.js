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

function sequential(index) {
    const comments = fs.readFileSync(config.commentList, 'utf8').split('\n').filter(comment => comment.trim() !== '');
    return comments[index % comments.length];
};

function randomcom() {
    const comments = fs.readFileSync(config.commentList, 'utf-8').split('\n').filter(line => line.trim() !== '');
    // Get a random line from the comments array
    const randomIndex = Math.floor(Math.random() * comments.length);
    const randomLine = comments[randomIndex];
};


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
      const { sameSite, ...rest } = cookie;
      return sameSite ? { ...rest, sameSite } : rest;
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

    const linked = await page.$$eval('a#video-title-link', (links) => {
      return links.map((link) => {
        return {
          url: link.href,
          title: link.textContent.trim()
        };
      });
    });

    const randomCount = Math.floor(Math.random() * 4) + 2; // Random count between 2 and 5
    const links = linked.slice(0, randomCount);

    console.log(`FOUND: ${links.length} LINKS`);

    for (let j = 0; j < links.length; j++) {
      const link = links[j];
      if (!link.url || readLog().includes(link.url)) {
        console.log('The video has been commented or has an invalid URL.');
        continue;
      }

      console.log('Now commenting on the video..');

      try {
        const url = link.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          console.log('Invalid URL:', url);
          continue;
        }

        // Open the video URL in a new page
        const videoPage = await browser.newPage();
        await videoPage.goto(url);

        // Wait for the video to load
        await videoPage.waitForNavigation({ waitUntil: 'networkidle0' });

        try {
          while (true) {
            await page.waitForSelector(".ytp-ad-skip-button-container", { visible: true }); // Replace 'button' with the selector for the skip ad button on the webpage
      
            const adtext = await page.$eval(".ytp-ad-skip-button-container", (element) => element.innerText);
            if (adtext.includes('Skip Ad') || adtext.includes('Skip Ads')) {
              await page.click('button'); // Click on the skip ad button
              break; // Break the while loop once the button is clicked
            }
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }

        // Retrieve the text of the video's time duration
        const durationText = await videoPage.$eval('span.ytp-time-duration', (element) => element.textContent);

        // Convert the duration to seconds and calculate the wait time as half of that
        const durationInSeconds = convertions(durationText);
        const waitTime = durationInSeconds / 2;

        // Watch half of the video
        await videoPage.waitForTimeout(waitTime * 1000);

        // Scroll down to load more comments
        await videoPage.evaluate(() => {
          const commentsSection = document.querySelector('#comments');
          commentsSection.scrollIntoView({
            behavior: 'smooth'
          });
        });

        // Close the video page
        await videoPage.close();

        // Mark the video URL as completed
        completedVideos.add(link.url);
      } catch (error) {
        console.error('Error navigating to URL:', error);
        continue;
      }
    }
      await page.close();
    }
  
    await browser.close();
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
