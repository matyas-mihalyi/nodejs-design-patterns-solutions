/*
  6.3 File share over TCP: Build a client and a server to transfer files over TCP. Extra points
  if you add a layer of encryption on top of that and if you can transfer multiple files at once.
  Once you have your implementation ready, give the client code and your IP address to a
  friend or a colleague, then ask them to send you some files!
  Hint: You could use mux/demux to receive multiple files at once.
*/

import { createWriteStream } from 'fs'
import { createServer } from 'net'

const server = createServer((socket) => { // access incoming data stream in requestListener
  /**
    * @type {Array<WritableStream>}
    */
  const destinations = []
  let currentChannel = null
  let currentLength = null
  
  socket
    .on('readable', () => {
      /** 
        * @type {Buffer}
        */
      let chunk
      if (currentChannel === null) {
        chunk = socket.read(1) // read first byte to get the channel
        currentChannel = chunk && chunk.readUint8(0) // parse binary to Uint, now we have the channel
      }
      if (currentLength === null) {
        chunk = socket.read(4)
        currentLength = chunk && chunk.readUint32BE(0)
        if (currentLength === null) {
          return null
        }
      }
      chunk = socket.read(currentLength)
      console.log(chunk)
      if (!destinations[currentChannel]) { // get filename first
        destinations[currentChannel] = createWriteStream('./dest/' + chunk.toString())
        currentChannel = null
        currentLength = null
        return null
      }

      destinations[currentChannel].write(chunk)
      currentChannel = null
      currentLength = null
    })
    .on('end', () => {
      destinations.forEach((dest) => {
        dest.end()
      })
    }) 
})
server.listen(3000, () => console.log('Server listening'))
