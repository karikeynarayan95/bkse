/*
|----------------------------------------------------------------------
| /models/billTo.js
|----------------------------------------------------------------------
|
| -BillTo Model-
|
| Stores data relating to customer payments. 
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
  var billToSchema = new mongoose.Schema({ 
    name: { type: String, default: "" },
    brand: {
        type: String, required: true,
        default: 'mastercard',
        enum: ['visa', 'vastercard'],
      },
    cardNo: { type: String, default: ""},
    expiry: { type: String, default: ""},
  });

  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('BillTo', billToSchema);
};

