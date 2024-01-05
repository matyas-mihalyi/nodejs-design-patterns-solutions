/* 
Modify the function created in exercise 3.3 so that it produces an error if the timestamp at the moment of a tick
(including the initial one that we added as part of exercise 3.3) is divisible by 5.
  Propagate the error using both the callback and the event emitter.
  Hint: use Date.now() to get the timestamp and the remainder (%) operator to check whether the timestamp is divisible by 5.
  */

import { EventEmitter } from 'events'

function ticker(ms, cb) {
  const emitter = new EventEmitter()
  let ticks = 1

  function tick () {
    if (Date.now() % 5 === 0) {
      emitter.emit('error', new Error('divisible by 5'))
      return cb(new Error('divisible by 5'))
    } else if (0 >= ms) {
      cb(null, ticks)
    } else {
      setTimeout(() => { 
        emitter.emit('tick') 
        ticks++
        ms = ms - 50
        tick()
      }, 50)
    }
  }

  process.nextTick(() => {
    if (Date.now() % 5 === 0) {
      emitter.emit('error', new Error('divisible by 5'))
      return cb(new Error('divisible by 5'))
    } else {
      emitter.emit('tick')
      tick()
    }
  })

  return emitter
}

ticker(51, (err, ticks) => {
  if (err) return console.error('it\'s an error :(\n' + err)
  console.log('nr of ticks ' + ticks)
})
  .on('tick', () => console.log('tickity tack'))
  .on('error', (e) => console.error(e.message))

