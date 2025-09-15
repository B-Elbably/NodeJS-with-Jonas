const EventEmitter = require('events');
const http = require('http');

// TODO: Emitter example
class Sales extends EventEmitter {
    constructor(){
        super();
        
    }
}
const myEmitter = new Sales();

myEmitter.on('newEvent' , () => {
    console.log("Event fired!");
});
myEmitter.on('newEvent' , () => {
    console.log("Event fired again!");
});
myEmitter.on('newEvent' , stock => {
    console.log(`Event fired ${stock}!`);
});

myEmitter.emit('newEvent', 'More');
// ==========================================
const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request received!');
    res.end('Request received!');
});

server.on('request', (req, res) => {
    console.log('Another request received! ');
});

server.on('close', () => {
    console.log("Server closed!");
});

server.listen(8000, 'localhost', () => {
    console.log("Server listening on port 8000");
});