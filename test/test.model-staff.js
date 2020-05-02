/*
|----------------------------------------------------------------------
| /test/test.model-staff.js
|----------------------------------------------------------------------
|
| -Mocha Test: Staff Model-
|
| Test suite for staff model. 
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
    Staff,
    staff;

describe('Staff Model', function() {
    before(function(done) {
        conn = mongoose.createConnection(config.dbURI);
        require('../models/staff')(conn)
        Staff = conn.model('Staff');
        Staff.remove({}, function(err) {
            done(err);
        });
    });
    after(function(done) {
        mongoose.disconnect();
        done();
    });
    it('can be saved', function(done) {
        staff = new Staff(valid.staff);
        staff.save(function(err) {
            if (err) throw err;
            done();
        });
    });
    it('can be queried', function(done) {
        Staff.findById(staff.id, function(err, found) {
            if (err) throw err;
            if (!found) { 
                throw Error('query by id failed');
            };
            done();
        });
    });
    it('can be removed', function(done) {
        staff.remove()
        Staff.find({}, function(err, staffs) {
            if (err) throw err;
            if (staffs.length) { 
                throw Error("staff still exists");
            }
            done();
        });
    });

    describe('email', function() {
        it('should require @ character', function(done) {
            staff = new Staff(valid.staff);
            staff.set({email: "bademail.com"});
            staff.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should require . character', function(done) {
            staff = new Staff(valid.staff);
            staff.set({email: "bad@emailcom"});
            staff.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should reject blank', function(done) {
            staff = new Staff(valid.staff);
            staff.set({email: "@."});
            staff.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });
        it('should reject length > 64', function(done) {
            staff = new Staff(valid.staff);
            staff.set({email: gen.email(65)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'email'); 
            });
        });

    });

    describe('username', function() {
        it("should reject blank", function(done) {
            staff = new Staff(valid.staff);
            staff.set({username: "        "});
            staff.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
        it("should reject length > 32", function(done) {
            staff = new Staff(valid.staff);
            staff.set({username: gen.alpha(33)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
        it("should reject special characters", function(done) {
            staff = new Staff(valid.staff);
            staff.set({username: gen.alpha(10)+"@"});
            staff.save(function(err) { 
                detect.validationError(err, done, 'username'); 
            });
        });
    });

    describe('firstname', function() {
        it("should reject blank", function(done) {
            staff = new Staff(valid.staff);
            staff.set({firstname: "        "});
            staff.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
        it("should reject length > 32", function(done) {
            staff = new Staff(valid.staff);
            staff.set({firstname: gen.alpha(33)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
        it("should reject numbers", function(done) {
            staff = new Staff(valid.staff);
            staff.set({firstname: gen.alpha(10)+"8"});
            staff.save(function(err) { 
                detect.validationError(err, done, 'firstname'); 
            });
        });
    });

    describe('lastname', function() {
        it("should reject blank", function(done) {
            staff = new Staff(valid.staff);
            staff.set({lastname: "        "});
            staff.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
        it("should reject length > 32", function(done) {
            staff = new Staff(valid.staff);
            staff.set({lastname: gen.alpha(33)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
        it("should reject numbers", function(done) {
            staff = new Staff(valid.staff);
            staff.set({lastname: gen.alpha(10)+"8"});
            staff.save(function(err) { 
                detect.validationError(err, done, 'lastname'); 
            });
        });
    });

    describe('password', function() {
        it("should reject whitespace", function(done) {
            staff = new Staff(valid.staff);
            staff.set({password: "        "});
            staff.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
        it("should reject length > 32", function(done) {
            staff = new Staff(valid.staff);
            staff.set({password: gen.alpha(65)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
        it("should reject length < 8", function(done) {
            staff = new Staff(valid.staff);
            staff.set({password: gen.alpha(7)});
            staff.save(function(err) { 
                detect.validationError(err, done, 'password'); 
            });
        });
    });

});
