var FeedParser = require('feedparser'),
  request = require('request'),
  _ = require('lodash'),
  util = require('../util/util'),
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
      console.log("FeedParser: " + err);
      if(err === "Error: Not a feed")
      reject("Error: URL Does Not Reference Feed");
    });
    feedparser.on('end', function() {
      //var meta = articles[0].meta;
      if (meta) {
        var newFeed = new SourceFeed({
          _id: hashUrl(url),
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

          Article.findByIdAndUpdate(article, { $set: { parentId: newFeed._id } }, function(err) {
            if (err) {
              console.log("Failed to add Parent ID to Article: " + err);
              reject(err);
            }
          });
          newFeed.articles.push(article);

          newFeed.save(function(err) {
            if (err) {
              console.log("New Feed Save Error: " + err);
              reject(err);
            }
          });
        });
        resolve(newFeed);
      } else {
        console.log("No MetaData");
        reject("Error: URL Does Not Reference Feed");
      }
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
              console.log("Temp Article Save: " + err);
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
        { altUrls: { $in: [url] } },
        { id: hashUrl(url) }
      ]
    }, function(err, feed) {

      if (feed) {
        //Found duplicate feed
        resolve({
          message: "Inserted Feed",
          id: feed._id,
          title: feed.title
        });
      } else { // Feed not found in DB
        populateFeed(url).then(function(feed) {
            resolve({
              message: "Inserted Feed",
              title: feed.title,
              id: feed._id
            });
          })
          .catch(function(error) {
            console.log("Populate: " + error)
            reject(error);
          });
      }
    });
  });
  return promise;
}

function hashUrl(url) {
  var regex = /(https?:\/\/)?([a-z0-9.]+)\/?(.*)/i;
  var match = regex.exec(url);
  if (!match[1]) {
    match[1] = 'http://';
  }
  return util.sha256Hash(match[1].toLowerCase() + match[2].toLowerCase() + '/' + match[3]).replace(/\//g, '_').replace(/_/g, '-');
}

module.exports.add = add;
