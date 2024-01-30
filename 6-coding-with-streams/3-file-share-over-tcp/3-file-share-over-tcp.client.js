/*
  6.3 File share over TCP: Build a client and a server to transfer files over TCP. Extra points
  if you add a layer of encryption on top of that and if you can transfer multiple files at once.
  Once you have your implementation ready, give the client code and your IP address to a
  friend or a colleague, then ask them to send you some files!
  Hint: You could use mux/demux to receive multiple files at once.
*/

// client
import { createReadStream } from 'fs'
import { connect } from 'net'

/**
  * @type {Array<string>}
  */
const files = process.argv.slice(2)

const socket = connect(3000, () => {
  multiplexChannels(files, socket)
})

/**
  * @param {Array<string>} sources
  * @param {WritableStream} destination
  */
function multiplexChannels(files, destination) {
  let openChannels = files.length
  for (let i = 0; i < files.length; i++) {

    // write channel and filename first
    const fileNameBuff = Buffer.from(getFileName(files[i]))
    const buff = Buffer.alloc(1 + 4 + fileNameBuff.length)
    const channel = i
    buff.writeUInt8(channel, 0)
    buff.writeUInt32BE(fileNameBuff.length, 1)
    fileNameBuff.copy(buff, 5)
    console.log(buff)
    destination.write(buff)

    // create stream for file
    const stream = createReadStream(files[i])
    stream
      .on('readable', function () {                        // (1)
        let chunk
        while ((chunk = this.read()) !== null) {
          const outBuff = Buffer.alloc(1 + 4 + chunk.length)  // (2)
          outBuff.writeUInt8(i, 0)
          outBuff.writeUInt32BE(chunk.length, 1)
          chunk.copy(outBuff, 5)
          console.log(`Sending packet to channel: ${i}`)
          destination.write(outBuff)                          // (3)
        }
      })
      .on('end', () => {                                      // (4)
        console.log(openChannels)
        if (--openChannels === 0) {
          destination.end()
        }
      })
  }
}
// 1. create readstream for each file
// 2. encrypt by adding iv in first 16 bytes of each buffer
// 3. multiplex add file index in each
//
/**
  * @param {string} path
  * @returns {string}
  */
function getFileName (path) {
  return path.substring(path.lastIndexOf("/") + 1)
}
