/**
 * @file
 * The main application code.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ActionSearch from 'material-ui/svg-icons/action/search';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import debugHandler from './Utils/debugHandler';
import GeoBox from './Utils/GeoBox';
import LocationEmitter from './Utils/LocationEmitter';
import LocationList from './Components/LocationList';
import Map from './Components/Map';

/**
 * The Pega Guide application class.
 */
class App extends React.Component {

  static propTypes = {

    /**
     * An object map of floors to support.
     */
    floors: PropTypes.object,

    /**
     * An array of locations to support searching for.
     *
     * @see config.js
     */
    locations: PropTypes.array,

    /**
     * The currently active floor map.
     */
    floor: PropTypes.string,

    /**
     * The logo to display in the app bar.
     */
    logo: PropTypes.string,

    /**
     * The title of the app to display in the app bar.
     */
    title: PropTypes.string,
  };

  /**
   * Creates a Pega Guide application.
   *
   * @param {object} props
   *   The props to pass to the application.
   */
  constructor(props) {
    super(props);

    // Create a geobox for each floor map.
    this.geoBoxes = {};
    Object.keys(props.floors).map((i) => {
      this.geoBoxes[i] = new GeoBox(props.floors[i].geoBox);
    });

    // Create a location emitter to get current position.
    this.emitter = new LocationEmitter(this.updatePosition);

    // Set the initial sate with the search drawer closed, the selected floor,
    // and default to not showing the current location.
    this.state = {
      floor: this.props.floor,
      open: false,
      showLocation: false,
    };
  }

  /**
   * Gets the top, left coordinates for the current location.
   *
   * @return {object}
   *   An object containing 'top' and 'left' properties to apply to the
   *   current position marker.
   */
  getCurrentLocation = () => {
    if (this.state.showLocation && this.state.currentLocation) {
      return this.geoBoxes[this.state.floor].normalize(this.state.currentLocation);
    }
  }

  /**
   * Gets a list of active pins to show on the map.
   *
   * Currently this only supports one pin at a time.
   *
   * @return {array}
   *   An array of objects, each containing 'top' and 'left' properties to apply
   *   to a pin element marking a location on the map.
   */
  getActivePins = () => {
    return this.state.activePin ? [{
      left: this.state.activePin.x + '%',
      top: this.state.activePin.y + '%',
    }] : [];
  }

  /**
   * Clears all pins from the map.
   *
   * This does not affect the current location marker.
   */
  clearPins = () => {
    this.setState({activePin: null});
  }

  /**
   * Shows the location search drawer.
   */
  openLocationList = () => {
    this.setState({open: true});
  }

  /**
   * Hides the location search drawer.
   */
  closeLocationList = () => {
    this.setState({open: false});
  }

  /**
   * Callback for when the current location lat/long coordinates are updated.
   */
  updatePosition = (position) => {
    this.setState({ currentLocation: {
      x: position.coords.longitude,
      y: position.coords.latitude,
    }});
  }

  /**
   * Sets the active pin on the map at a given point.
   *
   * @param {object} point
   *   A point object as provided in the "locations" config.
   */
  markLocation = (point) => {
    // Set the active pin to show a marker on the map for the point, close the
    // location search drawer, switch to the map for the floor the point
    // corresponds to, and notify the renderer that we need to scroll the pin
    // into view.
    this.setState({
      activePin: point,
      open: false,
      floor: point.floor,
    });
    this.needsScroll = true;;
  }

  /**
   * Handle when the user selects a floor map to display.
   */
  handleChangeFloor = (e, key, value) => {
    // Only redraw if a new floor is selected. If a new floor is selected, then
    // remove the active pin, close the location search drawer, and set the
    // active map to the selected floor.
    if (value != this.state.floor) {
      this.setState({
        activePin: null,
        open: false,
        floor: value,
      });
    }
  }

  /**
   * Handle when the user toggles the "Show My Location" option on / off.
   *
   * @param {event} e
   *   The event object from clicking the toggle.
   * @param {bool} isChecked
   *   true if the toggle is turned on, false otherwise.
   */
  handleToggleShowLocation = (e, isChecked) => {
    this.setState({showLocation: isChecked});
  }

  /**
   * Handles app render updates.
   *
   * @param {object} prevProps
   *   Previous properties.
   * @param {object} prevState
   *   Previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    // If there is a newly active pin, scroll it into view, and reset the scroll
    // state.
    if (this.state.activePin && this.map.activePin && this.needsScroll) {
      this.map.activePin.scrollIntoView(false);
      this.needsScroll = null;
    }
  }

  /**
   * Renders the App Bar the contains the logo, title, and search button.
   *
   * @return {Element}
   *   The appbar element.
   */
  renderAppbar() {
    return (
      <div>
        <AppBar
          title={this.props.title}
          titleStyle={{color: 'rgb(0, 166, 167)'}}
          iconElementLeft={<img src={this.props.logo} style={{height: '48px'}}/>}
          iconElementRight={
            <FlatButton
              icon={<ActionSearch style={{ width: '32px', height: '32', fill: 'black', color: 'black' }}/>}
              onClick={this.openLocationList}
            />
          }
          style={{background: '#fff'}}
        />
        <Drawer
          open={this.state.open}
          openSecondary={true}
        >
          <LocationList
            locations={this.props.locations}
            onClick={this.markLocation}
            focus={this.state.open}
          />
        </Drawer>
      </div>
    );
  }

  /**
   * Renders the Toolbar containing display options for the map.
   *
   * @return {Element}
   *   The toolbar element.
   */
  renderToolbar() {
    // Includes the select list for choosing the active floor map, the toggle
    // for showing / hiding the current location, and the 'clear' button for
    // clearing active pins from the map.
    return (
      <Toolbar onClick={this.closeLocationList} >
        <ToolbarGroup style={{maxWidth: '48px'}}>
          <SelectField
            value={this.state.floor}
            onChange={this.handleChangeFloor}
          >
            {
              Object.keys(this.props.floors).map((i) => {
                return (
                  <MenuItem key={i} value={i} primaryText={this.props.floors[i].label} />
                );
              })
            }
          </SelectField>
        </ToolbarGroup>
        <ToolbarGroup style={{paddingLeft: '160px'}}>
            {
              this.state.activePin &&
                <RaisedButton
                  style={{position: 'absolute', left: 0, top: 0, minWidth: '120px'}}
                  icon={<NavigationClose />}
                  onClick={this.clearPins}
                  label="Clear"
                />
            }
          <Toggle
            label="Show My Location"
            toggled={this.state.showLocation}
            onToggle={this.handleToggleShowLocation}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }

  /**
   * Handles app rendering.
   */
  render() {
    return (
      <MuiThemeProvider>
        <div>
          {this.renderAppbar()}
          {this.renderToolbar()}
          <Map
            onFocus={this.closeLocationList}
            onClick={debugHandler}
            floor={this.props.floors[this.state.floor]}
            currentLocation={this.getCurrentLocation()}
            pins={this.getActivePins()}
            ref={(map) => { this.map = map }}
          />
        </div>
      </MuiThemeProvider>
    );
  }

}

export default App;
