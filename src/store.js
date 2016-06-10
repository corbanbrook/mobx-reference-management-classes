import { toJS } from 'mobx'

export default class Store {
  init(stores) {
    this.getStores = () => stores
  }

  toJS() {
    return toJS(this)
  }

  fromJS(data) {
    this.collection = data.collection.map((item) => new this.constructor.model(item, this))
  }

  buildRefs() {
    this.collection.forEach((item) => item.buildRefs())
  }
}
