import { Model }    from './Model'
import { ShopType } from '../enums/ShopType'

class Shop extends Model {
  public static collection_name = 'shops'
  private       name:         string
  private       picture_url:  string
  private       latitude:     number
  private       longitude:    number
  private       types:        Array<ShopType>

  constructor(name: string, types: Array<ShopType>) {
    super()
    super.set_collection(Shop.collection_name)

    this.name         = name
    this.picture_url  = null
    this.latitude     = null
    this.longitude    = null
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
      latitude:     this.latitude,
      longitude:    this.longitude,
      types:        this.types
    })
  }

  get_name()        { return this.name }
  get_picture_url() { return this.picture_url }
  get_latitude()    { return this.latitude }
  get_longitude()   { return this.longitude }
  get_types()       { return this.types }

  set_name(name: string)                    { this.name = name }
  set_picture_url(url: string)              { this.picture_url = url }
  set_types(types: Array<ShopType>)         { this.types = types }
  set_position(latitude: number, longitude: number) {
    this.latitude  = latitude
    this.longitude = longitude
  }
}

module.exports = ShopType;
module.exports = Shop;
