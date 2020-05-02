/*
|----------------------------------------------------------------------
| /app_modules/admin/routes/data-tools.js
|----------------------------------------------------------------------
|
| -Admin Routes Data-Tools-
|
| Provides methods and data for admin database operations 
|
*/

var Staff = mongoose.model('Staff');
var Product = mongoose.model('Product');
var Customer = mongoose.model('Customer');
var async = require('async');
  
// a default admin dataset 
var default_admin = { 
    email: "admin@admin.com",
    username: "admin",
    firstname: "ad",
    lastname: "min",
    password: "password",
    admin: true,
};

// some customer datasets
var customers = [
  { email: "customer@customs.com",
    username: "customer",
    firstname: "Cust",
    lastname: "Omer",
    password: "password",
    address: "5 Custom Way",
    postcode: "3184",
    state: "Vic", },
  { email: "customer2@customs.com",
    username: "customer2",
    firstname: "Custa",
    lastname: "Marr",
    password: "password",
    address: "18 Custom Way",
    postcode: "3184",
    state: "Vic", },
];

// some staff datasets
var staffs = [
  { email: "dave@admin.com",
    username: "admin",
    firstname: "dave",
    lastname: "lister",
    password: "vindaloo",
    admin: false, },
  { email: "kris@admin.com",
    username: "admin2",
    firstname: "kris",
    lastname: "kochanski",
    password: "pineappleyoghurt",
    admin: false },
];

// some product datasets
var products = [
  { warehouse_code: "pcp001",
    title: "Adv. Paperclips for Beginners",
    author: "MacGyver",
    publisher: "Pete Publishing",
    publish_date: '12/6/1983',
    stock: '7',
    isbn: '84299425882',
    price: 17.99, },
  { warehouse_code: "lpp221",
    title: "Lockpicking with Paperclips",
    author: "MacGyver",
    publisher: "Pete Publishing",
    publish_date: '2/10/1983',
    stock: '15',
    isbn: '84299422034',
    price: 13.99, },
  { warehouse_code: "pcf001",
    title: "Paperclips for Beginners",
    author: "MacGyver",
    publisher: "Penny Publishing",
    publish_date: '1/10/1982',
    stock: '22',
    isbn: '84299332425',
    price: 8.99, },
  { warehouse_code: "pcp001",
    title: "Paperclip Thermodynamics",
    author: "MacGyver",
    publisher: "Pete Publishing",
    publish_date: '12/6/1983',
    stock: '7',
    isbn: '84299425882',
    price: 17.99, },
  { warehouse_code: "lpp221",
    title: "How To Be A Villain",
    author: "Murdoc",
    publisher: "BadGuy Publishing",
    publish_date: '1/4/1973',
    stock: '9',
    isbn: '33299231343',
    price: 13.99, },
  { warehouse_code: "pcf001",
    title: "Villainy For Beginners",
    author: "Murdoc",
    publisher: "Penny Publishing",
    publish_date: '3/12/1982',
    stock: '44',
    isbn: '84233902425',
    price: 16.99, }

];

// sets of model/datalist pairs
var datasets = [
  { model: Staff, data: staffs },
  { model: Product, data: products },
  { model: Customer, data: customers },
];

// module returns an object containing functions
module.exports = { 
  loadtest: function(alldone) {
    // for each dataset-set
    async.forEach(datasets, function(ds, setback) {
      // for each dataset
      async.forEach(ds.data, function(data, databack) {
        // load the dataset into the corresponding model
        var item = new ds.model(data);
        item.save(function(err) {
          databack(err);
        }); 
      }, function(err) {
        setback(err);
      });
    }, function(err, results) { 
      alldone(err);
    });
  },

  purge: function(alldone) {
    async.series([
      function(sback) {
        // kill the database
        mongoose.connection.db.dropDatabase(function(err) {
          if (err) { sback(err); } else { sback() };
        });
      },
      function(sback) {
        // load our safety admin
        var admin = new Staff(default_admin);
        admin.save(function(err) {
          if (err) { sback(err); } else { sback(); }
        }); 
      }
    ], function(err) {
      if (err) { alldone(err); } else { alldone(); };
    });
  },
};


