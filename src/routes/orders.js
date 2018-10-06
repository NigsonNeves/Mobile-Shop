const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Order           = require('../models/Order.ts')
const Product         = require('../models/Product.ts')

module.exports = function(app, firebase) {
  app.post('/shops/:shop_id/orders', function(req, res) {
    const user_id       = req.body.user
    const shop_id       = req.body.shop
    const products      = req.body.products
    const price_reducer = (accumulator, currentValue) => accumulator + currentValue;

    if (!user_id || !shop_id || !products)
      res.status(400).send(j_response.generic(400))

    var new_order = new Order(user_id, shop_id)
    var new_product = new Product(null, null)

    new_product.get_by_ids(JSON.parse(products))
    .then(function(docs) {
      new_order.set_products(docs.map(doc => doc.id))
      new_order.set_price(docs.map(doc => doc.price).reduce(price_reducer))
      new_order.get_collection().doc().set(new_order.prepare())
      .then(function(result) {
        res.status(200).send(j_response.format(200, 'Order successfully created', new_order.prepare()))
      })
      .catch(function(err) {
        res.status(500).send(j_response.format(500, "Error: can't create order", null))
      })
    })
    .catch(function(err) {
      res.status(500).send(j_response.format(500, 'Error', null))
    })
  })
}
