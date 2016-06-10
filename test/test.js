import { assert } from 'chai'
import { Model } from '../src'
import { AppStore } from './stores'


const stringify = (obj) => {
  const seen = []

  return JSON.stringify(obj, function(key, val) {
    if (val instanceof Model) {
      const { belongsTo, hasMany, hasOne } = val.constructor

      let result = {...val}
      delete result.store
      delete result.isChild

      if (belongsTo) {
        belongsTo.forEach((ref) => {
          if (result[ref]) {
            result[ref] = {id: val[ref].id}
          }
        })
      }

      if (hasMany) {
        hasMany.forEach((ref) => {
          if (result[ref]) {
            delete result[ref]
          }
        })
      }

      if (hasOne) {
        hasOne.forEach((ref) => {
          if (val[ref]) {
            val[ref] = undefined
          }
        })
      }

      return result
    }

    if (val != null && typeof val == "object") {
      if (seen.indexOf(val) >= 0) {
        throw new Error(key + " is circular")
      }
      seen.push(val)
    }

    return val
  })
}

describe('AppStore', () => {
  const appStore = new AppStore()

  const hubMock = {type: 'hub', id: 123, name: 'My First Hub'}
  const postMock = {type: 'post', id: 456, name: 'The Art of Web Programming', hub: {id: 123}, user: {id: 789}}
  const userMock = {type: 'user', id: 789, name: 'Corban'}

  const initialState = {
    "hubs": {
      "collection": [
        {
          "type": "hub",
          "id": 123,
          "name": "My First Hub",
          "user": {
            "id": 789
          }
        }
      ]
    },
    "users": {
      "collection": [
        {
          "type": "user",
          "id": 789,
          "name": "Corban"
        },
        {
          "type": "user",
          "id": 72,
          "name": "Peter"
        }
      ]
    },
    "posts": {
      "collection": [
        {
          "type": "post",
          "id": 456,
          "name": "The Art of Web Programming",
          "hub": {
            "id": 123
          },
          "user": {
            "id": 789
          },
          "children": [
            {
              "type": "video",
              "id": 987,
              "name": "Best of Youtube 2016",
              "hub": {
                "id": 123
              },
              "user": {
                "id": 789
              }
            }
          ],
          "contributions": []
        },
        {
          "type": "post",
          "id": 999,
          "name": "Awesome time",
          "hub": {
            "id": 123
          },
          "user": {
            "id": 789
          },
          "children": [],
          "contributions": [
            {
              "type": "contribution",
              "id": 929,
              "user": {
                "id": 72
              },
              "body": "FUCK YEAH"
            }
          ]
        }
      ]
    }
  }

  it('should output JSON of the complete store', () => {
    appStore.fromJS(initialState)

    const json = stringify(appStore.toJS())

    const obj = JSON.parse(json)

    assert.deepEqual(obj, initialState)
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
