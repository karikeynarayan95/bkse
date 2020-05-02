/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/checkout.js
|----------------------------------------------------------------------
|
| -Bookstore Routes Checkout-
|
*/

var async = require('async'),
    Order = mongoose.model('Order'),
    ShipTo = mongoose.model('ShipTo'),
    BillTo = mongoose.model('BillTo');

// helper function to load checkout data from database if 
// session ids exists
var loadCheckout = function(req, res, next) {
  async.series([
    function(callback) {
      if (req.session.order) {
        // get our current order
        Order.findById(req.session.order, function(err, order) {
          if (err) { callback(err); }
          else {
            // pass the order to req and views
            req.bsmw.order = order;
            res.locals({order: order}); 
            callback();
          }
        });
      } else {
        callback();
      };
    },
    function(callback) {
      if (req.session.shipTo) {
        // get our current shipTo 
        ShipTo.findById(req.session.shipTo, function(err, shipTo) {
          if (err) { callback(err); }
          else {
            // pass shipTo to req and views
            req.bsmw.shipTo = shipTo;
            res.locals({shipTo: shipTo}); 
            callback();
          }
        });
      } else {
        callback();
      };
    },
    function(callback) {
      if (req.session.billTo) {
        // get our current billTo
        BillTo.findById(req.session.billTo, function(err, billTo) {
          if (err) { callback(err); }
          else {
            // pass billTo to req and views
            req.bsmw.billTo = billTo;
            res.locals({billTo: billTo}); 
            callback();
          }
        });
      } else {
        callback();
      };
    },
  ], function(err, results) {
    if (err) { next(err); } else { next(); };
  });
};

app.get('/checkout', function(req, res) {
  if (req.session.customer) {
    // if logged in let customer to checkout
    res.redirect('/checkout/customer');
  } else {
    // otherwise hassle them to login first
    res.redirect('/checkout/login')
  };
});

app.get('/checkout/login', function(req, res) {
  res.render('checkout/login')
});

app.get('/checkout/customer', loadCheckout, function(req, res) {
  // if no shipTo, create one, the redirect back and continue
  if (!req.session.shipTo) {
    var newShipTo = new ShipTo();
    req.session.shipTo = newShipTo.id;
    newShipTo.save(function(err) {
      if (err) console.log(err);
      res.redirect('/checkout/customer');
    });
  } else {
    res.render('checkout/customer');
  };
});

app.post('/checkout/customer', loadCheckout, function(req, res) {
  req.bsmw.shipTo.set(req.body);
  req.bsmw.shipTo.save(function(err) {
    res.redirect('/checkout/payment');
  });
});

app.get('/checkout/payment', loadCheckout, function(req, res) {
  // if no billTo, create one, the redirect back and continue
  if (!req.session.billTo) {
    var newBillTo = new BillTo();
    req.session.billTo = newBillTo.id;
    newBillTo.save(function(err) {
      if (err) console.log(err);
      res.redirect('/checkout/payment');
    });
  } else {
    res.render('checkout/payment');
  };
});

app.post('/checkout/payment', loadCheckout, function(req, res) {
  req.bsmw.billTo.set(req.body);
  req.bsmw.billTo.save(function(err) {
    res.redirect('/checkout/confirm');
  });
});

app.get('/checkout/confirm', loadCheckout, function(req, res) {
  res.render('checkout/confirm');
});

app.post('/checkout/confirm', loadCheckout, function(req, res) {
  // create a new order for end of checkout
  var newOrder = new Order(req.body);
  // if customer is logged in attach thier id to order
  if (req.session.customer) {
    newOrder.customer = req.session.customer;
  };
  // set order to 'processing'
  newOrder.status = 'processing';
  // copy the cart to the order
  newOrder.setCart(req.bsmw.cart);
  // destroy the original cart
  req.bsmw.cart.remove();
  // copy shipTo and billTo to the order, then destroy them
  newOrder.shipTo.push(req.bsmw.shipTo);
  req.bsmw.shipTo.remove();
  newOrder.billTo.push(req.bsmw.billTo);
  req.bsmw.billTo.remove();
  // save the receipt to session
  req.session.receipt = newOrder.receipt;
  // delete unneeded session data
  delete req.session.cart;
  delete req.session.order; 
  delete req.session.shipTo;
  delete req.session.billTo;
  // save the order
  newOrder.save(function(err) {
    if (err) console.log(err);
    // give the user a receipt
    res.redirect('/checkout/receipt');
  });
});

app.get('/checkout/receipt', function(req, res) {
  // once the user has a receipt, delete it from session
  var receipt = req.session.receipt;
  delete req.session.receipt;
  res.render('checkout/receipt', {receipt: receipt });
});


