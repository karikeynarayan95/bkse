/*
|----------------------------------------------------------------------
| /models/customer.js
|----------------------------------------------------------------------
|
| -Customer Model-
|
| Stores data relating to customers. 
|
*/

// import modules
var mongoose = require('mongoose'),
    validator = require('mongoose-validator').validator;

// this module returns a function
module.exports = exports = function(connection) {

  // if no connection was passed-in 
  if (typeof connection === 'undefined') { 
    // use the general mongoose connection as our connection
    var connection = mongoose; 
  };

  // a mongoose schema
  var customerSchema = new mongoose.Schema({ 
    email: { 
        type: String, required: true, 
        validate: [ 
          validator.isEmail(),
          validator.len(6, 64), 
        ] },  

    username: { 
        type: String, required: true,
        validate: [ 
          validator.isAlphanumeric(),
          validator.len(1, 32),
        ] },

    firstname: { 
        type: String, required: true,
        validate: [
          validator.isAlpha(),
          validator.len(1, 32),
        ] },

    lastname: { 
        type: String, required: true,
        validate: [
          validator.isAlpha(),
          validator.len(1, 32),
        ] },

    password: { 
        type: String, required: true, 
        validate: [ 
          validator.len(8,64),
          validator.notContains(' '),
        ] },  

    address: { 
        type: String, required: true,
        validate: [
          validator.len(3, 64),
        ] },

    postcode: { 
        type: String, required: true,
        validate: [
          validator.isNumeric(),
          validator.len(4,4),
        ] },

    state: { 
        type: String, required: true, 
        validate: [ 
          validator.isAlpha(),
          validator.len(2,32),
        ] },  
  });
    
  // bind our schema to the mongoose connection, 
  // return the resulting model
  return connection.model('Customer', customerSchema);
};

