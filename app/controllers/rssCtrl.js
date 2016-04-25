var RSS = require('rss'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require('config');

function generateFeed(feedObject) {
  var promise = new Promise(function(resolve, reject) {
    console.log("Generate Feed");
    var fileName = "./_public/feeds/" + feedObject.normTitle + ".xml";

    var feed = new RSS({
      title: feedObject.title,
      description: feedObject.description,
      generator: "Oyster v" + config.version + " (http://oysterjs.com)",
      feed_url: config.site.feed_base + "/" + feedObject.normTitle + ".xml",
      site_url: config.site.site_base,
      pubDate: feedObject.pubdate,
      language: 'en'
    });

    feedObject.articles.forEach(function(item) {

      var feedItem = {
        title: item.article.title,
        description: item.article.description,
        url: item.article.origlink,
        guid: item.article.guid,
        date: item.article.pubdate,
        enclosure: _.cloneDeep(item.article.enclosures[0]) // node-rss supports one enclosure
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
