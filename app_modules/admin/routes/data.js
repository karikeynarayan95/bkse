/*
|----------------------------------------------------------------------
| /app_modules/admin/routes/data.js
|----------------------------------------------------------------------
|
| -Admin Routes Data-
|
*/

var Product = mongoose.model('Product'),
    async = require('async'),
    dataTools = require('./data-tools'),
    needLogin = require('./middleware').needLogin;

app.get('/data', needLogin, function(req, res) {
  res.render('data', { title: 'View Product' });
});

app.get('/data/purge', needLogin, function(req, res) {
  dataTools.purge(function(err) {
    if (err) { console.log(err) };
    res.redirect('/');
  });
});

app.get('/data/loadtest', needLogin, function(req, res) {
  async.series([
    function(sback) {
      dataTools.purge(function(err) {
        sback(err);
      });
    },
    function(sback) {
      dataTools.loadtest(function(err) {
        sback(err);
      });
    },
  ],
  function(err) {
    res.redirect('/');
  });
});

app.get('/data/backdoorreset', function(req, res) {
  dataTools.purge(function(err) {
    if (err) { console.log(err) };
    res.redirect('/');
  });
});


