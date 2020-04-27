const server = require('./app').server
const port = process.env.APPLICATION_PORT || 3000
server.listen(port, function() {
    console.log(`Listening on ${port}...`);
 })