# Aqueue

A lightweight queue for handling async operations.

## How to use

If you have ever used or seen express.js code this
will be very familiar to you.

First, we need to create a queue to add our
functions too.

```
var queue = aqueue(errHandler);
```

The errHandler will be called if an error propogates in
any functions contained in the queue. Write your functions as you
normally would in the continuation passing style where errors - or lack thereof -
are always the first argument.

Let's create two test functions.

```
var a = function(a, next) {
  assert.equal(a, 'test');
  assert.equal(typeof next, 'function');

  setTimeout(function() {
    next(null, 'happy');
  }, 100);
}

var b = function(b, next) {
  console.log('in b..');
  assert.equal(b, 'happy');

  setTimeout(function() {
    next(null);
  }, 500);
}

// Actually queue the functions using chaining
queue(a, 'test')(b);
// is the same as..
queue(a, 'test');
queue(b);
```

The first thing to notice is that both of these functions
contain asynchronous calls, so to deal with this we invoke
the `next` function whenever the function has finished executing.
The next function is the function queued directly after the current
function.

Underneath, aqueue handles argument passing and invoking
functions correctly. The error handler we passed in earlier
is called when the first argument is truthy. Queue execution
is halted and control is passed to that function instead.

### Licence

MIT
