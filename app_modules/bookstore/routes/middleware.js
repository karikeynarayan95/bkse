/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/middleware.js
|----------------------------------------------------------------------
|
| -Bookstore Routes Middleware-
|
| Specific middleware that shouldn't be called on all requests 
|
*/

// routes passed this middleware will require login
module.exports = {
  needLogin: function(req, res, next) {
  // if login session exists
    if (req.session.customer) {
      // let request continue
      next();
    } else {
      // otherwise redirect to login
      res.redirect('/login');
    };
  }
};
