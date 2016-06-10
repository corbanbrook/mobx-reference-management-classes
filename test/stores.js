import { observable, action, toJS } from 'mobx'
import { Store } from '../src'
import { Model } from '../src'
import { Hub, Post, User } from './models'

export class HubsStore extends Store {
  static model = Hub

  @observable collection = []
  @observable current = null
}

export class UsersStore extends Store {
  static model = User

  @observable collection = []
  @observable current = null
}

export class PostsStore extends Store {
  static model = Post

  @observable collection = []
  @observable current = null
}
