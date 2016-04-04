var _ = require('lodash'),
  OutputFeed = require('../models/feed').outputFeed,
  SourceFeed = require('../models/feed').sourceFeed;

// Create new user feed
function add(feedData, name) {
  console.log("Add")
  var promise = new Promise(function(resolve, reject) {
    var newFeed = new OutputFeed({
      title: feedData.title,
      description: feedData.title,
      link: "",
      url: "",
      altUrls: [],
      date: new Date(Date.now()),
      lastBuildDate: new Date(Date.now()),
      image: { url: "", title: "" },
      copyright: "",
      categories: "",
      author: name,
      language: 'en',
      generator: "Oyster v0.1 (http://oysterjs.com)",
    });

    Promise.all(populate(feedData))
      .then(function(values) {
        values.forEach(function(value) {
          value.articles.forEach(function(article) {
            newFeed.articles.push(article);
          })
        })
      })
      .then(function(values) {
        _.orderBy(newFeed.articles, 'pubdate', 'desc');

        newFeed.save(function(err, feed) {
          if (err) {
            console.log("New Output Save Error: " + err);
            reject(err);
          }
          resolve({ message: "Success", id: feed._id });
        });
      })
      .catch(function(data) {
        reject(data);
      });
  });
  return promise;
}

// Pull articles from each soure feed
function populate(feedData) {
  var promises = [];

  // Create new promise for each source feed
  feedData.feeds.forEach(function(feed_id) {
    var p = new Promise(function(resolve, reject) {
      SourceFeed.findById(feed_id, 'articles', function(err, source) {
        if (err) {
          console.log("New OuputFeed FindByID Error: " + err);
          reject(err);
        }
        resolve(source);
      });
    });
    promises.push(p);
  });
  return promises;
}

module.exports.add = add;
