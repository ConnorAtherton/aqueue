/*
 * aqueue.js
 *
 * Copyright 2015, Connor Atherton - http://connoratherton.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/ConnorAtherton/aqueue
 */

;(function(root, factory) {
  // amd anon module
  if (typeof define === 'function' && define.amd) {
    define(factory);
  // commonjs
  } else if (typeof exports === 'object') {
    module.exports = factory();
  // browser window
  } else {
    root.aqueue = factory();
  }
}(this, function(exports) {
  "use strict";

  function noop() {};

  /*
   * Accepts args passed in and automatically queues
   * them.
   */
  var aqueue = function(errHandler, repeat) {
    var queue = [];
    var counter = -1;
    var errHandler = errHandler || noop;
    var repeat = repeat || false;
    var running = false;

    /*
     * First argument being null indicates no error. Follows
     * the continuation passing style used by node.
     */
    var next = function() {
      var args = [].slice.call(arguments);
      var error = args.shift();
      var nextFn = null;

      // check cancelling conditions
      if (error || !running || (counter === queue.length - 1 && !repeat)) {
        error && errHandler.apply(this, [].slice.call(arguments));
        // ensure we save state
        running = false;
        return;
      }

      // reset at the end of the queue
      counter = (counter + 1) % queue.length;

      nextFn = queue[counter];
      // always push args towards the end
      args = args.concat(nextFn[1]);
      args.push(next);
      nextFn[0].apply(next, args);
    }

    var push = function() {
      var args = [].slice.call(arguments);
      var fn = args.shift();

      if (fn && typeof fn === 'function') {
        queue.push([fn, args]);
        run();
      }

      // keep chaining..
      return push;
    }

    function run() {
      if (!running) {
        running = true;

        // call the next function within the event loop
        setTimeout(function() {
          next();
        }, 0);
      }
    };

    // chaining baby..
    return push;
  }

  return aqueue;

}));

/**
 * Simpler Aqueue
 */
// var queue = (function() {
//   var is_executing = false;
//   var queue = [];
//   function push(fn) {
//     queue.push(fn);
//     execute();
//   }
//   function execute() {
//     if (is_executing) {
//       return;
//     }
//     if (queue.length === 0) {
//       return;
//     }
//     var fn = queue.shift();
//     is_executing = true;
//     fn(function() {
//       is_executing = false;
//       execute()
//     });
//   }
//   return {push: push};
// })();
