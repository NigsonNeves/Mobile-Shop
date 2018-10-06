const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Product         = require('../models/Product.ts')
const Shop            = require('../models/Shop.ts')

module.exports = function(app) {
  app.get('/shops/:shop_id/products', function(req, res) {
    const order_by    = req.query.orderBy
    const order       = req.query.order || 'asc'
    const limit       = req.query.limit
    const shop_id     = req.params.shop_id
    const new_product = new Product(null, null)
    const new_shop    = new Shop(null, null)
    var query         = new_product.get_collection()
    var datas         = []

    if (!shop_id) res.status(400).send(j_response.generic(400))
    if (order_by) query = query.orderBy(order_by, order)
    if (limit)    query = query.limit(parseInt(limit))

    new_shop.get_by('id', shop_id).then((doc) => {
      if (doc == null)
        res.status(404).send(j_response.format(404, `Shop ${shop_id} not found`, null))

      query.where('shop_id', '==', shop_id).get().then(function(snapshot) {
        if (!snapshot.empty) {
          snapshot.forEach((doc) => { datas.push(doc.data()) })
          res.status(200).send(j_response.format(200, 'Success', datas))
        }
      }).catch(function(err) {
        res.status(500).send(j_response.generic(500))
      })
    })
    .catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })

  app.post('/shops/:shop_id/products', function(req, res) {
    const name      = req.body.name
    const pictures  = req.body.pictures
    const shop_id   = req.params.shop_id
    const stock     = req.body.stock
    const price     = req.body.price
    const new_shop  = new Shop(null, null)
    var new_product = new Product(name, shop_id)

    if (!name || !pictures || !stock || !price)
      res.status(400).send(j_response.generic(400))

    new_shop.get_by('id', shop_id).then((doc) => {
      if (doc == null) {
        res.status(404).send(j_response.format(404, 'Shop not found', null))
      } else {
        new_product.set_pictures([pictures])
        new_product.set_stock(stock)
        new_product.set_price(price)
        new_product.get_collection().doc().set(new_product.prepare())
        .then(function(doc) {
          res.status(200).send(j_response.format(200, 'Product successfully created', new_product.prepare()))
        }).catch(function(error) {
          res.status(500).send(j_response.generic(500))
        })
      }
    })
    .catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })
}
