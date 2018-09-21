const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')

module.exports = function(app, firebase) {
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
}
