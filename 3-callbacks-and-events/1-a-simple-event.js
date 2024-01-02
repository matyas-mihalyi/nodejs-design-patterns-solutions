/*
  Modify the asynchronous FindRegex class so that it emits an event when the find process starts,
  passing the input files list as an argument. Hint: beware of Zalgo!
  */

import { EventEmitter } from 'events'
import { readFile } from 'fs'
class FindRegex extends EventEmitter {
  constructor (regex) {
    super()
    this.regex = regex
    this.files = []
  }
  addFile (file) {
    this.files.push(file)
    return this
  }
  find () {
    process.nextTick(() => this.emit('start', this.files))
    for (const file of this.files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err)
        }
        this.emit('fileread', file)
        const match = content.match(this.regex)
        if (match) {
          match.forEach(elem => this.emit('found', file, elem))
        }
      })
    }
    return this
  }
}

new FindRegex('a')
  .addFile(new URL('find-regex-test-file.txt', import.meta.url))
  .find()
  .once('start', (files) => console.log(files.length))
