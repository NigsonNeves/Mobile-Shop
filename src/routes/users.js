const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const User            = require('../models/User.ts')

module.exports = function(app, firebase) {
  app.get('/users/:user_id', function(req, res) {
    const order_by  = req.query.orderBy
    const order     = req.query.order || 'asc'
    const limit     = req.query.limit
    const id_user   = req.params.user_id
    const new_user  = new User(null)
    var query       = new_user.get_collection()
    var datas       = []

    if (!id_user) res.status(400).send(j_response.generic(400))
    if (order_by) query = query.orderBy(order_by, order)
    if (limit)    query = query.limit(parseInt(limit))

    query.where('uid', '==', id_user).get().then(function(snapshot) {
      if (!snapshot.empty) {
        snapshot.forEach((doc) => { datas.push(doc.data()) })
        res.status(200).send(j_response.format(200, 'Success', datas))
      }else{
        res.status(404).send(j_response.format(404, `User ${id_user} not found`, null))
      }
    }).catch(function(err) {
      res.status(500).send(j_response.generic(500))
      console.log(err)
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
      const content   = j_response.format(200, "Successfully created", { email: email })
      const new_user  = new User(userData.user.uid)

      if (first_name) new_user.set_first_name(first_name)
      if (name) new_user.set_name(name)

      new_user.get_collection().doc().set(new_user.prepare())

      res.status(content.status).send(content)
    })
    .catch(function(error) {
      const error_code  = firebase_errors.code(error.code)
      const body        = j_response.format(error_code, error.message, null)

      res.status(error_code).send(body)
    })
  })
}
