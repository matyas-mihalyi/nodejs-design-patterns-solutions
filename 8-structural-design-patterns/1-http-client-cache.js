import { PassThrough, Readable } from 'stream'
import { IncomingMessage, ServerResponse } from 'http'
import https from 'https'
import { URL } from 'url'

const cacheHandler = {
  cache: new Map(),
  get: function (target, prop, reciever) {
    const cache = this.cache
    if (prop === 'get') {
      return function (...args) {
        const cb = args.slice(-1)[0]
        let url = ''
        if (typeof args[0] === 'string') {
          url = args[0]
        } else if (args[0] instanceof URL) {
          url = args[0].toString()
        } else if (typeof args[0] === 'object') {
          const { protocol, host, port, path } = args[0]
          if (protocol) {
            url += protocol
          }
          if (host) {
            url += host
          }
          if (port) {
            url += port
          }
          if (path) {
            url += path
          }
        }
        console.log(url)
        if (cache.has(url)) {
          console.log('returning cache')
          return cb(Readable.from([cache.get(url)]))
        }
        console.log('calling get')
        cache.set(url, '')
        const addToCache = new PassThrough()
          .on("data", (chunk) => {
            cache.set(url, cache.get(url) + chunk)
          })
        return target[prop](...args.slice(0, -1), res => {
          res.pipe(addToCache)
          return cb(res)
        })
      }
    }
  }
}

/**
  * @param {IncomingMessage} res
  */
function responseHandler (res) {
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData)
    } catch (e) {
      console.error(e.message);
    }
  });
  return res
}

/**
  * @type {https}
  */
const cacheProxy = new Proxy(https, cacheHandler)

cacheProxy.get('https://dka-api.hu/api/v0/documents/1', responseHandler).on('error', (e) => console.error(`Got error: ${e.message}`))
setTimeout(() => cacheProxy.get('https://dka-api.hu/api/v0/documents/1', responseHandler).on('error', (e) => console.error(`Got error: ${e.message}`)), 3000)
setTimeout(() => cacheProxy.get('https://dka-api.hu/api/v0/documents/2', responseHandler).on('error', (e) => console.error(`Got error: ${e.message}`)), 6000)

