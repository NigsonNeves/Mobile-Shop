const { Shop }      = require('../models.js')
const { ShopType }  = require('../enums.js')
const fs            = require('fs')
const j_response    = require('../json_response.js')

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

  app.post('/shops/:shop_id/pictures', function(req, res) {
    var shop_id     = req.params.shop_id
    var extension   = req.body.ext
    var img         = req.body.base64
    var bucket      = firebase_admin.storage().bucket();
    var name        = `${Math.random().toString(36).substr(2, 20)}.${extension}`
    var path        = `shops/${name}`
    var new_shop    = new Shop(null, null)

    if (!shop_id)     res.status(400).send(j_response.generic(400))
    if (!img)         res.status(400).send(j_response.generic(400))
    if (!extension)   res.status(400).send(j_response.generic(400))

    new_shop.get_by('id', shop_id).then((doc) => {
      var shop = Shop.map(doc[0])
      var file = bucket.file(path);

      fs.writeFile(`tmp/${name}`, img, { encoding: 'base64' }, function(err) {
        if (err) {
          res.status(500).send(j_response.generic(500))
        } else {
          bucket.upload(`tmp/${name}`, { destination: path }).then((snapshot) => {
            shop.add_picture(path)

            new_shop.get_collection().doc(doc[0].doc_id).set(shop.prepare()).then((result) => {
              res.status(200).send(j_response.format(200, 'Picture successfully added to shop', shop.prepare()))
            }).catch((err) => {
              res.status(422).send(j_response.format(422, "Can't update shop", null))
            })
          }).catch((err) => {
            res.status(422).send(j_response.format(422, "Can't upload picture", null))
          })
        }
      })
    }).catch((err) => {
        res.status(404).send(j_response.format(404, 'Shop not found', null))
    })
  })
}
