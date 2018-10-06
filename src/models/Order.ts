import { Model } from './Model'
import { Product } from './Product'

export class Order extends Model {
  public static collection_name = 'orders'
  private       user:     string
  private       shop:     string
  private       products: Array<string>
  private       price:    number

  constructor(user_id: string, shop_id: string) {
    super()
    super.set_collection(Order.collection_name)

    this.user     = user_id
    this.shop     = shop_id
    this.products = []
    this.price    = 0
  }

  static map(json_datas) {
    var new_order = new Order(json_datas['user'], json_datas['shop'])

    for (let prop in json_datas) {
      var method_name = `set_${prop}`

      if (typeof new_order[method_name] === 'function') {
        new_order[method_name](json_datas[prop]);
      }
    }

    return new_order
  }

  prepare() {
    return ({
      id:       super.get_id(),
      user:     this.user,
      shop:     this.shop,
      products: this.products,
      price:    this.price
    })
  }

  get_user()      { return this.user }
  get_shop()      { return this.shop }
  get_products()  { return this.products }
  get_price()     { return this.price }

  set_user(user: string)                  { this.user =  user }
  set_shop(shop: string)                  { this.shop =  shop }
  set_products(products: Array<string>)   { this.products = products }
  set_price(price: number)                { this.price = price }

  add_product(product: string) { this.products.push(product) }
}

module.exports = Order;
