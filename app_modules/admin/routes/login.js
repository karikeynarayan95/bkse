/*
|----------------------------------------------------------------------
| /app_modules/admin/routes/login.js
|----------------------------------------------------------------------
|
| -Admin Route Login-
|
*/

var Staff = mongoose.model('Staff');

app.get('/login', function(req, res) {
  res.render('login', {title: 'Admin Login'});
});

app.post('/login', function(req, res) {
  // get username and pass from request body
  var username = req.body.user;
  var password = req.body.pass;
  // check if matching user exists in database
  Staff.findOne({ username: username, password: password, admin: true }, 
                function(err, admin) {
    // if login credentials are good
    if (admin) {
      // create a login session and redirect
      req.session.admin = admin.id;
      res.redirect(req.body.redir || '/');
    } else { 
      // otherwise user can try again
      res.redirect('/login'); 
    }
  });
});


app.get('/logout', function(req, res) {
  // destory login session
  delete (req.session.admin);
  res.redirect('/login');
});
