require('dotenv').config()

const express         = require('express')
const app             = express()
const bodyParser      = require('body-parser')
const firebase_admin  = require('firebase-admin')
const firebase        = require('firebase')

const j_response            = require('./src/json_response.js')
const firebase_admin_config = require('./src/firebase_admin.js').load_config(firebase_admin)
const firebase_config       = require('./src/firebase.js').load_config()

firebase_admin.initializeApp(firebase_admin_config)
firebase.initializeApp(firebase_config)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/users/new', function(req, res) {
  const email = req.body.email
  const passwd = req.body.password
  var json_resp = null

  if (!email || !passwd)
    json_resp = j_response.format(400, "Bad request", null)
  else
    json_resp = j_response.format(200, "Successfully created", [email, passwd])

  res.status(json_resp.status).send(json_resp)
})

app.listen(3000)
