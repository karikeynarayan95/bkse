/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/cart.js
|----------------------------------------------------------------------
|
| -Bookstore Routes Cart-
|
*/

var isBlank = function(str) {
    return (!str || /^\s*$/.test(str));
};

//
var Product = mongoose.model('Product'),
    OrderProduct = mongoose.model('OrderProduct'),
    Cart = mongoose.model('Cart');

app.get('/cart', function(req, res) {
  res.render('cart', { title: 'title' });
});


app.post('/cart/add', function(req, res) {
  // add item-quantity from request to cart
  req.bsmw.cart.addByIdAndSave(
    {id: req.body.id, quantity: req.body.quantity}, 
    function(err) {
      if (err) console.log(err);
      res.redirect('/cart');
  });
});

app.post('/cart/update', function(req, res) {
  // get a list of updated items from request body 
  var list = [];
  for (var k in req.body) { 
    list.push({id: k, quantity: req.body[k]});
  };
  // update cart from list
  req.bsmw.cart.updateSetByIdAndSave(list, function(err) {
    res.redirect('/cart');
  });
});

app.get('/cart/remove/:id', function(req, res) {
  // remove item selected in request param
  req.bsmw.cart.removeByIdAndSave(req.param('id'), function(err) {
    res.redirect('/cart');
  })
});

