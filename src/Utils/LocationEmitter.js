const location = require('browser-location');

/**
 * Utility class for polling the current device's location.
 *
 * This is a proof of concept. It would be better to use native android / iOS
 * apis when available.
 */
class LocationEmitter {

  /**
   * Creates a location emitter object.
   *
   * @param {function} cb
   *   The callback function for when the location is emitted. The only argument
   *   is the position object as described at
   *   https://www.npmjs.com/package/browser-location
   * @param {int} interval
   *   The polling interval as defined by the native setInterval function.
   */
  constructor(cb, interval) {
    this._cb = cb;

    // Run the emitter on the given interval.
    this.emit();
    setInterval(() => {
      this.emit();
    }, interval ? interval : 100);
  }

  /**
   * Instructs the emitter to query and emit the position of the device.
   *
   * The callback passed to the contructor will receive the emitted position.
   */
  emit() {
    location.get((err, position) => {
      this.position = position;
      if (this._cb) {
        this._cb(this.position);
      }
    });
  }

}

export default LocationEmitter;
