import { Model } from './Model'

export class Product extends Model {
  public static collection_name = 'products'
  private       name:     string
  private       pictures: Array<string>
  private       shop_id:  string
  private       stock:    number
  private       price:    number

  constructor(name: string, shop_id: string) {
    super()
    super.set_collection(Product.collection_name)

    this.name = name
    this.pictures = []
    this.shop_id = shop_id
    this.stock = 0
    this.price = null
  }

  static map(json_datas) {
    var new_product = new Product(json_datas['name'], json_datas['shop_id'])

    for (let prop in json_datas) {
      var method_name = `set_${prop}`

      if (typeof new_product[method_name] === 'function') {
        new_product[method_name](json_datas[prop]);
      }
    }

    return new_product
  }

  prepare() {
    return ({
      id:       super.get_id(),
      name:     this.name,
      pictures: this.pictures,
      shop_id:  this.shop_id,
      stock:    this.stock,
      price:    this.price
    })
  }

  get_name()      { return this.name }
  get_pictures()  { return this.pictures }
  get_shop_id()   { return this.shop_id }
  get_stock()     { return this.stock }
  get_price()     { return this.price }

  set_name(name: string)                { this.name = name }
  set_pictures(pictures: Array<string>) { this.pictures = pictures }
  set_shop_id(id: string)               { this.shop_id = id }
  set_stock(stock: number)              { this.stock = stock }
  set_price(price: number)              { this.price = price }

  add_picture(url: string)              { this.pictures.push(url) }
}

module.exports = Product;
