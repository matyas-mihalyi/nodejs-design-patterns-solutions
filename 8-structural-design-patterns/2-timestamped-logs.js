/**
  * @type {ProxyHandler}
  */
const handler = {
  get: function (target, prop, _reciever) {
    if (
      prop === 'log' ||
      prop === 'info' ||
      prop === 'error' ||
      prop === 'debug'
    ) {
      return function (...args) {
        return target[prop](`${new Date().toISOString()} ${args[0]}`, ...args.slice(1, args.length) ?? '')
      }
    }

  }
}

/**
  * @type {Console}
  */
const timestampedLogger = new Proxy(console, handler)

timestampedLogger.log('hello', 'world')
timestampedLogger.info(`It\'s ${new Date().getFullYear()}`)
timestampedLogger.error('There was an error!')
timestampedLogger.debug('Let\'s debug it...')

