var assert = require('assert')
var aqueue = require('../src/aqueue')

var errHandler = function() {
  var args = [].slice.call(arguments)
  var err = args.shift()

  assert.equal(err, 'error')
  assert.deepEqual(args, ['Test', 'finished.'])
  console.log(args.join(" "))
}

var queue = aqueue(errHandler)

var a = function(a, next) {
  assert.equal(a, 'test')
  assert.equal(typeof next, 'function')

  setTimeout(function() {
    next(null, 'happy')
  }, 100)
}

var b = function(b, next) {
  console.log('in b..')
  assert.equal(b, 'happy')

  setTimeout(function() {
    next(null, b)
  }, 500)
}

var c = function(a, b, c, next) {
  assert.deepEqual("the happy has".split(" "), [b, a, c])
  next('error', 'Test', 'finished.')
  // next(null); => by default it won't repeat
}

describe('aqueue', function() {
 it('links single arguments with the next function', function() {
    queue(a, 'test')(b)
 })

 it('links single arguments with the next function', function() {
    queue(c, 'the', 'has')
 })
})

