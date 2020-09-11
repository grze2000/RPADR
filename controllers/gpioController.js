const { Gpio } = require('pigpio');
const ledController = require('./ledController');

let pins = {
    'frontLeftForward': 22,
    'frontRightForward': 10,
    'rearLeftForward': 17,
    'rearRightForward': 27,
    'frontLeftBackward': 13,
    'frontRightBackward': 19,
    'rearLeftBackward': 9,
    'rearRightBackward': 11
}
let status = {
    'forward': false,
    'backward': false,
    'left': false,
    'right': false
}

for(const [key, value] of Object.entries(pins)) {
    pins[key] = new Gpio(value, {mode: Gpio.OUTPUT});
}

const FORWARD = ['frontLeftForward', 'frontRightForward', 'rearLeftForward', 'rearRightForward'];
const BACKWARD = ['frontLeftBackward', 'frontRightBackward', 'rearLeftBackward', 'rearRightBackward'];
const FORWARD_RIGHT = ['frontLeftForward', 'rearLeftForward'];
const FORWARD_LEFT = ['frontRightForward', 'rearRightForward'];
const BACKWARD_RIGHT = ['frontLeftBackward', 'rearLeftBackward'];
const BACKWARD_LEFT = ['frontRightBackward', 'rearRightBackward'];
const RIGHT = ['frontLeftForward', 'rearLeftForward', 'frontRightBackward', 'rearRightBackward'];
const LEFT = ['frontRightForward', 'rearRightForward', 'frontLeftBackward', 'rearLeftBackward'];

const stop = () => {
    for(let pin of Object.values(pins)) {
        pin.digitalWrite(0);
    }
}

const update = () => {
    ledController.off(ledController.REAR);
    if(status['forward'] && status['left'])
        start(FORWARD_LEFT);
    else if(status['forward'] && status['right'])
        start(FORWARD_RIGHT);
    else if(status['forward'])
        start(FORWARD);
    else if(status['backward'] && status['left']) {
        ledController.on(ledController.REAR);
        start(BACKWARD_LEFT);
    } else if(status['backward'] && status['right']) {
        ledController.on(ledController.REAR);
        start(BACKWARD_RIGHT);
    } else if(status['backward']) {
        ledController.on(ledController.REAR);
        start(BACKWARD);
    } else if(status['left'])
        start(LEFT);
    else if(status['right'])
        start(RIGHT);
}

const start = direction => {
    for(const item of direction) {
        pins[item].digitalWrite(1);
    }
}

module.exports = { status, FORWARD, FORWARD_LEFT, FORWARD_RIGHT, BACKWARD, BACKWARD_LEFT, BACKWARD_RIGHT, LEFT, RIGHT, stop, update, start };