const raspividStream = require('raspivid-stream');

module.exports = app => {
    app.ws('/video', (ws, req) => {
        ws.send(JSON.stringify({
            action: 'init',
            width: '960',
            height: '540'
          }));
          let videoStream = raspividStream({ width: 960, height: 540, rotation: 180 });
          videoStream.on('data', (data) => {
              ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
          });
          ws.on('close', () => {
              //console.log('Client left');
              videoStream.removeAllListeners('data');
          });
    });
}