import { Model } from './Model'

enum UserRole { merchant, customer }

class User extends Model {
  public static collection_name = 'users'
  private       uid:          string
  private       first_name:   string
  private       name:         string
  private       picture_url:  string
  private       email:        string
  private       role:         UserRole

  constructor(uid: string) {
    super()
    super.set_collection(User.collection_name)

    this.uid          = uid
    this.first_name   = null
    this.name         = null
    this.picture_url  = null
    this.email        = null
    this.role         = UserRole.customer
  }

  static map(json_datas) {
    var new_user = new User(json_datas['uid'])

    for (let prop in json_datas) {
      var method_name = `set_${prop}`

      if (typeof new_user[method_name] === 'function') {
        new_user[method_name](json_datas[prop]);
      }
    }

    return new_user
  }

  prepare() {
    return ({
      id:           super.get_id(),
      uid:          this.uid,
      first_name:   this.first_name,
      name:         this.name,
      picture_url:  this.picture_url,
      email:        this.email,
      role:         this.role
    })
  }

  get_uid()          { return this.uid }
  get_first_name()   { return this.first_name }
  get_name()         { return this.name }
  get_picture_url()  { return this.picture_url }
  get_email()        { return this.email }
  get_role()         { return this.role }

  set_uid(uid: string)         { this.uid = uid }
  set_role(role: UserRole)     { this.role = role }
  set_first_name(first_name)   { this.first_name = first_name }
  set_name(name)               { this.name = name }
  set_picture_url(picture_url) { this.picture_url = picture_url }
  set_email(email)             { this.email = email }
}

module.exports = User;
