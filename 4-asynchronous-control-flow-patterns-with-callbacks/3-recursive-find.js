/*
 Write recursiveFind(), a callback-style function that takes a path to a directory in the local filesystem and a keyword, as per the following signature:
 function recursiveFind(dir, keyword, cb) { }
 The function must find all the text files within the given directory that contain the given keyword in the file contents.
 The list of matching files should be returned using the callback when the search is completed.
 If no matching file is found, the callback must be invoked with an empty array. 
*/

import { Dirent, readFile, readdir } from 'fs'

/**
  * @param {string} dir
  * @param {string} keyword
  * @param {Function} cb
  */
function recursiveFind(dir, keyword, cb) {
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
      } else {
        checkFileForKeyword(res[i].path + '/' + res[i].name)
      }
    }
    --inProgress
  }

  /**
    * @param {string} filePath
  */
  function checkFileForKeyword(filePath) {
    ++inProgress
    readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) return cb(err)
      if (fileContent.includes(keyword)) {
        files.push(filePath)
      }
      if (--inProgress === 0) {
        return cb(null, files)
      }
    })
  }

  readDir(dir)
}

recursiveFind('patterns', 'iterate', (err, res) => {
  if (err) console.error(err)
  console.log(res)
})
