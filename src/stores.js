import { observable, toJS } from 'mobx'

import { Hub, Post, User } from './models'

export class AppStore {
  constructor() {
    this.stores = {
      hubs: new HubsStore(),
      users: new UsersStore(),
      posts: new PostsStore()
    }

    Object.keys(this.stores).forEach((key) => {
      this.stores[key].init(this.stores)
    })
  }

  toJS() {
    const obj = Object.keys(this.stores).reduce((acc, key) => {
      acc[key] = toJS(this.stores[key])
      return acc
    }, {})

    return obj
  }

  fromJS(json) {
    Object.keys(json).forEach((key) => {
      this.stores[key].fromJS(json[key])
    })

    Object.keys(json).forEach((key) => {
      this.stores[key].buildRefs()
    })
  }
}


class Store {
  init(stores) {
    this.getStores = () => stores
  }

  fromJS(data) {
    this.collection = data.collection.map((item) => new this.constructor.model(item, this))
  }

  buildRefs() {
    this.collection.forEach((item) => item.buildRefs())
  }
}

export class HubsStore extends Store {
  @observable collection = []

  static model = Hub
}

export class UsersStore extends Store {
  @observable collection = []

  static model = User
}

export class PostsStore extends Store {
  @observable collection = []

  static model = Post
}
