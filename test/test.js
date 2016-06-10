import { assert } from 'chai'
import { AppState } from '../src'
import { HubsStore, UsersStore, PostsStore } from './stores'
import initialState from './initialState'

describe('AppStore', () => {
  const appState = new AppState({
    hubs: new HubsStore(),
    users: new UsersStore(),
    posts: new PostsStore()
  })

  it('should output JSON of the complete store', () => {
    appState.fromJS(initialState)
    const json = appState.toJS()

    assert.deepEqual(json, initialState)
  })

  it('should translate JSON back into Store', () => {
    appState.fromJS(initialState)

    const hub = appState.stores.hubs.collection[0]
    const user = appState.stores.users.collection[0]
    const post = appState.stores.posts.collection[0]

    assert.equal(hub, post.hub)
    assert.equal(user, post.user)
    assert.equal(hub.posts.length, 2)
    assert.equal(hub.user.name, "Corban")
    assert.equal(hub.posts[1].name, "Awesome time")
    assert.equal(hub.posts[1].contributions[0].user.name, "Peter")
    assert.equal(user.posts[0].name, "The Art of Web Programming")
  })
})
