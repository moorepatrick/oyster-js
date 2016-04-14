var OutputFeed = require('../models/feed').outputFeed,
    SourceFeed = require('../models/feed').sourceFeed,
    rssCtrl = require('../controllers/rssCtrl'),
    path = require('path');

module.exports = function(app, express) {

    var rssRouter = express.Router();

    // RSS Feed
    rssRouter.route('/:feed_id')
        .get(function(req, res) {
            // Source Feed Regeneration
            // Split off file extension if present
            var feedId = req.params.feed_id.split('.')[0]
            OutputFeed.findById(feedId)
                .populate({ path: 'articles', select: '-_id', populate: { path: 'article', select: '-_id -meta' } })
                .exec(function(err, feed) {
                    if (!feed) return res.json({ message: "Feed Not Found" });

                    if (Date.parse(feed.lastBuildDate) < (Date.now() - 900000)) {
                        console.log("Old Feed: > 15 mins since last build")
                            // console.log("Last Build Date: " + feed.lastBuildDate);
                            // console.log("Date Now: " + new Date(Date.now()));
                            // console.log("Difference:" + (Date.parse(feed.lastBuildDate) - (Date.now() - 900000)))
                        rssCtrl.generateFeed(feed)
                            .then(function(data) {
                                console.log(data);
                                feed.lastBuildDate = new Date(data.date);
                                feed.save(function(err) {
                                    if (err) return handleError(err);
                                    res.sendFile(path.join(__dirname, '../../_public/feeds/' + feedId + ".xml"));
                                });
                            })
                            .catch(function(data) {
                                //console.log(util.inspect(data));
                                res.json(data);
                            });

                    } else {
                        console.log("Fresh Feed: < 15 mins since last build")
                        res.sendFile(path.join(__dirname, '../../_public/feeds/' + feedId + ".xml"));
                    }
                });
        });

    return rssRouter;
};
