/* 
  Write a function that accepts a number and a callback as the arguments.
  The function will return an EventEmitter that emits an event called tick every 50 milliseconds
until the number of milliseconds is passed from the invocation of the function.
  The function will also call the callback when the number of milliseconds has passed,
  providing, as the result, the total count of tick events emitted.
  Hint: you can use setTimeout() to schedule another setTimeout() recursively.
  */

import { EventEmitter } from 'events'

function ticker(ms, cb) {
  const emitter = new EventEmitter()
  let ticks = 0

  function tick () {
    if (0 >= ms) {
      cb(ticks)
    } else {
      setTimeout(() => { 
        emitter.emit('tick') 
        ticks++
        ms = ms - 50
        tick()
      }, 50)
    }
  }

  tick()
  return emitter
}

ticker(51, (ticks) => console.log('nr of ticks ' + ticks))
  .on('tick', () => console.log('tickity tack'))
  .on('error', (e) => console.error(e.message))

