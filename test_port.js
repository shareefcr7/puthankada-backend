const net = require('net');
const server = net.createServer();
server.listen(3005, '127.0.0.1', () => {
  console.log('Listening on 3005');
  process.exit(0);
});
server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
