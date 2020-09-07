const { Gpio } = require('pigpio');

module.exports = io => {
    const MICROSECDONDS_PER_CM = 1e6/34321;

    const trigger = new Gpio(21, {mode: Gpio.OUTPUT});
    const echo = new Gpio(26, {mode: Gpio.INPUT, alert: true});

    trigger.digitalWrite(0); // Make sure trigger is low

    let startTick;

	echo.on('alert', (level, tick) => {
		if (level == 1) {
			startTick = tick;
		} else {
			const endTick = tick;
			const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            var dist = (diff / 2 / MICROSECDONDS_PER_CM).toFixed();
			io.sockets.emit('distance', dist);
		}
    });
    
    setInterval(() => {
        trigger.trigger(10, 1); // Set trigger high for 10 microseconds
    }, 1000);
}
