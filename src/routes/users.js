const { User } = require('../models.js')

const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')

module.exports = function(app, firebase, firebase_admin) {
  app.get('/users/:user_id', function(req, res) {
    const id_user   = req.params.user_id
    const new_user  = new User(null)

    if (!id_user) res.status(400).send(j_response.generic(400))

    new_user.get_by('id', id_user).then(function(docs) {
      if (docs != null) {
        delete docs.uid
        res.status(200).send(j_response.format(200, 'Success', docs))
      }else{
        res.status(404).send(j_response.format(404, `User ${id_user} not found`, null))
      }
    }).catch(function(err) {
      res.status(500).send(j_response.generic(500))
    })
  })

  app.post('/users/new', function(req, res) {
    const email       = req.body.email
    const passwd      = req.body.password
    const first_name  = req.body.first_name
    const name        = req.body.name

    if (!email || !passwd) res.status(400).send(j_response.generic(400))

    firebase.auth().createUserWithEmailAndPassword(email, passwd)
    .then(function(userData) {
      var new_user  = new User(userData.user.uid)

      new_user.set_email(email)
      new_user.set_first_name(first_name)
      new_user.set_name(name)
      new_user.get_collection().doc().set(new_user.prepare())

      res.status(200).send(j_response.format(200, "Successfully created", { email: email }))
    })
    .catch(function(error) {
      const error_code  = firebase_errors.code(error.code)
      const body        = j_response.format(error_code, error.message, null)

      res.status(error_code).send(body)
    })
  })

  app.patch('/users/:user_id', function(req, res) {
    const user_id     = req.params.user_id
    const first_name  = req.body.first_name
    const name        = req.body.name
    const picture_url = req.body.picture_url
    const email       = req.body.email
    const password    = req.body.password
    var new_user      = new User(null)
    var auth_data     = {}

    new_user.get_by('id', user_id).then((docs) => {
      if (!docs) {
        res.status(404).send(j_response.format(404, `User ${user_id} not found`, null))
      } else {
        const user_uid = docs[0].uid;
        new_user = User.map(docs[0])

        new_user.set_first_name(first_name)
        new_user.set_name(name)
        new_user.set_picture_url(picture_url)

        if (email) auth_data.email = email.toString().trim()
        if (password) auth_data.password = password.toString().trim()

        new_user.set_id(user_id)
        new_user.set_uid(user_uid)

        firebase_admin.auth().updateUser(user_uid,auth_data).then(function(user) {
          var datas = { auth: user.toJSON(), user: new_user.prepare() }
          new_user.get_collection().doc(docs[1]).update(new_user.prepare())

          res.status(200).send(j_response.format(200, 'User successfully updated', datas))
        }).catch(function(error) {
          res.status(422).send(j_response.format(422, "Error updating user", null))
        })
      }
    }).catch((err) => {
      console.log(err)
      res.status(500).send(j_response.generic(500))
    })
  })
}
