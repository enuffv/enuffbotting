'use strict';
/**
 * Manual Comment
 * @author fdciabdul
 * @module manualComment
 * @description Manual Comment
 * @date 2023-02-08
 * @param {any} pages
 * @param {any} spinners
 * @param {any} config
 * @returns {any}
 */
module.exports = {
    manualComment: async (pages , spinners , config) => {
      function SeqComment(index) {
        const comments = fs.readFileSync(config.commentList, 'utf8').split('\n').filter(comment => comment.trim() !== '');
        return comments[index % comments.length];
    }
        await pages.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });
        var komenan = config.comments[(SeqComment)]
        spinners.update('comment', { text: "Using: \n" + komenan, color: 'blue' });
        await pages.waitForSelector("#contenteditable-root");
        await pages.type("#contenteditable-root",komenan, { delay: 20 });
        await pages.waitForTimeout(100);
        await pages.keyboard.press("Enter");
        await pages.evaluate(() => {
          document.querySelector("#submit-button").click();
        });
    }
}