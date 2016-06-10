# mobx-models

Mobx promotes the use of referencial rather than normalized data, which allows for circular data structures. But server side rendering needs to represent your state as a JSON tree rather than a graph. Converting between a tree and graph becomes problematic. This project attempts to solve this by allowing models to specify their relationships to each other and automatically create the proper references when data is deserialized from JSON (from server side) and then allows to properly serialize the circular reference graph back into JSON.

## AppState

```
  const appState = new AppState({
    users: new usersStore(),
    posts: new PostsStore(),
    comments: new CommentsStore()  
  })
```

### Serializing state stores (graph) into JSON object (tree)

```
  const initialState = appState.toJS()
```

### Deserializing (hydrating) the state stores from JSON

```
  appState.fromJS(initialState)
```

## Stores

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

## Models

```
  import { observable } from 'mobx'
  import { Model } from 'mobx-models'

  class User extends Model {
    static hasMany = ['posts', 'comments']

    @observable firstName = ""
    @observable lastName = ""
    @observable username = ""
    ...
  }

  class Post extends Model {
    static belongsTo = ['user']
    static hasMany = ['comments']

    @observable title = ""
    @observable body = ""
    ...
  }

  class Comment extends Model {
    static belongsTo = ['user', 'post']
    static nested = ['children']

    @observable body = ""
    ...
  }
```
