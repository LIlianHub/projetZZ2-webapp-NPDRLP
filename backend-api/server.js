const http = require('http')
const listen = require('./lib/listen');

const server = http.createServer(listen);
server.listen(3000);
