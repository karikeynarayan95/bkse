/*
|----------------------------------------------------------------------
| /app_modules/admin/routes/root.js
|----------------------------------------------------------------------
|
| -Admin Route Root-
|
|
*/

// imports
var Product = mongoose.model('Product');

// redirect
app.get('/', function(req, res) {
    res.redirect('/data');
});

