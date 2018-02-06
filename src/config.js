/**
 * @file
 * App configuration for Pega Guide.
 */

/**
 * The configuration parameters for the app.
 */
export default {

  /**
   * Supported Floors.
   *
   * An object where keys are floor names (as strings) and values are objects
   * containing a label for the floor, a reference to an image containing a map
   * of the floor, and a named set of latitude / longitude pairs that box the
   * map in.
   */
  floors: {
    "1": {
      label: '1st Floor',
      map: './static/floors/1.png',
      geoBox: {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
      },
    },
    "2": {
      label: '2nd Floor',
      map: './static/floors/2.png',
      geoBox: {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0,
      },
    }
  },

  /**
   * A set of searchable locations on the map.
   *
   * Each entry contains the label of the location, the room number (or subtext
   * to show below the label), a 'type' that determines which icon to show, the
   * floor that the location is on, and a set of x, y coordinates which are
   * percentages from the top / left of the map.
   *
   * @note floors should be strings.
   */
  locations: [
    {
      label: 'Tokyo',
      roomNumber: '6W327',
      type: 'room',
      x: 2,
      y: 4,
      floor: "1",
    },
    {
      label: 'Chris Smith',
      roomNumber: '6R327',
      type: 'office',
      x: 22,
      y: 11,
      floor: "2",
    },
  ],

  /**
   * The default floor to show when the app is loaded.
   *
   * @note floors should be strings.
   */
  floor: "1",

  /**
   * The company logo to show in the main app bar.
   */
  logo: './static/pega-logo.svg',

  /**
   * The title of the application.
   */
  title: 'Guide',

  /**
   * Whether or not to enable debug mode.
   *
   * This reports coordinates to the console when the map is clicked. This can
   * be used to document new locations.
   */
  debug: false,
};
