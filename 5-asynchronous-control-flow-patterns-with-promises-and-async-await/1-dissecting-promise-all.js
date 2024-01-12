/*
Implement your own version of Promise.all() leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart.
*/

/**
  * @param {Array<Promise<any>>} promiseArr
  */
async function promiseAll(promiseArr) {
  let error
  const fullfillmentValues = []

  try {
    for (const promise of promiseArr) {
      await promise
        .then(res => fullfillmentValues.push(res))
    }
  } catch (e) {
    // console.error('error: ' + e)
    throw e
  }
  // console.log(fullfillmentValues)
  return fullfillmentValues
}

const prom1 = Promise.resolve('promise 1')
const prom2 = Promise.resolve('promise 2')
const promRej = Promise.reject('whoops')

promiseAll([prom1, prom2]).then(res => console.log(res))
promiseAll([prom1, prom2, promRej])
  .then(res => console.log(res))
  .catch(err => console.error('Oh no, an error: ' + err))
