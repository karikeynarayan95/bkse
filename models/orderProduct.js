/*
|----------------------------------------------------------------------
| /models/orderProduct.js
|----------------------------------------------------------------------
|
| -OrderProduct Model-
|
| Stores data relating to a product as part of an order or cart. 
|
*/

// import modules
var mongoose = require('mongoose'),
    validator = require('mongoose-validator').validator,

    Product = mongoose.model('Product');

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var orderProductSchema = new mongoose.Schema({ 
    _products: { 
        type: [Product.schema],
        },

    quantity: { 
        type: Number, required: true,
        validate: [
            validator.isInt(),
            validator.min(1),
            validator.max(999),
        ], }
  });

  // asynchronous method to set the product
  orderProductSchema.methods.setProduct = function(input, callback) {
    var t = this;
    if (typeof(input) === "string") {
      Product.findById(input, function(err, prod) {
        t._products[0] = prod;
        callback(err);
      });
    } else {
      t._products[0] = input;
      callback(null);
    };
  };

  // getter for the single product stored in the array
  orderProductSchema.virtual('product').get(function() {
    return this._products[0];
  });

  // method for getting the single product in the array
  orderProductSchema.methods.getProduct = function() {
    return this.product;
  };

  // getter for the total price of the orderProduct
  orderProductSchema.virtual('price').get(function() {
    return this.product.price * this.quantity;
  });

  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('OrderProduct', orderProductSchema);
};

