/*
Write listNestedFiles(), a callback-style function that takes, as the input, the path to a directory in the local filesystem
and that asynchronously iterates over all the subdirectories to eventually return a list of all the files discovered.
*/

import { Dirent, readdir } from 'fs'

/**
  * @param {string} dir
  * @param {Function} cb
  */
function listNestedFiles(dir, cb) {
  dir = new URL(dir, import.meta.url)
  const files = []
  let inProgress = 0;

  function readDir (dir) {
    ++inProgress
    readdir(dir, {withFileTypes: true }, (err, res) => {
      if (err) return cb(err)
      processReaddirResult(res)
    })
  }

  /**
    * @param {Array<Dirent>} res
    * @param {Funcion} cb
  */
  function processReaddirResult(res) {
    for (let i = 0; i < res.length; i++) {
      if (res[i].isDirectory()) {
        readDir(res[i].path + '/' + res[i].name)
        // directories.push(res[i].path + '/' + res[i].name)
      } else {
        files.push(res[i].path + '/' + res[i].name)
      }
    }
    if (--inProgress === 0) {
      return cb(null, files)
    }
  }

  readDir(dir)
}

listNestedFiles('patterns', (err, res) => {
  if (err) console.error(err)
  console.log(res)
})
