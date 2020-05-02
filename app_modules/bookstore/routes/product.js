/*
|----------------------------------------------------------------------
| /app_modules/bookstore/routes/product.js
|----------------------------------------------------------------------
|
| -Staff Routes Middleware-
|
| Specific middleware that shouldn't be called on all requests 
|
*/

var Product = mongoose.model('Product')
var isBlank = function(str) {
    return (!str || /^\s*$/.test(str));
};

app.get('/product/:id', function(req, res) {
  // find product with id matching param
  Product.findById(req.param('id'), function(error, product) {
    if (!product) {
      // if got none 404
      res.redirect('/404');
    }
    if (error) console.log(error);
    // render the product
    res.render('product', { title: 'View Product', product: product });
  })
});


app.get('/product', function(req, res) {
  // get all products
  Product.find({}, function(err, product) {
    if (err) console.log("ERR!");
    if (!product.length) {
      var new_product = new Product({});
      new_product.save(); 
      product.push(new_product);
    };
    // render products 
    res.render('product/index', { title: 'Products', product: product });
  })
});

app.get('/product/:id/edit', function(req, res) {
  // find a product by it's id to edit it
  Product.findById(req.param('id'), function(error, product) {
    if (!product) {
      res.redirect('/404');
    }
    if (error) console.log(error);
    // render the product page
    res.render('product/edit', {
      title: 'Edit Product',
      product: product 
    })
  })
});

app.post('/product/:id/edit', function(req, res) {
  // find the product by id
  Product.findById(req.param('id'), function( err, product ) {
    if (err) console.log(err);
    if (!product) res.redirect('/404');
    // update the product and save
    product.set(req.body);
    product.save(function(err) {
      console.log(err);
    });
    res.redirect('/product');
  });
});

app.get('/product/new', 
  // create a new product
  function(req, res) {
    var new_product = new Product({});
    // save the product
    new_product.save(function(err) {
      if (err) console.log('/product/new', err);
    });
    res.redirect('/product/'+new_product.id+'/edit');
});

app.get('/product/:id/delete', function(req, res) {
  // find a product by id and delete it
  Product.findById(req.param('id')).remove();
  res.redirect('/product');
});

