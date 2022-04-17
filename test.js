const http = require('http')
const fs = require('fs')


const server = http.createServer(function(req, res) {
    console.time('readFile')
    const stream = fs.createReadStream(__dirname + '/cjz.jpg')
    stream.pipe(res)
    console.timeEnd('readFile')
  })
  server.listen(4000)