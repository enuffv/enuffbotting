'use strict';

module.exports = {
  subscribeChannel: async (page) => {
    await page.goto("somchannel");
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
