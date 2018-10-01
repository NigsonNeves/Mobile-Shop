const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const User = require('../models/User.js')

module.exports = function(app, firebase, firebase_admin) {
  app.post('/users/new', function(req, res) {
    const email       = req.body.email
    const passwd      = req.body.password
    const first_name  = req.body.first_name
    const name        = req.body.name

    if (!email || !passwd) res.status(400).send(j_response.generic(400))

    firebase.auth().createUserWithEmailAndPassword(email, passwd)
    .then(function(userData) {
      const content   = j_response.format(200, "Successfully created", { email: email })
      const new_user  = new User(userData.user.uid)

      if (first_name) new_user.set_first_name(first_name)
      if (name) new_user.set_name(name)

      firebase_admin.firestore().collection('users').doc().set(new_user.prepare());
      res.status(content.status).send(content)
    })
    .catch(function(error) {
      const error_code  = firebase_errors.code(error.code)
      const body        = j_response.format(error_code, error.message, null)

      res.status(error_code).send(body)
    })
  })
}
