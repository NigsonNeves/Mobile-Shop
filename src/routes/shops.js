const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')

module.exports = function(app, firebase_admin) {
  const db          = firebase_admin.firestore()
  const collection  = db.collection('shops')

  app.get('/shops', function(req, res) {
    const order_by  = req.query.orderBy
    const order     = req.query.order || 'asc'
    const limit     = req.query.limit
    var query       = collection
    var datas       = {}

    if (order_by) query = query.orderBy(order_by, order)
    if (limit)    query = query.limit(parseInt(limit))

    query.get().then(function(snapshot) {
      snapshot.forEach((doc) => { datas[doc.id] = doc.data() })

      res.status(200).send(j_response.format(200, "Success", datas))
    })
    .catch(function(err) {
      res.status(400).send(j_response.format(400, err, null))
    })
  })
}
