const location = require('browser-location');

class LocationEmitter {

  construct(interval) {
    this.interval = interval ? interval : 1000;
  }

  start() {
    this.emit();
    setInterval(() => {
      this.emit();
    }, this.interval);
  }

  emit() {
    location.get((err, position) => {
      console.log(err);
      console.log(position);
    });
  }

}
 
const emitter = new LocationEmitter();
emitter.start();
