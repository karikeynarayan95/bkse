/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/account.js
|----------------------------------------------------------------------
|
| -Bookstore Routes Account-
|
*/

var Order = mongoose.model('Order'),
    needLogin = require('./middleware').needLogin;

app.get('/account', needLogin, function(req, res) {
  // find orders belonging to the logged in customer
  Order.find({ customer: req.session.customer }, function(err, orders) {
    // render the account page passing the orders
    res.render('account/view', {title: "account", order_history: orders});
  });
});


app.post('/account/edit', needLogin, function(req, res) {
  // if password is blank
  if (/^\s*$/.test(req.body.password)) { 
    // it wasn't filled in so delete it
    delete req.body.password; 
  };
  // update customer
  req.bsmw.customer.set(req.body)
  // save customer and render account
  req.bsmw.customer.save(function(err) {
    res.redirect('/account');
  });
});

app.get('/account/edit', needLogin, function(req, res) {
  res.render('account/edit', {title: 'edit account'});
});

