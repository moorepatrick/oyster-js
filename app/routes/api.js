var User = require('../models/user'),
  OutputFeed = require('../models/feed').outputFeed,
  SourceFeed = require('../models/feed').sourceFeed,
  jwt = require('jsonwebtoken'),
  outputFeedCtrl = require('../controllers/outputFeedCtrl'),
  sourceFeedCtrl = require('../controllers/sourceFeedCtrl'),
  path = require('path'),
  _ = require('lodash'),
  util = require('../util/util'),
  config = require('config');

// Token Secret
var secret = config.session.secret;

module.exports = function(app, express) {

  var apiRouter = express.Router();

  // Authenticate User (POST /api/authenticate)
  apiRouter.post('/authenticate', function(req, res) {

    // Find User
    User.findOne({
      username: req.body.username
    }).select('name username password admin').exec(function(err, user) {
      if (err) throw err;

      // No user found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        // Check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // If user found and password is correct
          // create token
          var token = jwt.sign({
            name: user.name,
            username: user.username,
            admin: user.admin
          }, secret, {
            expiresIn: 86400 // 24 hours
          });

          // Return token
          res.json({
            success: true,
            message: 'Authenticated',
            token: token
          });
        }
      }
    });
  });

  // Route Middleware to verify token
  apiRouter.use(function(req, res, next) {
    // Check for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
      // verifies secret and checks expiration
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // Everything OK
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // No Token: Return 403 Forbidden
      res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  // GET /api
  apiRouter.get('/', function(req, res) {
    res.json({
      message: "Oyster JS API v1.0"
    });
  });

  // Individual User
  apiRouter.route('/users/:user_id')
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        res.json(user);
      });
    })
    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) {
          res.send(err);
        }

        if (req.body.name) { user.name = req.body.name; }
        if (req.body.username) { user.username = req.body.username; }
        if (req.body.password) { user.password = req.body.password; }

        user.save(function(err) {
          if (err) res.send(err);

          res.json({ message: 'User updated!' });
        });
      });
    })
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
      });
    });

  apiRouter.route('/users')
    // Create User
    .post(function(req, res) {
      var user = new User();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err) {
        if (err) {
          // Duplicate User
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'A user with that username exists.'
            });
          } else return res.send(err);

        }
        res.json({
          message: 'User created'
        });
      });
    })
    // Get all users
    .get(function(req, res) {
      User.find({}, function(err, users) {
        if (err) res.send(err);

        // Return all users
        res.json(users);
      });
    });

  // User's filtered feeds
  apiRouter.route('/output_feeds/:username/:feed_id')
    .get(function(req, res) {
      if (req.params.username !== req.decoded.username) {
        res.sendStatus(403);
      } else {
        User.findOne({ username: req.params.username })
          .populate({
            path: 'outputFeeds',
            populate: {
              path: 'articles',
              select: '-_id',
            }
          }).exec(function(err, user) {
            var index = _.findIndex(user.outputFeeds, { 'normTitle': req.params.feed_id });
            if (index !== -1) {
              OutputFeed.findById(user.outputFeeds[index]._id)
                .populate({ path: 'articles', select: '-_id', populate: { path: 'article', select: '-_id -meta' } })
                .exec(function(err, feed) {
                  if (!feed) res.json({ message: "Feed Not Found" });

                  res.json(feed);
                });
            } else {
              res.json({ message: "Feed Not Found" });
            }
          });
      }
    })
    .put(function(req, res) {
      if (req.params.username !== req.decoded.username) {
        res.sendStatus(403);
      } else {
        res.json({ message: req.method + ': ' + req.url + ' not yet implemented' });
      }
    })
    .delete(function(req, res) {
      if (req.params.username !== req.decoded.username) {
        res.sendStatus(403);
      } else {
        // Remove feed from Output Feeds
        OutputFeed.remove({ _id: req.params.feed_id }, function(err, feed) {
          if (err) res.send(err);

          // Remove feed from user's feeds list
          User.update({ username: req.decoded.username }, { $pull: { outputFeeds: req.params.feed_id } }, function(err, raw) {
            if (err) res.send(err)

            res.json({ message: 'Feed Deleted' });
          })
        });
      }
    });

  apiRouter.route('/output_feeds/:username')
    .get(function(req, res) {
      if (req.params.username !== req.decoded.username) {
        res.sendStatus(403);
      } else {
        User.findOne({ username: req.decoded.username })
          .populate('outputFeeds', 'title link normTitle')
          .select('-_id username outputFeeds')
          .exec(function(err, feeds) {
            if (err) res.send(err);

            res.json(feeds);
          });
      }
    })
    // Add feed to users feeds list
    .post(function(req, res) {
      console.log("Start Feed Creation: " + req.body.feedData);
      if (req.params.username !== req.decoded.username) {
        res.sendStatus(403);
      } else {
        OutputFeed.findOne({owner: req.decoded.username, normTitle: util.normalize(req.body.feedData.title) })
        .exec(function(err, feed){
          if(!feed){
            outputFeedCtrl.add(req.body.feedData, req.decoded)
              .then(function(data) {
                console.log("Update Feed List");
                User.update({ username: req.decoded.username }, { $addToSet: { 'outputFeeds': data.id } },
                  function(err) {
                    if (err) res.send(err);

                    console.log(data.message + " " + data.id);
                    res.json({ message: data.message + ": " + data.id, success: true });
                  });
              }).catch(function(error) {
                console.log("Error: " + error);
                res.json({ message: "Error: " + error, success: false });
              });

            console.log(req.method);
          }
          else{
            res.json({message: req.body.feedData.title + " already exists", success: false});
          }
        });
      }
    });

  // Subscribed feeds (Source Feeds)
  apiRouter.route('/source_feeds/:feed_id')
    .get(function(req, res) {
      SourceFeed.findById(req.params.feed_id)
        .populate('articles')
        .exec(function(err, feed) {
          if (!feed) res.json({ message: "Feed Not Found" });

          res.json(feed);

        });
    })
    .delete(function(req, res) {
      // Remove feed from users subscriptions list, but not Source Feeds
      User.findOneAndUpdate({ username: req.decoded.username }, { $pull: { 'sourceFeeds': req.params.feed_id } }, function(err, sourceFeed) {
        if (err) {
          res.send(err);
        }

        res.json({ message: 'Source Feed: ' + req.params.feed_id + ' removed' });
      });
    });

  apiRouter.route('/source_feeds')
    .get(function(req, res) {
      User.find({ username: req.decoded.username })
        .populate('sourceFeeds', 'title link')
        .select('username sourceFeeds')
        .exec(function(err, sourceFeeds) {
          if (err) res.send(err);

          res.json(sourceFeeds);
        });
    })
    .post(function(req, res) {
      console.log("Start Post: " + req.body.url);
      sourceFeedCtrl.add(req.body.url).then(function(data) {
        console.log("Update User List")
        User.update({ username: req.decoded.username }, { $addToSet: { 'sourceFeeds': data.id } },
          function(err, user) {
            if (err) res.send(err);

            console.log(data.message + " " + data.id);
            res.json({ message: data.message + ": " + data.id });
          });
      }).catch(function(error) {
        console.log(error);
        res.json({ message: error });
      });
    });

  // // Access to all feeds in database
  // apiRouter.get('/admin/feeds/:feed_id', function(req, res) {
  //   User.find({ feed_id: req.feed_id }, function(err, feed) {
  //     if (err) res.send(err);
  //
  //     res.json(feed);
  //   });
  // });
  //
  // apiRouter.get('/admin/feeds', function(req, res) {
  //   Feed.find({}, function(err, feeds) {
  //     if (err) res.send(err);
  //
  //     res.json(feeds);
  //   });
  // });

  // Get Logged in user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};
