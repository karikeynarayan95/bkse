/*
|----------------------------------------------------------------------
| /test/generate.js
|----------------------------------------------------------------------
|
| -Test Generation Module-
|
| Contains field value generators for testing purposes. 
|
*/

module.exports = {
    alpha: function(size) {
        var output = ""
        for(var i = 0; i < size; i++) {
            output += "a";
        };
        return output;
    },
    
    numer: function(size) {
        var output = ""
        for(var i = 0; i < size; i++) {
            output += "1";
        };
        return output;
    },

    email: function(size) { 
        return this.alpha(size-4)+"@a.a"; 
    },
};

