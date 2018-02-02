const location = require('browser-location');

class LocationEmitter {

  start() {
    this.emit();
    setInterval(() => {
      this.emit();
    }, 5000);
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
