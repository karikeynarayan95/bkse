/*
|----------------------------------------------------------------------
| /test/valid.js
|----------------------------------------------------------------------
|
| -Valid Test-Data Module-
|
| Returns an object with valid model data used for testing. 
|
*/

var valid = {}

valid.staff = { 
    email: "admin@admin.com",
    username: "admin",
    firstname: "Ad",
    lastname: "Min",
    password: "password",
    admin: true,
};

valid.customer = {
    email: "cust@cust.com",
    username: "cust",
    firstname: "Cust",
    lastname: "Omer",
    password: "password",
    address: "15 Customer Way",
    postcode: "3125",
    state: "Victoria",
};

valid.billTo = {
    name: "Bill Me",
    brand: "Mastercard",
    cardNo: "1111222233334444",
    expiry: Date.now(),
};

valid.shipTo = {
    email: "shipto@me.com",
    name: "Ship To Me",
    address: "15 Shipping Way",
    postcode: "3125",
    state: "Victoria",
};

valid.product = {
    warehouse_code: "pro001",
    title: "How to ship Products",
    author: "Captain Cargo",
    publisher: "Shipping Ship Co.",
    publish_date: Date.now(),
    isbn: "11112222333",
    price: "24.99"
};

valid.orderProduct = {
    _products: [valid.product,],
    quantity: 4,
};

valid.cart = {
    orderProducts: [valid.orderProduct,],
};

valid.order = {
    _carts: [valid.cart,],
    created: Date.now(),
    status: 'processing',
    shipTo: [valid.shipTo],
    billTo: [valid.billTo],
};

module.exports = valid;
