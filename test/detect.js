/*
|----------------------------------------------------------------------
| /test/detect.js
|----------------------------------------------------------------------
|
| -Test Detect Module-
|
| Contains detectors for certain error states. 
|
*/

var should = require('should');

module.exports = {
    validationError: function(err, done, item) {
        should.exist(err);
        err.should.have.property('name', 'ValidationError');
        err.should.have.property('errors')
           .obj.should.have.property(item)
        done(); 
    }
};

