/*
|----------------------------------------------------------------------
| /app_modules/admin/app.js
|----------------------------------------------------------------------
|
| -Admin Module-
|
| Encapsulates views, routes, controls relating to the admin 
| functionality of the application.
|
*/

// server config
var server_domain = 'rylon.org'

// imports
var express = require('express'),
    fs = require('fs');

// create our main express application
var app = module.exports = express.createServer();

// connect to database
require('./db-connect');
// initialize our models
require('./models');

// get instances of our sub-applications
var admin_app = require('./app_modules/admin/app');
var staff_app = require('./app_modules/staff/app');
var bookstore_app = require('./app_modules/bookstore/app');

// Configuration
app.configure('development', function(){
  // mount admin sub-app at admin.{server_domain}
  app.use(express.vhost('admin.'+server_domain, admin_app));
  // mount staff sub-app at staff.{server_domain}
  app.use(express.vhost('staff.'+server_domain, staff_app));
  // mount bookstore sub-app at {server_domain}
  app.use('/', bookstore_app);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// initialize our express app and start listening for requests.
// we're listening on 8001 so we'll have to use forwarding of some
// sort to actually process requests on port 80.
app.listen(8001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
