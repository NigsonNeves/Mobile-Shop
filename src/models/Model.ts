export class Model {
  private id: string

  constructor() {
    this.id = Math.random().toString(36).substr(2, 10)
  }

  get_id() { return this.id }

  set_id(id: string) { this.id = id }
}
