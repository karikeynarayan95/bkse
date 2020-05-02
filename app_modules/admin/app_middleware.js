/*
|----------------------------------------------------------------------
| /app_modules/admin/app_middleware.js
|----------------------------------------------------------------------
|
| -Admin Middleware Module-
|
| Provides custom middleware to be called on every request 
|
*/

// imports
var async = require('async'),
    Staff = mongoose.model('Staff');

// export an object with our middleware
exports = module.exports = {

  // ensure a bookstore middleware object is initialized on each request
  init: function(req, res, next) {
    if(!req.bsmw) {
      req.bsmw = {};
    }
    next();
  },

  // push a default title to all response locals for rendering
  title: {
    load: function(req, res, next) {
      res.locals( {title: "title" } );
      next();
    },
  },
       
  // make an admin object available to routes if admin is logged in
  login: { 
    load: function(req, res, next) {
      if (req.session.admin) {
        Staff.findById(req.session.admin, function(err, admin) {
          req.bsmw.admin = admin;
          res.locals({ admin: admin });
          next();
        });
      } else {
        next();
      }; 
    },
  },
}


