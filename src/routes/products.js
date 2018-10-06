const j_response      = require('../json_response.js')
const firebase_errors = require('../firebase_error.js')
const Product            = require('../models/Product.ts')

module.exports = function(app, firebase_admin) {
const collection = firebase_admin.firestore().collection(Product.collection_name)

  app.get('/shops/:id/products', function(req, res) {
    const order_by  = req.query.orderBy
    const order     = req.query.order || 'asc'
    const limit     = req.query.limit
    const id_params  = req.params.id
    var shop_id_params = Number(id_params)
    var query       = collection
    var datas       = {}

    if (order_by) query = query.orderBy(order_by, order)
    if (limit)    query = query.limit(parseInt(limit))

    query.where('shop_id', '==', shop_id_params).get().then(function(snapshot) {
        if(!snapshot.empty){
            snapshot.forEach((doc) => {datas[doc.id] = doc.data() })
            res.status(200).send(j_response.format(200, "Success", datas))
        }else{
            res.status(404).send(j_response.format(400, "Id: " + shop_id_params + " doesn't exist", null))
        }
    }).catch(function(err) {
        console.log("Error getting documents: ", error)
    })
  })

  app.post('/shops/{:id}/products', function(req, res) {
    const name      = req.body.name
    const pictures  = req.body.pictures
    const shop_id_params  = req.params.id
    const stock  = req.body.stock
    var new_product = new Product(name,shop_id_params)

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
