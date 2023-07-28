module.exports = {
    profile: 'https://www.youtube.com/@smosh',
    subscribe: false,
    likeAmount: 3,       // KEEP AS NUMBER FOR AMOUNT TO LIKE.
    commentAmount: 3,    // KEEP AS NUMBER FOR AMOUNT TO COMMENT.
    replyAmount: 2,    // KEEP AS NUMBER FOR AMOUNT TO REPLY.
    likeAmount: 3,     // KEEP AS NUMBER FOR AMOUNT TO LIKE COMMENTS.
    videoUrls: ['', ''],

    threads: 1,    // amount of instances to use at once.
    auto: true,   // CHANGE TO MANUAL FOR SPECIFIC VIDEOS OTHERWISE, AUTO DOES IT FOR ANY.
    proxies: true,    // true/false.


    proxiesFile: './proxylist.txt',
    cookiesFile: './cookieslist.json',
    commentList: 'comments.txt',
    seqComment: true,   // OTHERWISE: RANDOM COMMENT

    promotionalComment: 'promo_comments.txt',
    promoseqComment: true,   // OTHERWISE: RANDOM COMMENT
};
