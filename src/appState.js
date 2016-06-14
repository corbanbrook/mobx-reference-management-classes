import { observable, toJS } from 'mobx'
import Model from './model'

export default class AppState {
  constructor(stores) {
    this.stores = stores

    Object.keys(this.stores).forEach((key) => {
      this.stores[key].init(this.stores)
    })
  }

  toJS() {
    const obj = toJS(this.stores)
    return JSON.parse(stringify(obj))
  }

  fromJS(json) {
    Object.keys(json).forEach((key) => {
      this.stores[key].fromJS(json[key])
    })

    Object.keys(json).forEach((key) => {
      this.stores[key].buildRefs()
    })
  }
}

const stringify = (obj) => {
  const seen = []

  return JSON.stringify(obj, function(key, val) {
    if (val && val.$refs && val.$refs.modelName) {
      const { belongsTo, hasMany, hasOne } = val.$refs

      let result = {...val}
      delete result.store
      delete result.isChild
      delete result.$refs

      if (belongsTo) {
        Object.keys(belongsTo).forEach((key) => {
          if (result[key]) {
            result[key] = {id: val[key].id}
          }
        })
      }

      if (hasMany) {
        Object.keys(hasMany).forEach((key) => {
          if (result[key]) {
            delete result[key]
          }
        })
      }

      if (hasOne) {
        Object.keys(hasOne).forEach((key) => {
          if (result[key]) {
            delete result[key]
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
