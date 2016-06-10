export class Model {
  constructor(store, isChild) {
    this.store = store

    if (isChild) {
      this.isChild = isChild
    }
    
    const { hasMany, hasOne } = this.constructor

    if (hasMany) {
      hasMany.forEach((name) => {
        this[name] = []
      })
    }

    if (hasOne) {
      hasOne.forEach((name) => {
        this[name] = null
      })
    }
  }

  buildRefs() {
    const name = this.constructor.name.toLowerCase()
    const pluralizedName = `${name}s`

    const { belongsTo, nested } = this.constructor

    if (belongsTo) {
      // Clear refs collections
      belongsTo.forEach((ref) => {
        //console.log("Attempting ref for", this.constructor.name, this.id, ref)
        if (this[ref]) {
          //console.log(this[ref])
          this[ref] = this.store.getStores()[`${ref}s`].collection.find((refItem) => refItem.id == this[ref].id)

          if (this[ref] && !this.isChild) {
            const { hasMany, hasOne } = this[ref].constructor

            if (hasMany && hasMany.indexOf(pluralizedName) >= 0) {
              this[ref][pluralizedName].push(this)
            }

            if (hasOne && hasOne.indexOf(pluralizedName) >= 0) {
              this[ref][name] = this
            }
          }
        }
      })

      if (nested) {
        nested.forEach((children) => {
          if (this[children]) {
            this[children].forEach((child) => {
              child.buildRefs()
            })
          }
        })
      }
    }
  }
}

export class Hub extends Model {
  static belongsTo = ['user']
  static hasMany = ['posts']

  constructor(data, store) {
    super(store)

    Object.assign(this, data)
  }
}

export class User extends Model {
  static hasMany = ['posts', 'hubs']

  constructor(data, store) {
    super(store)

    Object.assign(this, data)
  }
}

export class Post extends Model {
  static belongsTo = ['hub', 'user']
  static nested = ['children', 'contributions']

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
