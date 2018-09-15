const bodyParser = require('body-parser')

module.exports = {
  config: function(app) {
    this.config_body_parser(app)
    this.config_access_control(app)

    app.listen(3000)
  },

  config_body_parser: function(app) {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
  },

  config_access_control: function(app) {
    app.all('/', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "X-Requested-With")
      next()
    })
  }
}
