/**
 * @file
 * A helper function for generating location coordinates.
 */

import config from '../config';

/**
 * Callback for applying debug logic.
 *
 * This function will log the x, y coordinates for a location clicked on a map.
 *
 * @param {event} e
 *   The click event. This should be relative to the map's img element.
 */
function debugHandler(e) {
  if (config.debug) {
    const imgRect = e.target.getBoundingClientRect();
    const y = e.clientY - imgRect.y;
    const x = e.clientX - imgRect.x;
    console.log({
      x: Math.round(((e.clientX - imgRect.x) / imgRect.width)*100) - 2,
      y: Math.round(((e.clientY - imgRect.y) / imgRect.height)*100) - 2,
    });
  }
}

export default debugHandler;
