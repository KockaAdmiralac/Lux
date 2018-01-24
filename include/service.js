/**
 * service.js
 * 
 * Base class for services
 */
'use strict';

/**
 * Importing modules
 */
const EventEmitter = require('events'),
      Integration = require('./integration.js');

/**
 * Main class for services
 * @class Service
 */
class Service extends EventEmitter {
    /**
     * Class constructor
     * @constructor
     * @param {Object} definition Service definition
     * @param {Object} configuration Service configuration
     */
    constructor(definition, configuration, integrations) {
        super();
        this._def = definition;
        this._config = configuration;
        if (this._def.integratable) {
            const Integ = require('./integration.js');
            if (Integ instanceof Integration) {
                this._integration = new Integ(this);
            }
        } else if (
            this._def.integrations instanceof Array &&
            integrations instanceof Array
        ) {
            this._integrations = integrations;
        }
    }
    /**
     * Starts the service
     */
    start() {
        return null;
    }
    /**
     * Stops the service
     */
    stop() {
        return null;
    }
    /**
     * Restarts the service
     */
    restart() {
        return null;
    }
    /**
     * Pauses the service
     */
    pause() {
        return null;
    }
    /**
     * Updates the service
     */
    update() {
        return null;
    }
    /**
     * Initializes the service (first-time run)
     */
    initialize() {
        return null;
    }
    /**
     * Reloads the service configuration
     */
    reload() {
        return null;
    }
    /**
     * Resets service data
     */
    reset() {
        return null;
    }
}

module.exports = Service;