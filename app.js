const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const gpioController = require('./controllers/gpioController');
const distanceController = require('./controllers/distanceController')(io);
const cameraController = require('./controllers/cameraController')(app);
const ledController = require('./controllers/ledController');

let adminID = null;

ledController.on(ledController.FRONT);

app.use(express.static(__dirname+'/client'));

app.get('', (req, res) => {
    res.sendFile('/index.html');
});

const keyEvents = (keyDown, key) => {
    gpioController.stop();
    if(key === 'up') {
        gpioController.status['forward'] = keyDown;
        if(keyDown) gpioController.status['backward'] = false;
    } else if(key === 'down') {
        gpioController.status['backward'] = keyDown;
        if(keyDown) gpioController.status['forward'] = false;
    } else if(key === 'left') {
        gpioController.status['left'] = keyDown;
        if(keyDown) gpioController.status['right'] = false;
    } else if(key === 'right') {
        gpioController.status['right'] = keyDown;
        if(keyDown) gpioController.status['left'] = false;
    }
    gpioController.update();
}

io.on('connection', socket => {
    console.log(`Client connected: ${socket.id}`);
    if(Object.keys(io.sockets.sockets).length === 1) {
        adminID = socket.id;
    }

    socket.emit('status', {
        control: adminID === socket.id,
        users: Object.keys(io.sockets.sockets).length
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        if(Object.keys(io.sockets.sockets).length > 0) {
            let adminUser = io.sockets.sockets[Object.keys(io.sockets.sockets)[0]];
            adminID = adminUser.id;
            adminUser.emit('status', {
                control: true,
                users: Object.keys(io.sockets.sockets).length
            });
        } else {
            adminID = null;
        }
    });

    socket.on('keydown', key => {
        if(socket.id !== adminID) return;
        keyEvents(true, key);
    });

    socket.on('keyup', key => {
        if(socket.id !== adminID) return;
        keyEvents(false, key);
    });
});

http.listen(80, () => {
    console.log('Listening on port 80');
});
app.listen(3000, () => {
    console.log('Started stream server on port 3000');
});