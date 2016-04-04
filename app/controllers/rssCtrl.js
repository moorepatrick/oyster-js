var RSS = require('rss'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require('config');

function generateFeed(feedObject) {
  var promise = new Promise(function(resolve, reject) {
    console.log("Generate Feed");
    var fileName = "./public/feeds/" + feedObject._id + ".xml";

    var feed = new RSS({
      title: feedObject.title,
      description: feedObject.description,
      generator: "Oyster v0.1 (http://oysterjs.com)",
      feed_url: config.site.feed_base + "/" + feedObject._id + ".xml",
      site_url: config.site.site_base,
      pubDate: feedObject.pubdate,
      language: 'en'
    });

    feedObject.articles.forEach(function(article) {
      var feedItem = {
        title: article.title,
        description: article.description,
        url: article.origlink,
        guid: config.site.feed_base + "/" + article._id,
        date: article.pubdate,
        enclosure: _.cloneDeep(article.enclosures[0]) // node-rss supports one enclosure
      };

      feed.item(feedItem);
    });

    var xml = feed.xml({ indent: '  ' });
    fs.writeFile(fileName, xml, function(err) {
      if (err) {
        console.log(err);
        reject(err);
      }

      console.log(fileName + " Saved");
      resolve({ message: "Saved", date: Date.now() });
    });
  });

  return promise;
}

module.exports.generateFeed = generateFeed;
