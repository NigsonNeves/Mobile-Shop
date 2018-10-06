const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Product         = require('../models/Product.ts')
// const Shop            = require('../models/Shop.ts')

module.exports = function(app) {
  app.get('/shops/:shop_id/products', function(req, res) {
    const order_by  = req.query.orderBy
    const order     = req.query.order || 'asc'
    const limit     = req.query.limit
    // const shop_id   = req.params.shop_id
    var new_product = new Product(null, null)
    var new_shop    = new Shop(null, null)
    var query       = new_product.get_collection()
    var datas       = []

    if (shop_id)  query = query.where('shop_id', '==', shop_id)
    if (order_by) query = query.orderBy(order_by, order)
    if (limit)    query = query.limit(parseInt(limit))

    query.get().then(function(snapshot) {
      if (!snapshot.empty) {
        snapshot.forEach((doc) => { datas.push(doc.data()) })
        res.status(200).send(j_response.format(200, 'Success', datas))
      } else {
        res.status(404).send(j_response.format(404, `Shop ${shop_id} not found`, null))
      }
    }).catch(function(err) {
      res.status(500).send(j_response.format(500, 'Error', null))
    })
  })

  app.post('/shops/:shop_id/products', function(req, res) {
    const name            = req.body.name
    const pictures        = req.body.pictures
    const shop_id         = req.params.shop_id
    const stock           = req.body.stock
    var new_product       = new Product(name,shop_id)

    if (!name || !pictures || !stock)
      res.status(400).send(j_response.generic(400))

    new_product.set_pictures(pictures)
    new_product.set_stock(stock)
    new_product.get_collection().doc().set(new_product.prepare())
    .then(function(doc) {
      res.status(200).send(j_response.format(200, 'Shop successfully created', new_shop.prepare()))
    }).catch(function(error) {
      res.status(400).send(j_response.generic(400))
    })
  })
}
