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
    assert.equal(hub.user.fullName, "Corban Brook")
    assert.equal(hub.posts[1].name, "Awesome time")
    assert.equal(hub.posts[1].contributions[0].user.firstName, "Peter")
    assert.equal(user.posts[0].name, "The Art of Web Programming")
  })

  it('should add an item and maintain relationships', () => {
    appState.stores.hubs.add({ id: 621, type: 'hub', name: 'Fashion Week', user: { id: 789 } })
    const user = appState.stores.users.getById(789)

    assert.equal(appState.stores.hubs.last.user, user)
  })

  it('should asynchronously load multiple items and maintain relationships across all items', (done) => {
    appState.stores.posts.fetch({ id: 1111, name: 'Post Async', user: { id: 3333 }, hub: { id: 2222 }})
    appState.stores.hubs.fetch({ id: 2222, name: 'Hub Async', user: { id: 3333 }})
    appState.stores.users.fetch({ id: 3333, firstName: 'Kyle', lastName: 'Davis'})

    setTimeout(() => {
      const post = appState.stores.posts.last
      const hub = appState.stores.hubs.last
      const user = appState.stores.users.last

      // Belongs to
      assert.equal(post.hub, hub)
      assert.equal(post.user, user)
      assert.equal(hub.user, user)

      // Has many
      assert.equal(hub.posts[0], post)
      assert.equal(user.hubs[0], hub)
      assert.equal(user.posts[0], post)

      done()
    }, 400)
  })
})
