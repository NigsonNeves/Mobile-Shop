module.exports = {
  load_config: function(firebase_admin) {
    var admin_config = require('../firebase_credentials.json')

    return ({
      credential:   firebase_admin.credential.cert(admin_config),
      databaseURL:  process.env.FIREBASE_DATABASE_URL
    })
  }
}
