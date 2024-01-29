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
  const dest = createWriteStream('dest.txt')
  socket
    .on('data', (c) => {
      console.log(c)
      dest.write(c)
    })
    .on('end', () => dest.close())
    // .pipe(createWriteStream('dest.txt'))
})
server.listen(3000, () => console.log('Server listening'))
// reads tcp and writes to file
