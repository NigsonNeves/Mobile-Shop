module.exports = {
  generic_responses: {
    200: { status: 200, message: "Success", data: null },
    400: { status: 400, message: "Bad request", data: null },
    500: { status: 500, message: "Error: maybe with firebase", data: null }
  },

  generic: function(code) {
    return (this.generic_responses[code])
  },

  format: function(status, message, data) {
    return ({
      status: status,
      message: message,
      data: data
    })
  }
}
