import http from 'http'

class RequestBuilder {
  setMethod (method) {
    this.method = method
    return this
  }
  setUrl (url) {
    const { pathname, host } = new URL(url)
    this.path = pathname
    this.hostname = host
    return this
  }
  setPortNumber (portNumber) {
    this.port = portNumber.toString()
    return this
  }
  setQueries (queries) {
    this.queries += Object.entries(queries).map(([k,v], i) => {
      if (i === 0) {
        return `?${k}=${v}`
      } else {
        return `&${k}=${v}`
      }
    }).join('')
    return this
  }
  setHeaders (headers) {
    this.headers = headers
    return this
  }
  setRequestBody (data) {
    this.body = JSON.stringify(data)
    return this
  }
  build () {
    if (this.queries) { // add queries to path if any
      this.path += this.queries
    }
    if (this.method === 'GET' && this.method === 'get' && this.method === 'head' && this.method === 'HEAD') { // body should not be sent
      this.body = undefined
    } 
    return this
  }

  invoke () {
    const options = {
      hostname: this.hostname,
      path: this.path,
      method: this.method,
      port: this.port,
      headers: {
        'Content-Type': 'application/json',
        ...(this.body && {'Content-Length': Buffer.byteLength(this.body)}),
      },
    }
    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    if (this.body) {
      req.write(this.body);
    }
    req.end();
  }
}

const request = new RequestBuilder()
  .setMethod('POST')
  .setRequestBody('Hello world')
  .setUrl('http://localhost/')
  .setPortNumber(3000)
  .build()

request.invoke()
