/*
|----------------------------------------------------------------------
| /test/test.model-customer.js
|----------------------------------------------------------------------
|
| -Mocha Test: Customer Model-
|
| Test suite for customer model. 
|
*/

// imports
var mongoose = require('mongoose'),
    should = require('should'),
    config = require('./config'),
    detect = require('./detect'),
    valid = require('./valid'),
    gen = require('./generate');

// variable init
var conn,
    Customer,
    customer;

describe('Customer Model', function() {
    before(function(done) {
        conn = mongoose.createConnection(config.dbURI);
        require('../models/customer')(conn)
        Customer = conn.model('Customer');
        Customer.remove({}, function(err) {
            done(err);
        });
    });
    after(function(done) {
        mongoose.disconnect();
        done();
    });
    it('can be saved', function(done) {
        customer = new Customer(valid.customer);
        customer.save(function(err) {
            if (err) throw err;
            done();
        });
    });
    it('can be queried', function(done) {
        Customer.findById(customer.id, function(err, found) {
            if (err) throw err;
            if (!found) { 
                throw Error('query by id failed');
            };
            done();
        });
    });
    it('can be removed', function(done) {
        customer.remove()
        Customer.find({}, function(err, customers) {
            if (err) throw err;
            if (customers.length) { 
                throw Error("customer still exists");
            }
            done();
        });
    });
    describe('email', function() {
        it('should require @ character', function(done) {
            customer = new Customer(valid.customer);
            customer.set({email: "bademail.com"});
            customer.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should require . character', function(done) {
            customer = new Customer(valid.customer);
            customer.set({email: "bad@emailcom"});
            customer.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should reject blank', function(done) {
            customer = new Customer(valid.customer);
            customer.set({email: "@."});
            customer.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should reject length > 64', function(done) {
            customer = new Customer(valid.customer);
            customer.set({email: gen.email(65)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });

    });
    describe('username', function() {
        it("should reject blank", function(done) {
            customer = new Customer(valid.customer);
            customer.set({username: "        "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
        it("should reject length > 32", function(done) {
            customer = new Customer(valid.customer);
            customer.set({username: gen.alpha(33)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
        it("should require alphanumeric", function(done) {
            customer = new Customer(valid.customer);
            customer.set({username: gen.alpha(10)+"@"});
            customer.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
    });

    
    describe('firstname', function() {
        it("should reject blank", function(done) {
            customer = new Customer(valid.customer);
            customer.set({firstname: "        "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
        it("should reject length > 32", function(done) {
            customer = new Customer(valid.customer);
            customer.set({firstname: gen.alpha(33)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
        it("should reject numbers", function(done) {
            customer = new Customer(valid.customer);
            customer.set({firstname: gen.alpha(10)+"8"});
            customer.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
    });

    describe('lastname', function() {
        it("should reject blank", function(done) {
            customer = new Customer(valid.customer);
            customer.set({lastname: "        "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
        it("should reject length > 32", function(done) {
            customer = new Customer(valid.customer);
            customer.set({lastname: gen.alpha(33)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
        it("should reject numbers", function(done) {
            customer = new Customer(valid.customer);
            customer.set({lastname: gen.alpha(10)+"8"});
            customer.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
    });

    describe('password', function() {
        it("should reject whitespace", function(done) {
            customer = new Customer(valid.customer);
            customer.set({password: "        "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
        it("should reject length > 32", function(done) {
            customer = new Customer(valid.customer);
            customer.set({password: gen.alpha(65)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
        it("should reject length < 8", function(done) {
            customer = new Customer(valid.customer);
            customer.set({password: gen.alpha(7)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
    });

    describe('address', function() {
        it("should reject length > 64", function(done) {
            customer = new Customer(valid.customer);
            customer.set({address: gen.alpha(65)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'address'); 
            });
        });
        it("should reject length < 3", function(done) {
            customer = new Customer(valid.customer);
            customer.set({address: gen.alpha(2)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'address'); 
            });
        });
    });

    describe('postcode', function() {
        it("should reject blank", function(done) {
            customer = new Customer(valid.customer);
            customer.set({postcode: "    "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'postcode'); 
            });
        });
        it("should reject length > 4", function(done) {
            customer = new Customer(valid.customer);
            customer.set({postcode: gen.numer(3)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'postcode'); 
            });
        });
        it("should reject length < 4", function(done) {
            customer = new Customer(valid.customer);
            customer.set({postcode: gen.numer(5)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'postcode'); 
            });
        });
        it("should reject alpha", function(done) {
            customer = new Customer(valid.customer);
            customer.set({postcode: gen.alpha(4)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'postcode'); 
            });
        });

    });

    describe('state', function() {
        it("should reject whitespace", function(done) {
            customer = new Customer(valid.customer);
            customer.set({state: "        "});
            customer.save(function(err) { 
                detect.validationError(err, done, 'state'); 
            });
        });
        it("should reject length > 32", function(done) {
            customer = new Customer(valid.customer);
            customer.set({state: gen.alpha(33)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'state'); 
            });
        });
        it("should reject length < 2", function(done) {
            customer = new Customer(valid.customer);
            customer.set({state: gen.alpha(1)});
            customer.save(function(err) { 
                detect.validationError(err, done, 'state'); 
            });
        });
    });
});
