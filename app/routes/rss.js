var OutputFeed = require('../models/feed').outputFeed,
  SourceFeed = require('../models/feed').sourceFeed,
  rssCtrl = require('../controllers/rssCtrl'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = function(app, express) {

var rssRouter = express.Router();

// RSS Feed
rssRouter.route('/:username/:feed_id')
  .get(function(req, res) {
    // Source Feed Regeneration
    // Split off file extension if present
    var feedId = req.params.feed_id.split('.')[0];
    var filePath = path.join(__dirname, '../../_public/feeds/' + req.params.username);
    mkdirp.sync(filePath, function(err) {
      if (err) {
        console.err(err);
        res.json(err);
      }
    });
    console.log(filePath);
    OutputFeed.findOne({ normTitle: feedId })
      .populate({ path: 'articles', select: '-_id', populate: { path: 'article', select: '-_id -meta' } })
      .exec(function(err, feed) {
        if (!feed) return res.json({ message: "Feed Not Found" });

        if (Date.parse(feed.lastBuildDate) < (Date.now() - 900000)) {
          console.log("Old Feed: > 15 mins since last build");
            // console.log("Last Build Date: " + feed.lastBuildDate);
            // console.log("Date Now: " + new Date(Date.now()));
            // console.log("Difference:" + (Date.parse(feed.lastBuildDate) - (Date.now() - 900000)))

          rssCtrl.generateFeed(feed, req.params.username)
            .then(function(data) {
              console.log(data);
              feed.lastBuildDate = new Date(data.date);
              feed.save(function(err) {
                if (err) return err;
                res.sendFile(path.join(filePath, feedId + ".xml"));
              });
            })
            .catch(function(data) {
              //console.log(util.inspect(data));
              res.json(data);
            });

        } else {
          console.log("Fresh Feed: < 15 mins since last build");
          res.sendFile(path.join(filePath, feedId + ".xml"));
        }
      });
  });

return rssRouter;
};
