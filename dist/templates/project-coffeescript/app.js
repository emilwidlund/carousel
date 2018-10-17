const joystick = require('./modules/joystick');

Object.keys(joystick).forEach((k, i) => {
    window[k] = joystick[k];
});

require('./Main');