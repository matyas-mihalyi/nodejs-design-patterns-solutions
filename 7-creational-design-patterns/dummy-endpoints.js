import http from 'http'

const server = http.createServer()

server.on('request', (req, res) => {
  req.setEncoding('utf8')
  req.on('data', (chunk) => {
    console.log(chunk)
  });
  res.writeHead(200, { 'content-type': 'application/json'})
  res.end(JSON.stringify({
    data: 'it went through'
  }))
})

server.listen(3000)
