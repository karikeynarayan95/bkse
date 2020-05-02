/*
|----------------------------------------------------------------------
| /app_modules/staff/routes/root.js
|----------------------------------------------------------------------
|
| -Staff Routes Root-
|
*/

var async = require('async'),
    Product = mongoose.model('Product'),
    Staff = mongoose.model('Staff'),
    Customer = mongoose.model('Customer'),
    Orders = mongoose.model('Order');

// function to count items in a database collection,
// accepts optional filter params
var count = function(memo, item, callback) {
  // if the query has no filter, create an empty one
  if (!item.filter) { item.filter = {}; };
  // count the size of the collection passing the filter
  item.model.count(item.filter, function(err, count) {
    // add to results memo
    memo[item.name] = count 
    callback(err, memo);
  });
};

app.get('/', function(req, res) {
  // get some database statistics
  async.reduce([
    { name: 'products', model: Product },
    { name: 'staff', model: Staff },
    { name: 'customers', model: Customer },
    { name: 'orders', model: Orders },
    { name: 'processing', model: Orders, 
      filter: {status: 'processing'}, },
  ], {}, count, function(err, counts) { 
    // render the index and pass the statistics to the template
    res.render('index', { title: 'Rylon Admin', counts: counts });
  });
});

