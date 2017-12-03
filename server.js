var cluster = require('cluster');
var WORKERS = process.env.WEB_CONCURRENCY || 1;

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Create a worker for each WORKERS
  for (var i = 0; i < WORKERS; i += 1) {
      cluster.fork();
  }
// Code to run if we're in a worker process
} else {
  var express     = require('express');
  var app         = express();
  var request     = require('request');
  var path        = require('path');
  var morgan      = require('morgan');
  var compression = require('compression');

  app.use(express.static(path.resolve(__dirname, "www")));
  app.use(morgan('combined'));
  app.use(compression());

  // API Proxy
  app.use('/proxy', function(req, res) {
    req.pipe(request("https://api.ausnimbus.com.au/" + req.url)).pipe(res);
  });

  app.enable('trust proxy', process.env.PROXY || true);
  app.set('port', process.env.PORT || 8080);

  app.listen(app.get('port'), function() {
    console.log("Listening on port", app.get("port"));
  });
}
