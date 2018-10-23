const firebase_admin  = require('firebase-admin')

export class Model {
  private id: string
  private collection: any

  constructor() {
    this.id = Math.random().toString(36).substr(2, 10)
    this.collection = null
  }

  get_id() { return this.id }
  get_collection() { return this.collection }

  set_id(id: string) { this.id = id }
  set_collection(collection: string) { this.collection = firebase_admin.firestore().collection(collection) }

  get_by(field: string, value: string) {
    const collection = this.get_collection()

    return new Promise((resolve, reject) => {
      var found_objects = []
 
      collection.where(field, '==', value).get()
      .then((snapshot) => {
        if (snapshot.empty) resolve(null)

        snapshot.forEach(function(doc) {
          doc.data() ? found_objects.push(doc.data(),doc.id) : null
        })

        resolve(found_objects)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  get_by_ids(searched_ids: Array<string>) {
    var instance = this

    return new Promise(async function(resolve, reject) {
      var found_products = []

      for (let searched_id of searched_ids) {
        await instance.get_by('id', searched_id)
        .then((doc) => {
          if (doc != null) found_products.push(doc[0])
        })
        .catch((err) => {
          reject(err)
        })
      }

      resolve(found_products)
    })
  }
}
