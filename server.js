var express = require('express'),
  app = express(),
  config = require('config'),
  path = require('path'),
  port = config.get('port') || 8080,
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose');

// body parser for POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// CORS Requests handling
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

// Logging
app.use(morgan('dev'));

// Static Files
app.use(express.static(__dirname + '/_public'));

// DB Configuaration
mongoose.connect('mongodb://' + config.dbConfig.host + ':' +
  config.dbConfig.port + '/' + config.dbConfig.dbName);

// API Routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api/v1', apiRoutes);

// RSS Routes
var rssRoutes = require('./app/routes/rss')(app, express);
app.use('/rss', rssRoutes);

// Catchall
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/_public/index.html'));
});

// Start Server
app.listen(port);
console.log('Running on port: ' + port);
