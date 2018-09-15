module.exports = {
  format: function(status, message, data) {
    return ({
      status: status,
      message: message,
      data: data
    })
  }
}
