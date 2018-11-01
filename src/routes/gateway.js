const j_response      = require('../json_response.js')

module.exports = function(app, firebase_admin) {
  app.get('/pictures', function(req, res) {
    const path_url      = req.query.path
    const bucket        = firebase_admin.storage().bucket()
    const file          = bucket.file(path_url)
    const download_opts = { action: 'read', expires: '03-09-2491' }

    if (!file) res.status(404).send(j_response.generic(404))

    file.getSignedUrl(download_opts).then((urls) => {
      res.status(200).send(j_response.format(200, 'Success', [ urls[0] ]))
    }).catch((err) => {
      res.status(500).send(j_response.generic(500))
    })
  })
}
