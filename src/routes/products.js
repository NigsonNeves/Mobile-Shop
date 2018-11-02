const { Shop, Product } = require('../models.js')
const fs                = require('fs')
const j_response        = require('../json_response.js')

module.exports = function(app, firebase_admin) {
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

  app.post('/products/:product_id/pictures', function(req, res) {
    var product_id  = req.params.product_id
    var img         = req.body.base64
    var extension   = req.body.ext
    var bucket      = firebase_admin.storage().bucket();
    var name        = `${Math.random().toString(36).substr(2, 20)}.${extension}`
    var path        = `products/${name}`
    var new_product = new Product(null, null)

    if (!product_id)  res.status(400).send(j_response.generic(400))
    if (!img)         res.status(400).send(j_response.generic(400))
    if (!extension)   res.status(400).send(j_response.generic(400))

    new_product.get_by('id', product_id).then((doc) => {
      var product = Product.map(doc[0])
      var file = bucket.file(path);

      fs.writeFile(`tmp/${name}`, img, { encoding: 'base64' }, function(err) {
        if (err) {
          res.status(500).send(j_response.generic(500))
        } else {
          bucket.upload(`tmp/${name}`, { destination: path }).then((snapshot) => {
            product.add_picture(path)

            new_product.get_collection().doc(doc[0].doc_id).set(product.prepare()).then((result) => {
              res.status(200).send(j_response.format(200, 'Picture successfully added to product', product.prepare()))
            }).catch((err) => {
              res.status(422).send(j_response.format(422, "Can't update product", null))
            })
          }).catch((err) => {
            res.status(422).send(j_response.format(422, "Can't upload picture", null))
          })
        }
      });
    }).catch((err) => {
        res.status(404).send(j_response.format(404, 'Product not found', null))
    })
  })

  app.patch('/products/:product_id', function(req, res) {
    var product_id  = req.params.product_id
    var name        = req.body.name
    var price       = req.body.price
    var stock       = req.body.stock
    var new_product = new Product(null, null)

    if (!product_id) res.status(400).send(j_response.generic(400))

    new_product.get_by('id', product_id).then((doc) => {
      new_product = Product.map(doc[0])

      if(stock)new_product.set_stock(stock)
      if(price)new_product.set_price(price)
      if(name)new_product.set_name(name)

      new_product.set_id(product_id)
      new_product.set_shop_id(doc[0].shop_id)
      new_product.get_collection().doc(doc[1]).update(new_product.prepare()).then(function(doc) {
        res.status(200).send(j_response.format(200, 'Product successfully updated', new_product.prepare()))
      }).catch(function(error) {
        res.status(500).send(j_response.generic(500))
      })
    }).catch((err) => {
      console.log(err)
        res.status(404).send(j_response.format(404, 'Product '+product_id+' not found', null))
    })
  })
}
