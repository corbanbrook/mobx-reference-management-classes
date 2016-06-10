import { observable, computed } from 'mobx'
import { Model } from '../src'

export class Hub extends Model {
  static belongsTo = {
    user: {}
  }
  static hasMany = {
    posts: {}
  }

  constructor(data, store) {
    super(store)

    Object.assign(this, data)
  }
}

export class User extends Model {
  static hasMany = {
    posts: {},
    hubs: {}
  }

  @observable firstName = ""
  @observable lastName = ""
  @computed get fullName() { return `${this.firstName} ${this.lastName}` }

  constructor(data, store) {
    super(store)

    Object.assign(this, data)
  }
}

export class Post extends Model {
  static belongsTo = {
    hub: {},
    user: {}
  }
  static nested = {
    children: {},
    contributions: {}
  }

  constructor(data, store, isChild) {
    super(store, isChild)

    Object.assign(this, data)

    if (this.children) {
      this.children = this.children.map((child) => new Post(child, store, true))
    }

    if (this.contributions) {
      this.contributions = this.contributions.map((child) => new Post(child, store, true))
    }
  }
}
