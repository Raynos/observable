var EventEmitter = require("eventemitter-light"),
    uuid = require("node-uuid"),
    observable = require("./observable").bind(null, synchronizeState),
    extend = require("pd").extend,
    remotes = {}

var Methods = {
    constructor: function (conn, auth) {
        this.conn = conn
        this.auth = auth
        return this
    },
    fetchState: auth(function (observ, callback) {
        callback()
    })
}

function synchronizeState(observable, callback) {
    callback && callback()
}

factory.middleware = function (remote, conn) {
    extend(this, Methods).constructor(conn, auth)

    console.log("lulwut")

    conn.on("end", function () {
        // cleanup
    })
}

factory.auth = function (auth) {
    factory._auth = auth
}

module.exports = factory

function factory(name) {
    var o = observable(name, factory._auth)
    fetchState(o)
    return o
}

function fetchState(observ) {
    console.log("getting dem state")
}

function auth(callback) {
    return function (options) {
        if (!this.auth) {
            return callback.apply(this, arguments)
        }
        var args = options.args,
            _arguments = arguments,
            self = this,
            cb = args[args.length - 1]

        if (typeof cb !== "function") {
            cb = function () {}
        }

        var ret = this.auth(options.auth, options, handleAuth)

        if (ret !== undefined) {
            handleAuth(ret)
        }

        function handleAuth(ret) {
            if (ret === false) {
                cb(new Error("Permission Denied"))
            } else if (ret === true) {
                callback.apply(self, _arguments)
            }    
        }
    }
}