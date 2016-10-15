var loopback = require('loopback');
var boot = require('loopback-boot');
var LoopBackContext = require('loopback-context');

 app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

app.use(LoopBackContext.perRequest());

app.use(loopback.token());

app.use(function setCurrentUser( req, res, next ) {
  if(!req.accessToken){
    return next();
  }
  app.models.user.findById(req.accessToken.userId, function( err, user ) {
    if(err){
      return next(err);
    }
    if(!user){
      return next(new Error('No user with this access token was found.'));
    }
    /*var loopbackContext = LoopBackContext.getCurrentContext();
     if(loopbackContext){
     loopbackContext.set('currentUser', user);
     }*/
    req.currentUser = user;
    next();
  });
});

app.start = function() {
  // start the web server
  return app.listen(process.env.PORT || 3000, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
