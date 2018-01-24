/**
 * index.js
 * 
 * Main entry point of Lux
 */
'use strict';

/**
 * Importing modules
 */
const Lux = require('./include/lux.js');

/**
 * Starting up...
 */
global.lux = new Lux();
global.lux.start();