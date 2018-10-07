const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Shop            = require('../models/Shop.ts')
const User            = require('../models/User.ts')
const Order           = require('../models/Order.ts')
const Product         = require('../models/Product.ts')

module.exports = function(app, firebase) {
  app.post('/shops/:shop_id/orders', function(req, res) {
    const user_id       = req.body.user
    const shop_id       = req.params.shop_id
    const products      = req.body.products
    const price_reducer = (accumulator, currentValue) => accumulator + currentValue;

    if (!user_id || !shop_id || !products)
      res.status(400).send(j_response.generic(400))

    var new_shop    = new Shop(null, null)
    var new_order   = new Order(user_id, shop_id)
    var new_product = new Product(null, null)

    new_shop.get_by('id', shop_id).then((docs) => {
      if (docs == null) {
        res.status(404).send(j_response.format(404, 'Shop not found', null))
      } else {
        new_product.get_by_ids(JSON.parse(products))
        .then(function(docss) {
          if (docss.length > 0) {
            new_order.set_products(docss.map(docs => docs.id))
            new_order.set_price(docss.map(docs => docs.price).reduce(price_reducer))
            new_order.get_collection().docs().set(new_order.prepare())
            .then(function(result) {
              res.status(200).send(j_response.format(200, 'Order successfully created', new_order.prepare()))
            })
            .catch(function(err) {
              res.status(500).send(j_response.format(500, "Error: can't create order", null))
            })
          } else {
            res.status(404).send(j_response.format(404, "Error: some product not found", null))
          }
        })
        .catch(function(err) {
          res.status(500).send(j_response.generic(500))
        })
      }
    })
  })

  app.get('/users/:user_id/orders', function(req, res) {
    const user_id   = req.params.user_id
    const new_user  = new User(null)
    const new_order = new Order(null, null)

    new_user.get_by('id', user_id).then((docs) => {
      if (docs != null) {
        new_order.get_by('user', user_id).then((docs) => {
          console.log(docs)
          res.status(200).send(j_response.format(200, 'Success', docs))
        })
        .catch((err) => {
          console.log(err)
          res.status(500).send(j_response.generic(500))
        })
      } else {
        res.status(404).send(j_response.format(404, 'User not found', null))
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(j_response.generic(500))
    })
  })
}
