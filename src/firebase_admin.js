module.exports = {
  credentials_path: '../firebase_credentials.json',

  init: function(firebase_admin) {
    const config = this.load_config(firebase_admin)

    firebase_admin.initializeApp(config)
  },

  load_config: function(firebase_admin) {
    const admin_config = require(this.credentials_path)

    return ({
      credential:     firebase_admin.credential.cert(admin_config),
      databaseURL:    process.env.FIREBASE_DATABASE_URL,
      storageBucket:  process.env.FIREBASE_STORAGE_BUCKET
    })
  }
}
