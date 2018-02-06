/**
 * @file
 * A library for dealing with coordinate conversions.
 */

/**
 * Represents a geographical area. 
 *
 * The geogrid is created by passing four lat/long coordinate pairs into the
 * constructor. The normalize method can then take lat/long coordinate pairs and
 * convert them to 'top', 'left' properties for overlay over a map element..
 */
class GeoBox {

  /**
   * Creates a GeoBox object.
   *
   * @param {object} box
   *   An object containing for properties: 'bottomLeft', 'bottomRight',
   *   'topLeft', and 'topRight'. Each should cotnain an object with 'x', and
   *   'y' coordinates specifying longitude and latitude.
   */
  constructor(box) {
    this.box = box;
    this.xAxis = this._getLine(box.bottomLeft, box.bottomRight);
    this.yAxis = this._getLine(box.topLeft, box.bottomLeft);
    this.xLength = this._pointDistance(box.bottomLeft, box.bottomRight);
    this.yLength = this._pointDistance(box.topLeft, box.topRight);
  }

  /**
   * Convert lat/long to 'top', 'left' properties.
   *
   * @param {object} coords
   *   An object containing 'x', and 'y' properties corresponding to longitude
   *   and latitude.
   *
   * @return {object}
   *   An object with 'top', and 'left' properties containing a percentage from
   *   their respective axes.
   */
  normalize(coords) {
    const x = this._lineDistance(this.yAxis, coords);
    const y = this._lineDistance(this.xAxis, coords);
    return {
      top: Math.round((x / this.xLength)*100) + '%',
      left: Math.round((y / this.yLength)*100) + '%',
    };
  }

  /**
   * Gets the equation for a line through two lat/long points.
   *
   * @param {object} p1
   *   An object containing 'x', 'y' corresponding to long/lat.
   * @param {object} p2
   *   An object containing 'x', 'y' corresponding to long/lat.
   *
   * @return {object}
   *   An object containing 'm', 'b' corresponding to the line y=mx+b that goes
   *   through p1 and p2.
   */
  _getLine(p1, p2) {
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    return {
      m: m,
      b: p1.y - m*p1.x,
    };
  }

  /**
   * Calculates the distance of a point from a line.
   *
   * @param {object} line
   *   An object containing 'm', 'b' corresponding to a line in the form y=mx+b.
   * @param {object} p
   *   An object containing 'x', 'y' corresponding to long/lat.
   *
   * @return {float}
   *   The distance of point p from the provided line in units.
   */
  _lineDistance(line, p) {
    const a = line.m;
    const b = -1;
    const c = line.b;
    return Math.abs(a*p.x + b*p.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  }

  /**
   * Calculates the distance between two points.
   *
   * @param {object} p1
   *   An object containing 'x', 'y' corresponding to long/lat.
   * @param {object} p2
   *   An object containing 'x', 'y' corresponding to long/lat.
   *
   * @return {float}
   *   The distance between the two points.
   */
  _pointDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

}

export default GeoBox;
