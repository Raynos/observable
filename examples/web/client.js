var observable = require('observable'),
    Bag = observable("Bag"),
    container = document.getElementById("__container"),
    dnode = require("dnode")

var d = dnode()
d.use(observable.middleware)
d.connect()

Bag.on("change", function (key, value) {
    var el = document.getElementById(key)
    if (el === null) {
        el = document.createElement("div")
        el.id = key
        container.appendChild(el)
    }
    el.textContent = value
})

Bag.set("onclient", "content")

window.Bag = Bag