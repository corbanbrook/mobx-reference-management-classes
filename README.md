# mobx-models

** experimental proof of concept **

Mobx promotes the use of referencial rather than normalized data, which allows for circular data structures. But server side rendering needs to represent your state as a JSON tree rather than a graph. Converting between a tree and graph becomes problematic. This project attempts to solve this by allowing models to specify their relationships to each other and automatically create the proper references when data is deserialized from JSON (from server side) and then allows to properly serialize the circular reference graph back into JSON.

#### Install

```
  npm install
```

#### Tests

```
  npm run test
```

#### AppState

AppState keeps a reference to all your Stores to allow all Store Models to reference each other and facilitates serializing and deserializing your entire state.

```
  const appState = new AppState({
    users: new UsersStore(),
    posts: new PostsStore(),
    comments: new CommentsStore()  
  })
```

##### Deserializing (hydrating) the state stores from JSON

Taking the following initialState object it will populate the stores and create all the circular references.

```
  const initalState = {
    users: {
      collection: [
        { id: 1, firstName: 'Corban', lastName: 'Brook', username: 'corban' }
      ]
    },

    posts: {
       collection: [
         { id: 2, title: 'Deep thoughts', body: 'blah blah blah...', user: { id: 1 } }
       ]
    },

    comments: {
      collection: [
        { id: 3, body: 'blah blah', user: { id: 1 }, post: { id: 2 } }
      ]
    }
  }

  appState.fromJS(initialState)

  appState.stores.users.collection[0].posts[0].title // 'Deep thoughts'
  appState.stores.users.collection[0].posts[0].comments[0].user.firstName // 'Corban'

  appState.stores.comments.collection[0].post.title // 'Deep thoughts'
  appState.stores.comments.collection[0].user.firstName // 'Corban'

```

##### Serializing state stores (graph) into JSON object (tree)

This will produce the exact same initialState object as above.

```
  const initialState = appState.toJS()
```

#### Stores

```
  import { observable } from 'mobx'
  import { Store } from 'mobx-models'

  class UsersStore extends Store {
    static model = User

    @observable collection = []
    @observable current = null

    ...   
  }
```

#### Models

```
  import { observable } from 'mobx'
  import { Model } from 'mobx-models'

  class User extends Model {
    static hasMany = {
      posts: null,
      comments: { key: 'id' }
    }

    @observable firstName = ""
    @observable lastName = ""
    @observable username = ""
    ...
  }

  class Post extends Model {
    static belongsTo = {
      user: null
    }
    static hasMany = {
      comments: null
    }

    @observable title = ""
    @observable body = ""
    ...
  }

  class Comment extends Model {
    static belongsTo = {
      user: null,
      post: null
    }
    static nested = {
      children: {}
    }

    @observable body = ""
    ...
  }
```
