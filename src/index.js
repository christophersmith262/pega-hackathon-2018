import React from 'react';
import { render } from 'react-dom';
const location = require('browser-location');

class LocationEmitter {

  construct(interval) {
    this.interval = interval ? interval : 1000;
  }

  start() {
    this.emit();
    /*setInterval(() => {
      this.emit();
    }, this.interval);*/
  }

  emit() {
    location.get((err, position) => {
      console.log(position);
      render(
        <div>
          {position.coords.latitude}, {position.coords.longitude}, {position.coords.altitude}
        </div>, document.body);
    });
  }

}
 
const emitter = new LocationEmitter();
emitter.start();
