const TD = require('throttle-debounce')

const Globals = exports.Globals = {}

function factory (action) {
  return (cb, time) => action(time, cb)
}

exports.throttle = factory(TD.throttle)

exports.debounce = factory(TD.debounce)

exports.getMergedDefinition = function (def) {
  return Globals.Vue.util.mergeOptions({}, def)
}

exports.reapply = function (options, context) {
  while (typeof options === 'function') {
    options = options.call(context)
  }
  return options
}

exports.omit = function (obj, properties) {
  return Object.entries(obj)
    .filter(([key]) => !properties.includes(key))
    .reduce((c, [key, val]) => {
      c[key] = val
      return c
    }, {})
}

exports.addGqlError = function (error) {
  if (error.graphQLErrors && error.graphQLErrors.length) {
    error.gqlError = error.graphQLErrors[0]
  }
}

exports.deepFreeze = function deepFreeze (value) {
  const valid = (val) => (val) && typeof val === 'object'
  const work = new Set([value])

  work.forEach(obj => {
    if (!valid(obj)) {
      return
    }

    if (!Object.isFrozen(obj)) {
      try {
        Object.freeze(obj)
      } catch (e) {
        return
      }
    }

    Object.getOwnPropertyNames(obj).forEach(name => {
      if (valid(obj[name])) {
        work.add(obj[name])
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
exports.noop = () => {}
