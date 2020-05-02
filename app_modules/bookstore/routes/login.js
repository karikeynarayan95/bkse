/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/login.js
|----------------------------------------------------------------------
|
| -Bookstore Route Login-
|
*/

var Customer = mongoose.model('Customer');

app.get('/login', function(req, res) {
  res.render('login', {title: 'Customer Admin Login'});
});

app.post('/login', function(req, res) {
  // get username and pass from request body
  var username = req.body.user;
  var password = req.body.pass;
  // check if matching user exists in database
  Customer.findOne({ username: username, password: password }, 
                function(err, cust) {
    // if login credentials are good
    if (cust) {
      // create a login session and redirect
      req.session.customer = cust.id;
      res.redirect(req.body.redir || '/');
    } else { 
      // otherwise user can try again
      res.redirect('/login'); 
    }
  });
});


app.get('/logout', function(req, res) {
  // destory login session
  delete (req.session.customer);
  res.redirect('/login');
});
