var FeedParser = require('feedparser'),
  request = require('request'),
  _ = require('lodash'),
  sourceFeed = require('../models/feed').sourceFeed;

var populateFeed = function(url) {
  console.log("PopulateFeed");
  var promise = new Promise(function(resolve, reject) {
    var articles = [];
    var options = {
      url: url,
      headers: { 'User-Agent': 'oyster/0.1' }
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
      var meta = articles[0].meta;

      var newFeed = new sourceFeed({
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

      articles.forEach(function(article) {
        newFeed.articles.push(article);

        newFeed.save(function(err, feed) {
          if (err) {
            console.log(err);
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
          var tempArticle = {
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
          };

          articles.push(tempArticle);
        }
      }
    });
  });
  return promise;
};

function add(url) {

  console.log("Start Add");
  console.log(url);

  var promise = new Promise(function(resolve, reject) {
    // Feed is in DB
    console.log(url);
    sourceFeed.findOne({
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
        console.log("Add Populate");
        populateFeed(url).then(function(feedId) {
            console.log("Populate Done")
            resolve({
              message: "Inserted Feed",
              id: feedId
            });
          })
          .catch(function(error) {
            console.log("Error: " + error);
            reject(error);
          });
      }
    });
  });
  return promise;
}

module.exports.add = add;
