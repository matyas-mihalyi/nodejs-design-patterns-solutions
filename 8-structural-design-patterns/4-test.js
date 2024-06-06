import { createFSAdapter } from './4-virtual-filesystem.js'

const fs = createFSAdapter(new Map())

fs.writeFile('file.txt', 'Hello!', () => {
  fs.readFile('file.txt', { encoding: 'base64' }, (err, res) => {
    if (err) {
      return console.error(err)
    }
    console.log(res)
  })
})
// try to read a missing file
fs.readFile('missing.txt', { encoding: 'utf8' }, (err, res) => {
  console.error(err)
})

