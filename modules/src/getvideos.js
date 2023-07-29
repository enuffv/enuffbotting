"use strict";
const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = {
    extracturls: async (proxy, manualComment, likeVideos, delay, selector, browser, spinners, readLog) => {
        const page = await browser.newPage();
        try {
            const linked = await page.$$('a#video-title-link', (links) => {
                return links.map((link) => {
                    return {
                        url: link.href,
                        title: link.textContent.trim(),
                    };
                });
            });

            spinners.add('hasil', {
                text: `scraping videos..`,
                color: 'yellow',
            });

            const randomCount = Math.floor(Math.random() * 4) + 2;
            const links = linked.slice(0, randomCount);

            for (const link of links) {
                spinners.succeed('hasil', {
                    text: `FOUND: ${links.length} LINKS`,
                    color: 'yellow',
                });

                if (!link.url || (readLog && readLog.includes(link.url))) {
                    spinners.succeed('hasil', {
                        text: `${link.url} already used.`,
                        color: 'red',
                    });
                    continue;
                }

                try {
                    const url = link.url;
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        console.log('Invalid URL:', url);
                        continue;
                    }

                    const videoPage = await browser.newPage();
                    await videoPage.goto(url);
                    await videoPage.waitForNavigation({
                        waitUntil: 'networkidle0',
                    });
                    page.setDefaultTimeout(0);

                    // WAITS FOR 1/2 THE VIDEO TO PLAY
                    await videoPage.waitForSelector(selector.videoDuration);
                    const durationElement = await videoPage.$(selector.videoDuration);
                    const durationText = await videoPage.evaluate(element => element.textContent, durationElement);
                    const durationArray = durationText.split(":").map(Number);
                    const hours = durationArray[0];
                    const minutes = durationArray[1];

                    const totalSeconds = hours * 3600 + minutes * 60;
                    const halfTotalSeconds = Math.floor(totalSeconds / 2);
                    await delay(halfTotalSeconds);
                    const playbttn = await page.selector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button');
                    page.click(playbttn);

                    // (> AUTO VIDEO ACTIVITY <)
                    try {
                        await page.evaluate(() => {
                            window.scrollBy(0, -550);
                        });
                        await page.evaluate(() => {
                            document.querySelector('div#placeholder-area').click();
                        });
                        await manualComment.manualComment(page, spinners, config);
                        spinners.succeed('comment', {
                            text: `Successfully Commented.`,
                            color: 'green',
                        });
                        await page.evaluate(() => {
                            window.scrollBy(0, 550);
                        });
                    } catch (error) {
                        console.log(error);
                    }

                    await likeVideos.likeVideos(page);

                    await delay(halfTotalSeconds);

                    await videoPage.close();
                } catch (error) {
                    console.error(error);
                    continue;
                }
            }
        } catch (error) {
            console.error('Error in extracturls:', error);
            throw error;
        }
        try {
            Logger.log('./logs/successCommenting.log', proxy, link, 'success');
        } catch (e) {
            console.log(e);
            Logger.log('./logs/errorCommenting.log', proxy, link, 'failed', e);
        }
    }
};
