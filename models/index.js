/* 
|-----------------------------------------------------------------
| /models/index.js
|-----------------------------------------------------------------
| 
| When required, loads a list of models into the calling 
| application or application module.
| 
*/

// our list of models to load
var model_list = [
  'staff',
  'customer',
  'shipTo',
  'billTo',
  'product',
  'orderProduct',
  'cart',
  'order',
];

// for each model 
model_list.map(function(model_name) {

    // get the model-module
    var model = require('./'+model_name);

    /* this code only exists because at one point I switched over
     * from scripty-model-modules over to function-model-modules 
     * because the scripty-models didn't play nice with my mocha 
     * unit tests.
     * I'm pretty sure they're all function-model-modules now
     * but I'm going to leave this code here anyway :)
     */

    var getType = {};
    // if the model-module is a function
    if (model && getType.toString.call(model) == '[object Function]') {
        // we want to run it
        var exports = module.exports = model();
    } else {
        // otherwise we should just load it
        var exports = module.exports = require('./' + model_name)
    };
});

