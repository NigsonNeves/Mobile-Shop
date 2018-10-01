const user_roles = require('../enums/user_roles.js').list

class User {
  constructor(uid) {
    this.uid = uid
    this.first_name = null
    this.name = null
    this.picture_url = null
    this.role = 'customer'
  }

  prepare() {
    return ({
      uid: this.uid,
      first_name: this.first_name,
      name: this.name,
      picture_url: this.picture_url,
      role: this.role
    })
  }

  get_uid()          { return this.uid }
  get_first_name()   {return this.first_name }
  get_name()         { return this.name }
  get_picture_url()  { return picture_url }
  get_role()         { return this.role }

  set_role(role)               { if (user_roles.includes(role)) this.role = role }
  set_first_name(first_name)   { this.first_name = first_name }
  set_name(name)               { this.name = name }
  set_picture_url(picture_url) { this.picture_url = picture_url }
}

module.exports = User;
