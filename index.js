'use strict';

require('dotenv').config()

const app             = require('express')()
const firebase_admin  = require('firebase-admin')
const firebase        = require('firebase')

require('./src/server_config.js').config(app)
require('./src/firebase_admin.js').init(firebase_admin)
require('./src/firebase.js').init(firebase)

// Routes
require('./src/routes/users.js')(app, firebase)
require('./src/routes/sessions.js')(app, firebase)
require('./src/routes/shops.js')(app, firebase_admin)
require('./src/routes/products.js')(app, firebase_admin)
