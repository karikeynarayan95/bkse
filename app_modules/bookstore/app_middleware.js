/*
|----------------------------------------------------------------------
| /app_modules/bookstore/app_middleware.js
|----------------------------------------------------------------------
|
| -Bookstore Middleware Module-
|
| Provides custom middleware to be called on every request 
|
*/

// imports
var Cart = mongoose.model('Cart'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order');

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
 
  // initialize a cart if one doesn't exist
  cart: {
    init: function(req, res, next) {
      if(!req.session.cart) {
        var cart = new Cart();
        req.session.cart = cart.id;
        cart.save(function(err) {
          next(err);
        });
      } else { 
        next(); 
      };
    },

    load: function(req, res, next) {
      Cart.findById(req.session.cart, function(err, cart) {
        req.bsmw.cart = cart;
        res.locals({cart: cart}); 
        next()
      });
    },
  },
 
  // make a customer object available to routes if admin is logged in
  login: { 
    load: function(req, res, next) {
      if (req.session.customer) {
        Customer.findById(req.session.customer, function(err, customer) {
          req.bsmw.customer = customer;
          res.locals({ customer: customer });
          next();
        });
      } else {
        next();
      }; 
    },
  },
}


