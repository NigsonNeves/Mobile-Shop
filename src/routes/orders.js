const { Shop, User, Order, Product } = require('../models.js')

const j_response      = require('../json_response.js')

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
        .then(function(docs) {
          if (docs.length > 0) {
            new_order.set_ref(Math.random().toString(36).substr(2, 10))
            new_order.set_products(docs.map(docs => docs.id))
            new_order.set_price(docs.map(docs => docs.price).reduce(price_reducer))
            new_order.get_collection().doc().set(new_order.prepare())
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
          res.status(200).send(j_response.format(200, 'Success', docs))
        })
        .catch((err) => {
          res.status(500).send(j_response.generic(500))
        })
      } else {
        res.status(404).send(j_response.format(404, 'User not found', null))
      }
    })
    .catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })

  app.get('/orders/:order_id', function(req, res) {
    const order_id  = req.params.order_id
    var new_order   = new Order(null, order_id)
    var new_product = new Product(null, null)

    new_order.get_by('id', order_id).then((docs) => {
      if (docs != null) {
        new_order.set_id(docs[0].id)
        new_order.set_shop(docs[0].shop)
        new_order.set_price(docs[0].price)

        new_product.get_by_ids(docs[0].products).then((docs) => {
          new_order.set_products(docs)

          res.status(200).send(j_response.format(200, 'Success', new_order.prepare()))
        })
        .catch((err) => {
          res.status(500).send(j_response.generic(500))
        })
      } else {
        res.status(404).send(j_response.format(404, 'Order not found', null))
      }
    })
    .catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })

  app.get('/shops/:shop_id/orders', function(req, res) {
    const shop_id   = req.params.shop_id
    const new_shop  = new Shop(null, null)
    const new_order = new Order(null, null)

    if (!shop_id) res.status(400).send(j_response.generic(400))

    new_shop.get_by('id', shop_id).then((docs) => {
      if (docs != null) {
        new_order.get_by('shop', shop_id).then((docs) => {
          res.status(200).send(j_response.format(200, 'Success', docs))
        }).catch((err) => {
          res.status(500).send(j_response.generic(500))
        })
      } else {
        res.status(404).send(j_response.format(404, 'Shop not found', null))
      }
    }).catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })
}
