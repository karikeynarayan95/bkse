/*
|----------------------------------------------------------------------
| /app_modules/staff/routes/middleware.js
|----------------------------------------------------------------------
|
| -Staff Routes Middleware-
|
| Specific middleware that shouldn't be called on all requests 
|
*/

var isBlank = function(str) {
    return (!str || /^\s*$/.test(str));
};

var Product = mongoose.model('Product');

app.post('/search', function(req, res) {
  // get our search query
  var query = req.param('searchQuery');
  // check the query as author, title, and isbn
  // merge results
  Product.find(
    { $or: [
      { author: { $regex: query, $options: 'i'} },
      { title: { $regex: query, $options: 'i'} },
      { isbn: { $regex: query, $options: 'i'} }, 
      ] 
    }, function(err, products) {
      if (err) {
          console.log(err);
      } else {
        // render the products that matched the search
        res.render('search', {
          title: 'Search: '+query,
          query: query,
          products: products
        });
      };
    }
  );
});


