import { Model } from './Model'

enum ShopType { bakery }

class Shop extends Model {
  private name:         string
  private picture_url:  string
  private position:     [number, number]
  private types:        Array<ShopType>

  constructor(name: string, types: Array<ShopType>) {
    super()

    this.name         = name
    this.picture_url  = null
    this.position     = null
    this.types        = types
  }

  static map(json_datas) {
    var new_shop = new Shop(json_datas['name'], json_datas['types'])

    for (let prop in json_datas) {
      var method_name = `set_${prop}`

      if (typeof new_shop[method_name] === 'function') {
        new_shop[method_name](json_datas[prop]);
      }
    }

    return new_shop
  }

  prepare() {
    return ({
      id:           super.get_id(),
      name:         this.name,
      picture_url:  this.picture_url,
      position:     this.position,
      types:        this.types
    })
  }

  get_name()        { return this.name }
  get_picture_url() { return this.picture_url }
  get_position()    { return this.position }
  get_types()       { return this.types }

  set_name(name: string)                    { this.name = name }
  set_picture_url(url: string)              { this.picture_url = url }
  set_position(position: [number, number])  { this.position = position }
  set_types(types: Array<ShopType>)         { this.types = types }
}

module.exports = Shop;
