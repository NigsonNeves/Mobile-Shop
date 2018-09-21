'use strict';

require('dotenv').config()

const express         = require('express')
const app             = express()
const firebase_admin  = require('firebase-admin')
const firebase        = require('firebase')

require('./src/server_config.js').config(app)
require('./src/firebase_admin.js').init(firebase_admin)
require('./src/firebase.js').init(firebase)

const j_response      = require('./src/json_response.js')
const firebase_errors = require('./src/firebase_error.js')

app.post('/users/new', function(req, res) {
  const email   = req.body.email
  const passwd  = req.body.password

  if (!email || !passwd) res.status(400).send(j_response.generic(400))

  firebase.auth().createUserWithEmailAndPassword(email, passwd)
  .then(function(user) {
    const content = j_response.format(200, "Successfully created", { email: email })

    res.status(content.status).send(content)
  })
  .catch(function(error) {
    const error_code  = firebase_errors.code(error.code)
    const body        = j_response.format(error_code, error.message, null)

    res.status(error_code).send(body)
  })
})

app.post('/login', function(req, res) {
  const email   = req.body.email
  const passwd  = req.body.password

  if (!email || !passwd) res.status(400).send(j_response.generic(400))

  firebase.auth().signInWithEmailAndPassword(email, passwd)
  .then(function(user) {
    const content = j_response.format(200, "Successfully logged in", { infos: user })

    res.status(content.status).send(content)
  })
  .catch(function(error) {
    const error_code  = firebase_errors.code(error.code)
    const body        = j_response.format(error_code, error.message, null)

    res.status(error_code).send(body)
  })
})
