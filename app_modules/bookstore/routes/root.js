/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/root.js
|----------------------------------------------------------------------
|
| -Bookstore Routes Root-
|
*/

var Product = mongoose.model('Product');

app.get('/', function(req, res) {
  // get all products
  Product.find({}, function(err, products) {
    if(err) console.log("ERR!");
    // render them
    res.render('index', { title: 'Rylon Books' , products: products });
  });
});

