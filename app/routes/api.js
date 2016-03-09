var User = require('../models/user'),
  Feed = require('../models/feed').Schema,
  jwt = require('jsonwebtoken'),
  feedCtrl = require('../controllers/feedCtrl'),
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
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

  // Route Middleware to verify token
  apiRouter.use(function(req, res, next) {
    // do logging
    console.log('Someone just came to the app!');

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
      message: "hooray! welcome to the api"
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



  // Users filtered feeds
  apiRouter.route('/feeds/:feed_id')
    .get(function(req, res) {
      User.find({ username: req.decoded.username }).select('feeds').exec(function(err, feeds) {
        if (err) res.send(err);

        res.json(feeds);
      });
    })
    .put(function(req, res) {
      res.json({ message: req.method + ': ' + req.url + ' not yet implemented' });
    })
    .delete(function(req, res) {
      res.json({ message: req.method + ': ' + req.url + ' not yet implemented' });
    });

  apiRouter.route('/feeds')
    .get(function(req, res) {
      User.find({ username: req.decoded.username }).select('-_id username feeds').exec(function(err, feeds) {
        if (err) res.send(err);

        res.json(feeds);
      });
    })
    .post(function(req, res) {
      console.log(req.method);
      return res.json({
        url: req.body.url,
        message: req.method + ': ' + req.url + ' not yet implemented'
      });
    });

  apiRouter.route('/subscriptions/:feed_id')
    .delete(function(req, res) {
      res.json({ message: 'Not yet implemented' });
    });

  apiRouter.route('/subscriptions')
    .get(function(req, res) {
      User.find({ username: req.decoded.username })
      .populate('subscriptions', 'title')
      .select('username subscriptions')
      .exec(function(err, subscriptions) {
        if (err) res.send(err);

        res.json(subscriptions);
      });
    })
    .post(function(req, res) {
      console.log("Start Post: " + req.body.url);
      feedCtrl.add(req.body.url).then(function(data) {
        User.update({ username: req.decoded.username }, { $addToSet: { 'subscriptions': data.id } },
          function(err, user) {
            if (err) res.send(err);

            console.log(data.message + " " + data.id);
            res.json({ message: data.message + ": " + data.id });
          });
      }).catch(function(error) {
        console.log("Error: " + error);
        res.json({ message: "ERROR: " + error });
      });
    });

  // Access to all feeds in database
  apiRouter.get('/admin/feeds/:feed_id', function(req, res) {
    User.find({ feed_id: req.feed_id }, function(err, feed) {
      if (err) res.send(err);

      res.json(feed);
    });
  });

  apiRouter.get('/admin/feeds', function(req, res) {
    Feed.find({}, function(err, feeds) {
      if (err) res.send(err);

      res.json(feeds);
    });
  });

  // Get Logged in user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};
