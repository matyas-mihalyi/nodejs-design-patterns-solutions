/*
Write the implementation of concatFiles(), a callback-style function that takes two or more paths to text files in the filesystem and a destination file
*/
import { appendFile, readFile } from 'fs'
import { URL } from 'url'

function concatFiles(dest, cb, ...files) {
  const tasks = createTasks(dest, ...files)

  function iterate (index) {
    console.log('iterate start index ' + index)
    if (index === tasks.length) {
      console.log('task length 0')
      return finish()
    }
    const task = tasks[index]
    console.log('call task ' + index)
    task((err) => {
      if (err) return cb(err)
      iterate(index + 1)
    })
  }
  function finish () {
    console.log('finished')
    cb(null, 'ready')
  }
  iterate(0)
}

function createTasks (dest, ...files) {
  return files.map(file => (cb) => read(file, (_err, content) => append(content, dest, cb)))
}

function read(file, cb) {
  readFile(new URL(file, import.meta.url), (err, content) => {
    if (err) return console.log(err)
    cb(null, content)
  })
}

function append(content, dest, cb) {
  appendFile(new URL(dest, import.meta.url), content, (err) => {
    if (err) return cb(err)
    cb(null, 'appended to ' + dest)
  })
}

concatFiles('test.txt', (err, res) => {
  if (err) {
    return console.error(err)
  }
  console.log(res)
}, 'foo.txt', 'bar.txt')
