module.exports = {
  auth_errors: {
    "auth/email-already-in-use":  409,
    "auth/invalid-email":         400,
    "auth/operation-not-allowed": 501,
    "auth/weak-password":         400,
    "auth/user-disabled":         403,
    "auth/user-not-found":        404,
    "auth/wrong-password":        401
  },

  code: function(error_message) {
    var code = this.auth_errors[error_message]

    return (code)
  }
}
