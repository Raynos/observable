var EventEmitter = require("eventemitter-light"),
    extend = require("pd").extend,
    slice = Array.prototype.slice,
    uuid = require("node-uuid")

var Observable = extend({}, EventEmitter, {
    constructor: function (name, state, synchronizer) {
        EventEmitter.constructor.call(this)
        this._state = state || {}
        this.synchronizer = synchronizer
        this._id = name || uuid()
        return this
    },
    push: function () {
        var args = slice.call(arguments),
            count = args.length,
            cb

        if (typeof args[count - 1] === "function") {
            cb = args.pop()
            count--
        }

        args.forEach(setItem, this)
        return this

        function next() {
            if (--count === 0) {
                cb && cb.apply(this, arguments)
            }
        }

        function setItem(value) {
            this.set(uuid(), value, next)
        }
    },
    set: function (key, value, callback) {
        var exists = key in this._state,
            specificEvent = exists ? "update" : "create",
            oldValue = this._state[key]

        this._state[key] = value
        var observ
        if (typeof value === "object") {
            observ = observable(this.synchronizer, uuid(), value)
            value = extend({}, value)
        } else {
            observ = null
        }

        this.emit(":" + key, value)
        emit(this, "change", [key, {
            value: value,
            oldValue: oldValue,
            observable: observ
        }])
        emit(this, "observe", [key, value, observ])
        emit(this, "mutate", [key, value, oldValue])
        emit(this, specificEvent, [key, value])

        this.synchronizer && this.synchronizer(this, callback)
        return this
    },
    increment: function (key, incrementee) {
        var value = this._state[key]
        return this.set(key, value += incrementee)
    },
    get: function (key) {
        return this._state[key]
    },
    remove: function (key, callback) {
        return this.set(key, undefined, callback)
    },
    toJSON: function () {
        return extend({}, this._state)
    }
})

module.exports = observable

function observable(synchronizer, name, state) {
    return extend({}, Observable).constructor(name, state, synchronizer)
}

function emit(ee, name, params) {
    ee.emit.apply(ee, [name].concat(params))
    var key = name + ":" + params.shift()
    ee.emit.apply(ee, [key].concat(params))
}