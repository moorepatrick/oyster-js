var FeedParser = require('feedparser'),
    request = require('request'),
    _ = require('lodash'),
    SourceFeed = require('../models/feed').sourceFeed,
    Article = require('../models/feed').article,
    config = require('config');

var populateFeed = function(url) {
    var promise = new Promise(function(resolve, reject) {
        var articles = [];
        var meta;
        var options = {
            url: url,
            headers: { 'User-Agent': 'oyster/' + config.version }
        };

        console.log("Request Feed");
        var req = request(options),
            feedparser = new FeedParser();

        req.on('error', function(err) {
            console.log("Request Error: " + err);
            reject(err);
        });

        req.on('response', function(res) {
            var stream = this;

            if (res.statusCode !== 200) {
                reject({
                    statusCode: req.statusCode,
                    message: 'Bad Status Code'
                });
            }
            stream.pipe(feedparser);
        });

        feedparser.on('error', function(err) {
            console.log("FeedParser Error: " + err);
            reject(err);
        });
        feedparser.on('end', function() {
            //var meta = articles[0].meta;

            var newFeed = new SourceFeed({
                title: meta.title,
                description: meta.description,
                link: meta.link,
                url: meta.xmlurl,
                altUrls: [url],
                date: new Date(meta.date),
                author: meta.author,
                language: meta.language,
                image: Object.assign({}, meta.image),
                copyright: meta.copyright,
                generator: meta.generator,
                categories: meta.categories
            });

            console.log("Feed ID: " + newFeed._id)

            articles.forEach(function(article) {
              console.log(article);
              Article.findByIdAndUpdate(article, {$set: {parentId: newFeed._id}}, function(err){
                if (err) {
                        console.log("Failed to add Parent ID to Article: " + err);
                        reject(err);
                    }
                console.log("Parent: " + newFeed._id);
                console.log("Child: " + article);
              });
                newFeed.articles.push(article);

                newFeed.save(function(err) {
                    if (err) {
                        console.log("New Feed Save Error: " + err);
                        reject(err);
                    }
                });
            });
            resolve(newFeed._id);
        });

        feedparser.on('readable', function() {
            var stream = this,
                article;

            // From feedparser docs
            while (article = stream.read()) {
                if (article !== null) {

                    if (!meta) {
                        meta = Object.assign(article.meta);
                    }

                    var tempArticle = new Article({
                        title: article.title,
                        description: article.description,
                        summary: article.summary,
                        origlink: article.origlink,
                        permalink: article.permalink,
                        date: new Date(article.Date),
                        pubdate: new Date(article.pubdate),
                        author: article.author,
                        guid: article.guid,
                        categories: article.categories,
                        source: Object.assign(article.source),
                        enclosures: _.cloneDeep(article.enclosures),
                        meta: Object.assign(article.meta)
                    });

                    tempArticle.save(function(err) {
                      if (err) {
                        console.log("Temp Article Save Error: " + err);
                        reject(err);
                      }
                    });
                    articles.push(tempArticle._id);
                }
            }
        });
    });
    return promise;
};

function add(url) {
    console.log("Start Feed Add");

    var promise = new Promise(function(resolve, reject) {
        // Find feed in DB
        SourceFeed.findOne({
            $or: [
                { link: url },
                { xmlurl: url },
                { altUrls: { $in: [url] } }
            ]
        }, function(err, feed) {

            if (feed) {
                //Found duplicate feed
                resolve({
                    message: "Duplicate Feed",
                    id: feed._id
                });
            } else { // Feed not found in DB
                populateFeed(url).then(function(feedId) {
                        resolve({
                            message: "Inserted Feed",
                            id: feedId
                        });
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            }
        });
    });
    return promise;
}

module.exports.add = add;
