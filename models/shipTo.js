/*
|----------------------------------------------------------------------
| /models/shipTo.js
|----------------------------------------------------------------------
|
| -ShipTo Model-
|
| Stores data relating to customer shipping address. 
|
*/

// import modules
var mongoose = require('mongoose'),
    validator = require('mongoose-validator').validator

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed-in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var shipToSchema = new mongoose.Schema({ 
    email: { type: String, default: ""},
    name: { type: String, default: ""},
    address: { type: String, default: ""},
    postcode: { type: String, default: ""},
    state: {type: String, default: ""},
  });

  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('ShipTo', shipToSchema);
};

