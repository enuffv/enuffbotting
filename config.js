module.exports = {
    cookiesList: './cookieslist.json',
    profile: 'https://www.youtube.com/@ouounegr',
    subscribe: false,
    likeAmount: 3,       // KEEP AS NUMBER FOR AMOUNT TO LIKE.
    commentAmount: 3,    // KEEP AS NUMBER FOR AMOUNT TO COMMENT.
    replyAmount: 2,    // KEEP AS NUMBER FOR AMOUNT TO REPLY.
    likeAmount: 3,     // KEEP AS NUMBER FOR AMOUNT TO LIKE COMMENTS.
    videoUrls: ['', ''],

    threads: 1,    // amount of instances to use at once.
    auto: true,   // CHANGE TO MANUAL FOR SPECIFIC VIDEOS OTHERWISE, AUTO DOES IT FOR ANY.
    proxies: false,    // true/false.
    proxiesFile: 'proxy_list.txt',
    cookiesFile: 'cookie_list.txt',
    commentList: 'comments.txt',
    seqComment: true,   // OTHERWISE: RANDOM COMMENT

    promotionalComment: 'promo_comments.txt',
    promoseqComment: true,   // OTHERWISE: RANDOM COMMENT
};