/* 
Modify the function created in exercise 3.2 so that it emits a tick event immediately after the function is invoked.
  */

import { EventEmitter } from 'events'

function ticker(ms, cb) {
  const emitter = new EventEmitter()
  let ticks = 1
  process.nextTick(() => emitter.emit('tick')) // if emitted immediately, listener is not registered yet

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

