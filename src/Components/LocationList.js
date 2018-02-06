/**
 * @file
 * React component for location findability.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import MapsPersonPinCircle from 'material-ui/svg-icons/maps/person-pin-circle';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import TextField from 'material-ui/TextField';

/**
 * A component for listing and searching for locations on the map.
 */
class LocationList extends React.Component {

  static propTypes = {

    /**
     * An array of locations to support searching for.
     *
     * @see config.js
     */
    locations: PropTypes.array,

    /**
     * A callback for handling location clicks.
     *
     * The only argument passed to the callback is the location that was
     * selected.
     */
    onClick: PropTypes.func,

    /**
     * Whether or not to auto-focus the search box.
     */
    focus: PropTypes.bool,
  }

  /**
   * Creates a Location List component.
   */
  constructor(props) {
    super(props);

    // Cache a list of all locations (sorted alphabetically).
    this.sortedItems = this.sortItems(this.props.locations);

    // Pick the first ten from the sorted list and display those by default.
    this.state = {
      activeItems: this.sortedItems.slice(0, 10),
      value: '',
    };
  }

  /**
   * Helper for sorting a list of locations.
   *
   * @param {object} items
   *   The object containg the list of locations.
   *
   * @return {object}
   *   The sorted items list.
   */
  sortItems(items) {
    var itemsCopy = [];

    // Create a copy to prevent mutation of the props object.
    for (var i in items) {
      var itemCopy = {};
      Object.keys(items[i]).map((key) => {
        itemCopy[key] = items[i][key];
      });
      itemsCopy[i] = itemCopy;
    }

    // Sort the copy alphabetically.
    itemsCopy.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      else if (a > b) {
        return 1;
      }
      else {
        return 0;
      }
    });

    return itemsCopy;
  }

  /**
   * Handles when a location has been clicked (selected).
   *
   * @param {object} point
   *   An object containing an 'x', 'y' pair representing the 'left', 'top',
   *   properties of the pin that will be placed at that location.
   */
  handleClick = (point) => {
    if (this.props.onClick) {
      this.props.onClick(point);
    }
  }

  /**
   * Handles when rendered components are redrawn.
   */
  componentDidUpdate(prevProps, prevState) {
    // Focus the search box when focus is requested.
    if (this.props.focus) {
      this.searchBox.focus();
    }
  }

  /**
   * Handles when rendered components are about to be redrawn.
   */
  componentWillUpdate(nextProps, nextState) {
    // If the component is coming into focus reset the textbox / item list.
    if (!this.props.focus && nextProps.focus) {
      this.setState({
        activeItems: this.sortedItems.slice(0, 10),
        value: '',
      });
    }
  }

  /**
   * Handles when text is typed in the search box.
   *
   * @param {event} e
   *   The change event of the text input.
   * @param {string} value
   *   The current value of the search box.
   */
  handleChange = (e, value) => {
    var matches = [];

    // Cycle through all locations to try to find a location that has a label or
    // room number which includes the searched text. We normalize everything to
    // lowercase first.
    value = value.toLowerCase();
    for (var i in this.sortedItems) {
      const label = this.sortedItems[i].label.toLowerCase();
      const roomNumber = this.sortedItems[i].roomNumber.toLowerCase();
      if (label.includes(value) || roomNumber.includes(value)) {
        matches.push(this.sortedItems[i]);
        if (matches.length >= 10) {
          break;
        }
      }
    }

    this.setState({
      activeItems: matches,
      value: value,
    });
  }

  /**
   * Renders the component.
   */
  render() {
    return (
      <List style={{padding: '15px'}}>
        <TextField
          style={{width: '100%'}}
          hintText="Search..."
          ref={(input) => { this.searchBox = input }}
          value={this.state.value}
          onChange={this.handleChange}
        />
        {
          this.state.activeItems.map((point) => {
            const icon = (point.type == 'office') ?
              <MapsPersonPinCircle style={{ width: '48px', height: '48px' }} /> :
              <MapsPlace style={{ width: '48px', height: '48px' }} />;
            return (
              <ListItem
                key={point.roomNumber}
                primaryText={point.label}
                secondaryText={point.roomNumber}
                onClick={() => { this.handleClick(point) }}
                leftAvatar={icon}
              />
            );
          })
        }
      </List>
    );
  }

}

export default LocationList;
