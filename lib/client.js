var uuid = require("node-uuid"),
    observable = require("./observable").bind(null, synchronizeState),
    extend = require("pd").extend,
    cached,
    callbackList = []

var Methods = {
    constructor: function (conn) {
        this.conn = conn
        return this
    }
}

main.middleware = function (remote, conn) {
    extend(this, Methods).constructor(conn)
    cached = remote
    callbackList.forEach(function (cb) {
        cb(remote)
    })  
}

main.auth = function (auth) {
    this._auth = auth
}

module.exports = main

function main(name) {
    var o = observable(name)
    getRemote(function (remote) {
        console.log("getting dem remote")
        /*remote.fetchState(o, function () {
            console.log("wut")
        })*/
    })
    return o
}

function synchronizeState(observable, callback) {
    callback && callback()
}

function getRemote(cb) {
    if (cached) {
        cb(cached)
    } else {
        callbackList.push(cb)
    }
}