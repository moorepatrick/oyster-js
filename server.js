var express = require('express'),
  app = express(),
  config = require('config'),
  path = require('path'),
  port = config.get('port') || 8080,
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  User = require('./app/models/user');

// DB Configuaration
mongoose.connect('mongodb://' + config.dbConfig.host + ':' +
  config.dbConfig.port + '/' + config.dbConfig.dbName);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', function(req, res){
  res.send('Welcome to the Oyster home page');
});

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// Catchall
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.listen(port);
console.log('Running on port: ' + port);
