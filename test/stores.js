import { observable, action, toJS } from 'mobx'
import { Store } from '../src'
import { Model } from '../src'
import { Hub, Post, User } from './models'

export class HubsStore extends Store {
  @observable collection = []
  @observable current = null

  static model = Hub
}

export class UsersStore extends Store {
  @observable collection = []
  @observable current = null

  static model = User
}

export class PostsStore extends Store {
  @observable collection = []
  @observable current = null

  static model = Post
}
