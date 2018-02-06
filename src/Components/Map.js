/**
 * React component for displaying a 2D map with overlays.
 */
import React from 'react';
import PropTypes from 'prop-types';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import MapsPlace from 'material-ui/svg-icons/maps/place';

/**
 * A component for showing an image map with overlay pins and current location.
 */
class Map extends React.Component {

  static propTypes = {

    /**
     * An array of locations to render pins over.
     *
     * @see config.js
     */
    pins: PropTypes.array,

    /**
     * A callback fired when any part of the component is clicked.
     */
    onFocus: PropTypes.func,

    /**
     * A callback fired when the map (excluding container) is clicked.
     */
    onClick: PropTypes.func,

    /**
     * The current location of the device to render a marker over.
     *
     * Set this to null to not include the device location.
     */
    currentLocation: PropTypes.object,

    /**
     * The floor this map shows.
     *
     * @see config.js
     */
    floor: PropTypes.object,
  }

  static defaultProps = {
    pins: [],
  };

  /**
   * Handles when anywhere in the component is clicked.
   */
  handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  /**
   * Handles when the map region only is clicked.
   */
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <div
        style={{padding: '15px', boxSizing: 'border-box', background: '#d3d3d3'}}
        onClick={this.handleFocus}
      >
        <div style={{position: 'relative'}}>
          <img
            src={this.props.floor.map}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={this.handleClick}
          />
          {
            this.props.currentLocation &&
              <div style={{position: 'absolute',... this.props.currentLocation}}>
                <MapsPersonPin style={{color: '#0072ff', width: '48px', height: '48px'}} />
              </div>
          }
          {
            this.props.pins.map((pin, i) => {
              return (
                <div
                  ref={(activePin) => { this.activePin = activePin; }}
                  style={{position: 'absolute',... pin}}
                  key={i}
                >
                  <MapsPlace style={{color: '#0072ff', width: '48px', height: '48px'}} />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

}

export default Map;
