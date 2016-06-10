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
    const obj = Object.keys(this.stores).reduce((acc, key) => {
      acc[key] = toJS(this.stores[key])
      return acc
    }, {})

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
