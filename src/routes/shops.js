const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Shop            = require('../models/Shop.ts')
const ShopType        = require('../enums/ShopType.ts')

module.exports = function(app, firebase_admin) {
  const collection = firebase_admin.firestore().collection(Shop.collection_name)

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

  app.post('/shops', function(req, res) {
    const name      = req.body.name
    const type      = req.body.types
    const latitude  = req.body.latitude
    const longitude = req.body.longitude
    var new_shop    = new Shop(name, [ShopType[type]])

    if (!name || !type || !latitude || !longitude)
      res.status(400).send(j_response.generic(400))

    new_shop.set_position(latitude, longitude)
    new_shop.get_collection().doc().set(new_shop.prepare())

    .then(function(doc) {
      res.status(200).send(j_response.format(200, 'Shop successfully created', new_shop.prepare()))
    }).catch(function(error) {
      res.status(400).send(j_response.generic(400))
    })
  })
}
