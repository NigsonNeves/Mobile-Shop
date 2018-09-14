require('dotenv').config()

const express         = require('express')
const app             = express()
const bodyParser      = require('body-parser')
const firebase_admin  = require('firebase-admin')
const firebase        = require('firebase')

const firebase_admin_config = require('./src/firebase_admin.js').load_config(firebase_admin)
const firebase_config       = require('./src/firebase.js').load_config()

firebase_admin.initializeApp(firebase_admin_config)
firebase.initializeApp(firebase_config)

app.use(bodyParser.urlencoded({ extended: true }))

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000)
