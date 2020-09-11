const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const process = require('process');

const FRONT = new Gpio(5, {mode: Gpio.OUTPUT});
const REAR = new Gpio(6, {mode: Gpio.OUTPUT});

const on = led => {
    led.digitalWrite(1);
}

const off = led => {
    led.digitalWrite(0);
}

process.on('SIGINT', () => {
    off(FRONT);
    off(REAR);
    console.log('Terminating...');
    process.exit();
});

module.exports = {FRONT, REAR, on, off}