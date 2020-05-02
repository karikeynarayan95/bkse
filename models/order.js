/*
|----------------------------------------------------------------------
| /models/order.js
|----------------------------------------------------------------------
|
| -Order Model-
|
| Stores data relating to orders. 
|
*/

// import modules
var mongoose = require('mongoose'),
    validator = require('mongoose-validator').validator;

var Cart = mongoose.model('Cart'),
    BillTo = mongoose.model('BillTo'),
    ShipTo = mongoose.model('ShipTo');

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed-in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var orderSchema = new mongoose.Schema({ 
    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Customer', 
      default: null 
    },

    _carts: [Cart.schema],

    created: { 
      type: Date, 
      default: Date.now,
      required: true,
    },

    shipped: { 
      type: Date, 
      default: null,
    }, 

    status: { 
      type: String, 
      enum: ['creating', 'processing', 'shipped'], 
      default: 'creating',
      required: true,
    },

    shipTo: [ShipTo.schema],

    billTo: [BillTo.schema],
  });

  // a virtual getter for a receipt attribute
  orderSchema.virtual('receipt').get(function() {
    return this.id;
  });

  // a virtual getter for the cart attribute
  orderSchema.virtual('cart').get(function() {
    return this._carts[0];
  });

  // a method for setting the cart
  orderSchema.methods.setCart = function(cart) {
    this._carts.push(cart); 
  };

  // a method for getting the cart
  orderSchema.methods.getCart = function() {
    return this.cart;
  };

  var Order = module.exports = mongoose.model('Order', orderSchema);
};

