var fs = require("fs"),
    path = require("path"),
    uri = path.join(__dirname, "observable.js")
    exec = require("child_process").exec

fs.watchFile(uri, function () {
    console.log("building")
    exec("make test-builder")
})