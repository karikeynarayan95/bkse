/*
|----------------------------------------------------------------------
| /app_modules/staff/routes/account.js
|----------------------------------------------------------------------
|
| -Staff Routes Account-
|
*/

var Order = mongoose.model('Order'),
    needLogin = require('./middleware').needLogin,
    check = require('validator').check,
    sanitize = require('validator').sanitize;

app.get('/account', needLogin, function(req, res) {
  res.render('account', { title: "Account" } );
});

app.post('/account', needLogin, function(req, res) {
  // if user didn't enter a password, delete it from the body 
  try {
    check(req.body.password).notBlank();
  } catch (ValidationError) {
    delete req.body.password
  };

  // update staff data from request
  req.bsmw.staff.set(req.body)
  req.bsmw.staff.save(function(err) {
    if (err) {
      // if couldn't save, store the errors and queue a error flash
      req.session.valErrors = err.errors;
      req.flash('error', "Validation Failed");
    } else {
      // otherwise queue a success flash
      req.flash('success', "Staff Data Updated");
    };
    res.redirect('/account');
  });
});


