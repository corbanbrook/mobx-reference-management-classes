export default class Model {
  static reference(opts) {
    this.hasManyOpts = opts
  }

  constructor(store, isChild) {
    this.store = store

    if (isChild) {
      this.isChild = isChild
    }

    const { hasMany, hasOne } = this.constructor

    if (hasMany) {
      Object.keys(hasMany).forEach((key) => {
        this[key] = []
      })
    }

    if (hasOne) {
      Object.keys(hasOne).forEach((key) => {
        this[key] = null
      })
    }
  }

  buildRefs() {
    const name = this.constructor.name.toLowerCase()
    const pluralizedName = `${name}s`

    const { belongsTo, hasMany, hasOne, nested } = this.constructor

    this.$refs = this.$refs || { modelName: this.constructor.name }

    if (belongsTo) this.$refs.belongsTo = JSON.parse(JSON.stringify(belongsTo))
    if (hasMany) this.$refs.hasMany = JSON.parse(JSON.stringify(hasMany))
    if (hasOne) this.$refs.hasOne = JSON.parse(JSON.stringify(hasOne))

    if (belongsTo) {
      Object.keys(belongsTo).forEach((key) => {
        if (this[key]) {
          const refStore = this.store.getStores()[`${key}s`]
          const refItem = refStore.getById(this[key].id)

          if (refItem) {
            this[key] = refItem

            if (!this.isChild) {
              const { hasMany, hasOne } = refItem.constructor

              if (hasMany && hasMany[pluralizedName]) {
                refItem[pluralizedName].push(this)
              }

              if (hasOne && hasOne[name] >= 0) {
                refItem[name] = this
              }
            }
          } else {
            this.store.waitForRef(key, this[key].id, this)
          }
        }
      })
    }

    // Connect from the other side
    if (hasMany) {
      Object.keys(hasMany).forEach((key) => {
        const stores = this.store.getStores()
        Object.keys(stores).forEach((storeKey) => {
          const refStore = stores[storeKey]
          const { belongsTo } = refStore.constructor.model
          if (belongsTo && belongsTo[name]) {
            refStore.connectRef(name, this)
          }
        })
      })
    }

    if (nested) {
      Object.keys(nested).forEach((key) => {
        if (this[key]) {
          this[key].forEach((nestedItem) => {
            nestedItem.buildRefs()
          })
        }
      })
    }
  }
}
