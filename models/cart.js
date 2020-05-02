/*
|----------------------------------------------------------------------
| /models/cart.js
|----------------------------------------------------------------------
|
| -Cart Model-
|
| Stores data relating to a customer shoppin cart. 
|
| Really just a list of OrderProducts with a ton of 
| virtual methods for asynchronous access/modification.
|
*/

var mongoose = require('mongoose'),
    async = require('async'),
    validator = require('mongoose-validator').validator,

    OrderProduct = mongoose.model('OrderProduct');

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var cartSchema = mongoose.Schema({
    orderProducts: [OrderProduct.schema],
  });
 
  // a virtual attribute to get the total price of the cart
  cartSchema.virtual('price').get(function() {
    var price = 0;
    this.orderProducts.forEach(function(op) {
      price += op.price;
    });
    return price;
  });

  // a virtual attribute to get the number of items in the cart
  // eg. 3 red and 4 blue = 7 items in the cart
  cartSchema.virtual('size').get(function() {
    var size = 0;
    this.orderProducts.forEach(function(op) {
      size += +op.quantity;
    });
    return size;
  });

  // asynchronous method add an item by it's database id
  cartSchema.methods.addById = function(params, callback) {
    var t = this;
    // check the order products in the cart
    async.reduce(this.orderProducts, false, 
                 function(memo, op, redback) {
      // if we already have the product we're adding
      if (op.getProduct().id == params.id) {
        // simply increment that orderProduct
        op.quantity += +params.quantity;
        redback(null, true);
      } else { 
        redback(null, false); 
      };
    }, 
    // if after checking all cart
    function(err, result) {
      // if we don't have any product with that id
      if (!result) {
        // create an order product for the id
        var op = new OrderProduct({quantity: params.quantity});
        op.setProduct(params.id, function(err) {
          // put it in our cart's orderProduct array
          t.orderProducts.push(op);
          callback(err);
        });
      } else { 
        callback(err);
      };
    });
  };

  // asynchronous method to add an item by it's database id and then save
  cartSchema.methods.addByIdAndSave = function(params, callback) {
    var t = this;
    // in series
    async.series([
      // add by the id
      function(sback) {
        t.addById(params, function(err) {
          sback(err);
        });
      },
      // then save
      function(sback) {
        t.save(function(err) {
          sback(err);
        });
      }
    ], 
    function(err, result) {
      callback(err);
    });
  };

  // asynchrounous method to update an item by it's database id and then save
  cartSchema.methods.updateByIdAndSave = function(params, callback) {
    var t = this;
    // in series
    async.series([
      // udpate by id
      function(sback) {
        t.updateById(params, function(err) {
          sback(err); 
        });
      },
      // then save
      function(sback) {
        t.save(function(err) {
          sback(err);
        });
      },
    ],
    function(err) {
      callback(err);
    });
  };

  // asynchronous method to update and item by it's database id
  cartSchema.methods.updateById = function(params, callback) {
    var t = this;
    // check the products in the cart
    async.reduce(this.orderProducts, false,
                 function(memo, op, redback) {
      // if we haven't found the orderProduct yet
      if (!memo) {
        // if this is the right orderProduct
        if(op.getProduct().id == params.id) {
          // if we're actually setting the quantity to zero
          if (params.quantity < 1) {
            // remove the orderProduct
            t.removeById(params.id, function(err) {
              redback(err, true);
            });        
          } else {
            // set the product quantity to the param value
            op.quantity = params.quantity;
            redback(null, true);
          };
        } else { redback(null, false); };
      } else { redback(null, false); };
    }, 
    // if after checking all our orderProducts
    function(err, result) {
      // we didn't find our target id
      if (!result) {
        // add a new orderProduct for that id, quantity
        t.addById(params, function(err) {
          callback(err);
        });
      } else { callback(null); };
    });
  };

  // asynchronous method to remove an orderProduct by it's product id
  cartSchema.methods.removeById = function(id, callback) {
    var ops = this.orderProducts;
    // iterate our orderProducts
    for (var i=0; i < ops.length; i++) {
      // if one matches our target id
      if (ops[i].product.id == id) {
        // remove it
        ops.splice(i,1);
      };
    };
    callback(null);
  };

  // asynchronous method to remove an orderProduct by it's product id
  // and then save
  cartSchema.methods.removeByIdAndSave = function(id, callback) {
    var t = this;
    // in series
    async.series([
      // remove by id
      function(sback) {
        t.removeById(id, function(err) {
          sback(err);
        });
      }, 
      // then save
      function(sback) {
        t.save(function(err) { 
          sback(err);
        });
      },
    ],
    function(err) {
      callback(err);
    });
  };

  // asynchronous method to update a set of orderProducts by their ids'
  cartSchema.methods.updateSetById = function(list, callback) {
    var t = this;
    // in parallel, for each item in our list
    async.forEachSeries(list, function(item, forback) {
      // update by id
      t.updateById(item, function(err) {
        forback(err);
      });
    },
    function(err) {
      callback(err);
    });
  };

  // asynchronous method to update a set or orderProducts by thier ids'
  // and then save
  cartSchema.methods.updateSetByIdAndSave = function(list, callback) {
    var t = this;
    // in series
    async.series([
      function(sback) {
        // update the set by id
        t.updateSetById(list, function(err) {
          sback(err);
        });
      },
      // then save
      function(sback) {
        t.save(function(err) {
          sback(err);
        });
      },
    ], 
    function(err) {
      callback(err)
    });
  };
   
  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('Cart', cartSchema);
};

