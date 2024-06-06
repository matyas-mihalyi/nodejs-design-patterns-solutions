/**
  * @param {Map} data - Map to hold filename and associated data
  */
export function createFSAdapter (data) {
  return ({
  readFile (filename, options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'string') {
        options = { encoding: options }
      }
      const raw = data.get(filename)
      try {
        return callback(null, Buffer.from(raw).toString(options.encoding || 'utf8'))
      } catch (err) {
        if (err.message === 'The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined') {
          err = new Error(`ENOENT, open "${filename}"`)
          err.code = 'ENOENT'
          err.errno = 34
          err.path = filename
        }
        return callback && callback(err)
      }
  },
    writeFile (filename, contents, options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'string') {
        options = { encoding: options }
      }
      if (options.encoding) {
        contents = Buffer.from(contents, options.encoding)
      }
      callback(null, data.set(filename, contents))
    }
  })
}
