const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello DevOps ! Version 1.0</h1>');
});

server.listen(port, () => {
  console.log(`application executée sur le port ${port}`);
});