var connect = require("connect"),
    http = require("http"),
    browserify = require("browserify"),
    dnode = require("dnode"),
    path = require("path")

var app = connect(),
    server = http.createServer(app),
    d = dnode(),
    observable = require("observable"),
    Bag = observable("Bag"),
    bundle = browserify()

d.use(observable.middleware)
d.listen(server)

bundle.require("observable")

bundle.addEntry(path.join(__dirname, "client.js"))

app.use(connect.static(__dirname))

app.use(bundle)

Bag.set("foo", "bar", function () {
    server.listen(3000)
    console.log('http://localhost:3000/')
})