import { assert } from 'chai'
import { AppStore } from '../src'
import { HubsStore, UsersStore, PostsStore } from './stores'
import initialState from './initialState'

describe('AppStore', () => {
  const appStore = new AppStore({
    hubs: new HubsStore(),
    users: new UsersStore(),
    posts: new PostsStore()
  })

  it('should output JSON of the complete store', () => {
    appStore.fromJS(initialState)
    const json = appStore.toJS()

    assert.deepEqual(json, initialState)
  })

  it('should translate JSON back into Store', () => {
    appStore.fromJS(initialState)

    const hub = appStore.stores.hubs.collection[0]
    const user = appStore.stores.users.collection[0]
    const post = appStore.stores.posts.collection[0]

    assert.equal(hub, post.hub)
    assert.equal(user, post.user)
    assert.equal(hub.posts.length, 2)
    assert.equal(hub.user.name, "Corban")
    assert.equal(hub.posts[1].name, "Awesome time")
    assert.equal(hub.posts[1].contributions[0].user.name, "Peter")
  })
})
