/*
|----------------------------------------------------------------------
| /db-connect.js
|----------------------------------------------------------------------
|
| -Database Main Connection Module-
|
| Creates a connection to the MongoDB database via mongoose. 
|
*/

// import mongoose and export it to the requiring app
exports = mongoose = require('mongoose');
// ask mongoose to connect to mongo db
mongoose.connect('mongodb://localhost/bookstore_app');
// export mongoose schema
exports = Schema = mongoose.Schema
