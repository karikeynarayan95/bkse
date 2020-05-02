/*
|----------------------------------------------------------------------
| /app_modules/staff/app_middleware.js
|----------------------------------------------------------------------
|
| -Staff Middleware Module-
|
| Provides custom middleware to be called on every request 
|
*/

// imports
var Staff = mongoose.model('Staff');

// export an object with our middleware
exports = module.exports = {

  // ensure a bookstore middleware object is initialized on each request
  init: function(req, res, next) {
    if(!req.bsmw) {
      req.bsmw = {};
    }
    next();
  },

  // make flash data available to views 
  flash: {
    load: function(req, res, next) {
      res.locals({ 
        alert: req.flash('alert'), 
        info: req.flash('info'),
        success: req.flash('success'),
        error: req.flash('error'),
      });
      next();
    }
  },

  // if validation errors occured, make them available to views
  valErrors: {
    load: function(req, res, next) {
      res.locals({ 
        valErrors: req.session.valErrors || {},
      });
      delete req.session.valErrors;
      next();
    }
  },

  // make an admin object available to routes if staff is logged in
  login: { 
    load: function(req, res, next) {
      if (req.session.staff) {
        Staff.findById(req.session.staff, function(err, staff) {
          req.bsmw.staff = staff;
          res.locals({ login: req.session.login});
          res.locals({ staff: staff });
          next();
        });
      } else {
        next();
      }; 
    },
  },
}


