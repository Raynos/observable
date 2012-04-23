var observable = require("observable"),
    uuid = require("node-uuid"),
    assert = require("assert")

suite("Observable", function () {
    var dummy = { foo: "bar" },
        Bag

    setup(function () {
        Bag = observable(uuid())
    })

    test("set", function (done) {
        Bag.on("observe", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value, "bar")
            assert.equal(observable, null)
            done()
        })
        Bag.set("foo", "bar")
    })

    test("get", function () {
        Bag.set("foo", "bar")
        assert.equal(Bag.get("foo"), "bar")
    })

    test("remove", function (done) {
        Bag.on("observe", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value, undefined)
            assert.equal(observable, null)
            done()
        })
        Bag.remove("foo")
    })

    test("increment", function () {
        Bag.set("0", "foo")
        Bag.increment("0", "bar")
        assert.equal(Bag.get("0"), "foobar")
    })

    test("push", function (done) {
        Bag.on("observe", function (key, value, observable) {
            assert(key)
            assert.equal(value, "foo")
            assert.equal(observable, null)
            done()
        })
        Bag.push("foo")
    })

    test("push array", function (done) {
        var r = []
        Bag.on("observe", function (key, value) {
            r.push(value)
        })
        Bag.push("foo", "bar")
        assert.equal(r[0], "foo")
        assert.equal(r[1], "bar")
        Bag.push("foo", "bar", function () {
            done()
        })
    })

    test("nested observables", function (done) {
        Bag.on("observe", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value.foo, "bar")
            observable.on("observe", function (key, value) {
                assert.equal(key, "foo")
                assert.equal(value, "bar")
                done()
            })
            observable.set("foo", "bar")
        })
        Bag.set("foo", dummy)
    })

    test("callbacks", function (done) {
        var flag = true
        Bag.on("observe", function (key, value, observable) {
            flag = false
        })

        Bag.set("foo", "bar", function () {
            assert.equal(flag, false)
            done()
        })
    })

    test("toJSON", function () {
        Bag.set("foo", "bar")
        assert.equal(JSON.parse(JSON.stringify(Bag)).foo, "bar")
    })

    test("key name event", function (done) {
        Bag.on(":foo", function (bar) {
            assert.equal(bar, "bar")
            done()
        })
        Bag.set("foo", "bar")
    })

    test("change event", function (done) {
        var count = 2
        Bag.on("change:foo", function (data) {
            assert.equal(data.value, "bar")
            assert.equal(data.oldValue, undefined)
            assert.equal(data.observable, null)
            --count === 0 && done()
        })
        Bag.on("change", function (key, data) {
            assert.equal(key, "foo")
            assert.equal(data.value, "bar")
            assert.equal(data.oldValue, undefined)
            assert.equal(data.observable, null)
            --count === 0 && done()
        })
        Bag.set("foo", "bar")
    })

    test("observe event", function (done) {
        var count = 2
        Bag.on("observe:foo", function (data, observ) {
            assert.equal(data.foo, "bar")
            assert(observ)
            --count === 0 && done()
        })
        Bag.on("observe", function (key, value, observ) {
            assert.equal(key, "foo")
            assert.equal(value.foo, "bar")
            assert(observ)
            --count === 0 && done()
        })
        Bag.set("foo", { "foo": "bar" })  
    })

    test("mutate event", function (done) {
        var count = 2
        Bag.set("foo", "old")
        Bag.on("mutate:foo", function (data, old) {
            assert.equal(data, "bar")
            assert.equal(old, "old")
            --count === 0 && done()
        })
        Bag.on("mutate", function (key, value, old) {
            assert.equal(key, "foo")
            assert.equal(value, "bar")
            assert.equal(old, "old")
            --count === 0 && done()
        })
        Bag.set("foo", "bar")
    })

    test("update", function (done) {
        var count = 2
        Bag.set("foo", "old")
        Bag.on("update:foo", function (data) {
            assert.equal(data, "bar")
            --count === 0 && done()
        })
        Bag.on("update", function (key, value) {
            assert.equal(key, "foo")
            assert.equal(value, "bar")
            --count === 0 && done()
        })
        Bag.set("foo", "bar")  
    })

    test("create", function (done) {
        var count = 2
        Bag.on("create:foo", function (data) {
            assert.equal(data, "bar")
            --count === 0 && done()
        })
        Bag.on("create", function (key, value) {
            assert.equal(key, "foo")
            assert.equal(value, "bar")
            --count === 0 && done()
        })
        Bag.set("foo", "bar")    
    })
})