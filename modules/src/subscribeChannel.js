'use strict';

module.exports = {
  subscribeChannel: async (page) => {
    await page.goto("https://www.youtube.com/channel/UCCjCRg_L2rPVK23kf6iaGiw");
    await page.waitForTimeout(10000);
    await page.evaluate(() => {
        document
          .querySelector(
            "#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string"
          )
          .click();
    });
  },
};