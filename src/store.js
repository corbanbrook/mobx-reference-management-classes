import { toJS, action, computed, observable } from 'mobx'

export default class Store {
  @observable collection = []
  @observable current = null

  @computed get first() {
    return this.collection[0]
  }

  @computed get last() {
    return this.collection[this.collection.length - 1]
  }

  constructor() {
    let waitingRefs = []

    this.waitForRef = (key, id, item) => {
      waitingRefs.push({key, id, item})
    }

    this.connectRef = (key, value) => {
      let connected = []
      waitingRefs.forEach((wait, idx) => {
        if (wait.key == key && wait.id == value.id) {
          wait.item.buildRefs()
          connected.push(idx)
        }
      })
      connected.forEach((idx) => {
        waitingRefs.splice(idx, 1)
      })
    }
  }

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

  getById(id) {
    return this.collection.find((item) => item.id === id)
  }

  @action fetchAll(items = []) {
    setTimeout(() => {
      this.collection = items.map((item) => new this.constructor.model(item, this))
      this.buildRefs()
    }, 200)
  }

  @action fetch(item = {}) {
    setTimeout(() => {
      this.add(item)
    }, 200)
  }

  @action add(item) {
    this.collection.push(new this.constructor.model(item, this))
    this.last.buildRefs()
  }
}
