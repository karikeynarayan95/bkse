/*
|----------------------------------------------------------------------
| /test/test.database.js
|----------------------------------------------------------------------
|
| -Mocha Test: Database-
|
| Test suite for basic database and schema functionality
|
*/

// imports
var should = require('should'),
    config = require('./config'),
    detect = require('./detect'),
    gen = require('./generate');

describe('Database', function() {
    var mongoose;
    describe('Mongoose ODM', function() {
        var conn;
        it('is installed', function(done) {
            mongoose = require('mongoose');
            done();
        });
        it('can connect', function(done) {
            conn = mongoose.createConnection(config.dbURI);
            done();
        });
        it('can disconnect', function(done) {
            conn.close();
            done();
        });
    });
    describe('Models/Schemas', function() {
        var conn = 
        before(function(done) {
            conn = mongoose.createConnection(config.dbURI);
            done();
        });
        after(function(done) {
            mongoose.disconnect();
            done();
        });
        it('can load staff', function(done) {
            require('../models/staff')(conn)
            var Staff = conn.model('Staff');
            done();
        });
        it('can load customers', function(done) {
            require('../models/customer')(conn)
            var Customer = conn.model('Customer');
            done();
        });
        it('can load billTos', function(done) {
            require('../models/billTo')(conn)
            var BillTo = conn.model('BillTo');
            done();
        });
        it('can load shipTos', function(done) {
            require('../models/shipTo')(conn)
            var ShipTo = conn.model('ShipTo');
            done();
        });
        it('can load products', function(done) {
            require('../models/product')(conn)
            var Product = conn.model('Product');
            done();
        });
        it('can load orderProducts', function(done) {
            require('../models/orderProduct')(conn)
            var OrderProduct = conn.model('OrderProduct');
            done();
        });
        it('can load carts', function(done) {
            require('../models/cart')(conn)
            var Cart = conn.model('Cart');
            done();
        });
        it('can load orders', function(done) {
            require('../models/order')(conn)
            var Order = conn.model('Order');
            done();
        });
    });
});
