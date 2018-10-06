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
}
