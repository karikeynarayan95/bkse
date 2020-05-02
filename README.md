
# Bookstore - university assignment

 Bookstore is an online book sales system.

## Warning 
 Bookstore was produced as part of a univeristy assignment. I make no guarantees about quality or completeness.

## README Contents

- [Installation Guide](#a2)
    - [Conventions](#a2-1)
    - [Create Server](#a2-2)
    - [Configure DNS](#a2-3)
    - [Add SSH Key to Server](#a2-4)
    - [Login to Server](#a2-5)
    - [Update/Install Base Server Software](#a2-6)
    - [Install Bookstore](#a2-7)
- [Programmers Guide](#a3)
    - [Source](#a3-1)
    - [Tesing](#a3-2)
    - [Reading The Code](#a3-3)
- [User Guide](#a4)
    - [Accounts](#a4-1)
    - [Products](#a4-2)
    - [Cart](#a4-3)
    - [Checkout](#a4-4)
- [References](#a5)
- [Bibliography](#a6)
- [License](#a19)

<a name="a2"/>
## Installation Guide 

### Server Deployment Example (Rackspace, Ubuntu)

<a name="a2-1"/>
#### Conventions
{bracketed_items} are variable and will change based on deployment. 

```bash
{server_domain} = bookstoredomain.com
{server_name} = bookstoredomain
```
<a name="a2-2"/>
#### Create Server
- create a rackspace account
- access 'Cloud Servers' control panel
- select 'Add Server'
- select 'Ubuntu 12.04 LTS'
- configure server name and size
- create server
- record root password

<a name="a2-3"/>
#### Configure DNS
- access rackspace 'DNS' tab
- record server ip
- select 'Add Domain', complete form
- click newly added domain
- select 'Add Record':
    - Record Type: A
    - Record Name: _Blank_
    - Ip Address: _Your_Server_IP_
- select 'Add Record':
    - Record Type: CNAME
    - Record Name: www
    - Record Content: _Your_Domain_
- select 'Add Record':
    - Record Type: CNAME
    - Record Name: admin 
    - Record Content: _Your_Domain_
- select 'Add Record':
    - Record Type: CNAME
    - Record Name: staff 
    - Record Content: _Your_Domain_

<a name="a2-4"/>
#### Add SSH Key to Server (optional)
- generate key (on client)

  ```bash
  $ ssh-keygen -f ~/.ssh/my_key
  ```
- send key to server (on client)

  ```bash
  $ ssh-copy-id -i ~/.ssh/my_key.pub root@{server_domain}
  ```

<a name="a2-5"/>
#### Access Server 

- ssh to server 

  ```bash
  $ ssh root@{server_domain}
  ```

<a name="a2-6"/>
#### Update / Install Base Server Software <sup>\[[r2]\]</sup>

- add node.js PPA 

  ```bash
  $ sudo apt-get install python-software properties
  $ sudo add-apt-repository ppa:chris-lea/node.js
  ```

- add MongoDB repository

  ```bash
  $ sudo echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" >> /etc/apt/sources.list
  $ apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10 
  ```

- update and install software

  ```bash
  $ sudo apt-get update
  $ sudo apt-get upgrade
  $ sudo apt-get install nginx node npm fail2ban mongodb-10gen
  ```

<a name="a2-7"/>
#### Install Bookstore <sup>\[[r1]\]</sup>

- create user for bookstore

  ```bash
  $ sudo adduser \
  > --system \
  > --shell /bin/bash \
  > --gecos 'user for bookstore' \
  > --group \
  > --disabled-password \
  > --home /home/bookstore \
  > bookstore
  ```

- install bookstore software 

  ```bash
  $ cd /home/bookstore
  $ git clone https://github.com/rozifus/bookstore-uni-assignment.git app
  $ cd app
  $ npm install
  ```

- configure bookstore domain
  `/home/bookstore/app/app.js`

  ```bash
  ...

  var server_domain = {server_domain}
  ...

  ```

- create bookstore upstart profile
  `/etc/init/bookstore.conf`

  ```upstart
  #!upstart
  description "bookshop service"

  start on filesystem and static-network-up
  stop on shutdown

  script
    export HOME="/home/bookstore"
    echo $$ > /var/run/bookstore.pid
    exec sudo -u bookstore /usr/bin/node /home/bookstore/app/app.js >> /var/log/bookstore.pid 2>&1
  end script
  ```

- create nginx config
  `/etc/nginx/sites-available/{server_name}`

  ```nginx
  upstream app_bookstore {
    server 127.0.0.1:8001;
  }

  server {
    listen 0.0.0.0:80;
    server_name {server_domain};
    access_log /var/log/nginx/{server_name}.log;
    location / {
      proxy_set_header X-Real_IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://app_bookstore/;
      proxy_redirect off;
    }
  }
  ```

- enable nginx site

  ```bash
  $ sudo ln -s /etc/nginx/sites-available/{server_name} /etc/nginx/sites-enabled/{server_name}
  ```

<a name="a3"/>
## Programmers Guide 

<a name="a3-1"/>
### Source Code

<a name="a3-1-1"/>
#### Getting The Source
  - install git 
  - download the bookstore source from github 

  ```bash
  git clone https://github.com/rozifus/bookstore-uni-assignment.git
  ```

#### Software Components
  - [node.js](http://nodejs.org/) `0.8.9`
  - [node package manager (npm)](https://npmjs.org/) `1.1.59`
  - Node Packages
    - [async](https://github.com/caolan/async) `0.1.22`
    - [express](http://expressjs.com/) `2.5.8`
    - [express-validator](https://github.com/ctavan/express-validator) `0.2.4`
    - [jade](http://jade-lang.com/) `0.27.2`
    - [mocha](http://mochajs.org/) `1.6.0`
    - [mongoose](http://mongoosejs.com/) `3.0.1`
    - [mongoose-validator](https://github.com/leepowellcouk/mongoose-validator) `0.1.3`
    - [should](https://github.com/visionmedia/should.js) `1.2.0`
    - [validator](https://github.com/chriso/node-validator) `0.4.12`
  - Other Software
    - [twitter boostrap](http://twitter.github.com/bootstrap/) `2.1.1`
    - [jQuery](http://jquery.com) `1.8.2`


<a name="a3-1-2"/>
#### Application Layout 

```bash
.
├── app_modules                 - contains mounted express applications
│   ├── admin                   - the admin module
│   │   ├── public              - static files
│   │   ├── routes              - routing / control-logic
│   │   ├── views               - layouts for rendering
│   │   ├── app.js              - admin module express application
│   │   └── app_middleware.js   - admin module custom middleware
│   ├── bookstore               - the bookstore module
│   │   ├── public              - static files
│   │   ├── routes              - routing / control-logic 
│   │   ├── views               - templates for rendering
│   │   │   ├── account         - account related templates
│   │   │   ├── checkout        - checkout related templates
│   │   ├── app.js              - bookstore module express application
│   │   └── app_middleware.js   - bookstore module customer middleware
│   └── staff                   - the staff module
│       ├── public              - static files
│       ├── routes              - routing / control-logic
│       ├── views               - layouts for rendering
│       ├── app.js              - staff module express application
│       └── app_middleware.js   - staff module custom middleware
├── models                      - mongoose data models
├── test                        - test suites
│   ├── config.js               - test configuration data
│   ├── detect.js               - error detectors for tests
│   ├── generate.js             - field generators for tests
│   ├── test.database.js        - database test suite
│   ├── test.model-customer.js  - customer model test suite
│   ├── test.model-staff.js     - staff model test suite
│   └── valid.js                - known valid data for testing
├── app.js                      - main application
├── db-connect.js               - database init 
├── Makefile                    - alias' for tests
├── package.json                - package information for npm
└── Readme.md                   - the file you are viewing currently
```

<a name="a3-2"/>
### Testing

<a name="a3-2-1"/>
#### Testing Models
- open termial
- cd to bookstore application root
- ensure mocha is installed

  ```bash
  $ npm install
  ```

- run tests
  - condensed report

  ```bash
  $ make test
  ```

  - complete report

  ```bash
  $ make test-verbose
  ```

<a name="a3-3"/>
### Reading The Code 

<a name="a3-3-1"/>
#### Asynchronous Programming With Callbacks 
Javascript allows functions to be passed as parameters to other functions:
```javascript
var paramfunc = function() {
  //this happens second..
};

var myfunc = function(callback) {
  //this happens first..
  callback()
  //this happens last..
};

myfunc(paramfunc);
```

Often we won't define our callback before hand, we'll instead create it as an anonymous function within the parameters of the calling function:

```javascript
var myfunc = function(callback) {
  //this happens first..
  callback()
  //this happens last..
};

myfunc(function() { //this happens second..  } );
```

We might also open up the anonymous callback function so that we can place code inside.

```javascript
var myfunc = function(callback) {
  //this happens first..
  callback()
  //this happens last..
};

myfunc(function() { 
    //this happens second..  
});
```

This allows us to do asynchronous tasks safely as we can use these callbacks to delay sensitive operations unit it's safe for them to run:

```javascript
var saveToDatabase = function(data, callback) {
  //save our data, happens first..
  callback()
  //this happens last..
};

saveToDatabase(mydata, function() { 
  //use our saved data, happens second..
});
```

We also might pass an error back into our callback if something goes wrong:

```javascript
var saveToDatabase = function(data, callback) {
  //save our data, happens first..
  if (something_went_wrong) {
    callback(error);
  } else {
    callback(null);
  };
  //this happens last..
};

saveToDatabase(mydata, function(error) { 
  if (error) {
    //deal with the error
  } else {
    //use our saved data, happens second..
  };
});
```

These types of callbacks will appear frequently with the application source.

<a name="a3-3-2"/>
#### Jade Templates

The views for the app were created in the Jade templating language.

Jade renders to html but uses indentation rather than tags:

`Jade`

```jade
html
  head
    title My Site
  body
    p Some Text

```

`html`
```html
<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <p>Some Text</p>
  </body>
</html>
```

Jade also uses the `.` character to denote classes, `#` to denote id's and parenthesis `()` for other attributes:

`Jade`

```jade
span.myclass some text
span#myid some text
span(myattr="myvalue") some text
```

`html`
```html
<span class="myclass">some text</span>
<span id="myid">some text</span>
<span myattr="myvalue">some text</span>

```

<a name="a4"/>
## User Guide

<a name="a4-1"/>
### Accounts

<a name="a4-1-1"/>
#### Logging In 
  - from the top menu click `login` 
  - if you already have an account
      - enter your username and password
      - click the `Login` button
  - if you have no account
      - select the `Create Account` button
      - see: 'Creating An Account'
    
<a name="a4-1-2"/>
#### Creating An Account
  - enter your details
  - select `create account`

<a name="a4-1-3"/>
#### Viewing Your Account
  - while logged in select the `Account` link at the top right of the page
  - you will be presented with your account details and order history

<a name="a4-2"/>
### Products 

<a name="a4-2-1"/>
#### Using The Search Bar
  - click the search bar at the top of the page
  - enter either the title, author, or isbn
  - press enter on the keyboard
  - you will be presented with books matching your search

<a name="a4-2-2"/>
#### Viewing Products
  - if you see an item you are interested in click it's name
  - you will be presented with the product's details
  - if you would like to purchase the product: 
    - enter the quantity you would like in the quantity field
    - click `Add to Cart`
    - you will be shown your current cart

<a name="a4-3"/>
### Cart

<a name="a4-3-1"/>
#### Viewing The Cart
  - the cart will display products you are planning to purchase, quantities, and costs.

<a name="a4-3-2"/>
#### Updating Cart
  - enter a new quantity in the `new quantity` field
  - click the `update` button
  - your cart, quantities and costs will be updated

<a name="a4-3-3"/>
#### Removing An Item
  - click the `remove` link at the end of the item description
    - alternately: update the item to a value less than 1
  - the item will be removed from the cart  

<a name="a4-3-4"/>
#### Checking Out
  - when you are satisfied with your cart, select `Checkout`
  - see: 'Checkout'

<a name="a4-4"/>
### Checkout

<a name="a4-4-1"/>
#### Ship To
  - enter your postage details
  - click the `payment details` button

<a name="a4-4-2"/>
#### Bill To
  - enter your payment details
  - click the `confirm order` button

<a name="a4-4-3"/>
#### Receipt
  - your order has been placed
  - please record your receipt

<a name="a5"/>
## References 
 - [\[r1\]: Caolan McMahon - Deploying Node Apps with Upstart][r1]
[r1]: http://caolanmcmahon.com/posts/deploying_node_js_with_upstart/
 - [\[r2\]: apptob.org - Rock-Solid Node.js Platform on Ubuntu][r2]
[r2]: http://apptob.org/


<a name="a6"/>
## Bibliography
 - [David Feinberg - Nested Models with Mongoose & Node](http://rawberg.com/blog/nodejs/mongoose-orm-nested-models/)
 - [Antonin Januska - How to Write Code Comments Well](http://antjanus.com/blog/web-design-tips/best-comment-separaor/)
 - [Raynos - Guide For Writing Mocha Tests](https://gist.github.com/2896455)
 - [TJ Holowaychuk - Jade Mixins & Includes](http://tjholowaychuk.com/post/7590787973/jade-mixins-includes)
 - [Calvin French-Owen - Node and Express Tips](http://calv.info/node-and-express-tips/)

<a name="a19"/>
## License

(The MIT License)

Copyright (c) 2012 Ryan Miller &lt;rozifus@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
