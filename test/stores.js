import { observable, action, toJS } from 'mobx'
import { Store } from '../src'
import { Model } from '../src'
import { Hub, Post, User } from './models'

export class HubsStore extends Store {
  static model = Hub
}

export class UsersStore extends Store {
  static model = User
}

export class PostsStore extends Store {
  static model = Post
}
