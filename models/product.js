/*
|----------------------------------------------------------------------
| /models/product.js
|----------------------------------------------------------------------
|
| -Product Model-
|
| Stores data relating to products. 
|
*/

// import modules
var mongoose = require('mongoose'),
    validator = require('mongoose-validator').validator;

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var productSchema = new mongoose.Schema({ 
    warehouse_code: { 
        type: String, required: true, 
        validate: [ 
          validator.isAlphanumeric(),
          validator.len(6), 
        ] },  

    title: { 
        type: String, required: true,
        validate: [ 
          validator.len(1, 64),
        ] },

    author: { 
        type: String, required: true,
        validate: [
          validator.len(1, 64),
        ] },

    publisher: { 
        type: String, required: true,
        validate: [
          validator.len(1, 32),
        ] },

    publish_date: { 
        type: Date, required: true, 
        validate: [ 
          validator.isDate(),
        ] },  

    stock: { 
        type: Number, required: true,
        validate: [
          validator.isInt(),
        ] },

    isbn: { type: String, required: true,
        validate: [
          validator.isNumeric(),
          validator.len(11,13),
        ] },

    price: { type: Number, required: true,
        validate: [
          validator.isDecimal(),
          validator.min(0.01),
          validator.max(1000000),
        ] },
  });
    
  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('Product', productSchema);
};

