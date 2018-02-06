/**
 * @file
 * The application entry point.
 */

import React from 'react';
import { render } from 'react-dom';
import App from './App';
import config from './config';

render(<App {...config} />, document.getElementsByClassName('app')[0]);
