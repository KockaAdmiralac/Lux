/**
 * lux.js
 * 
 * Module for controlling services
 */
'use strict';

/**
 * Importing modules
 */
const Configuration = require('./config.js'),
      Service = require('./service.js');

/**
 * Main class of the module
 * @class Lux
 */
class Lux extends Service {
    /**
     * Class constructor
     * @constructor
     */
    constructor() {
        super({}, {});
        this._config = new Configuration(this);
        if (this._config.errors.length) {
            // TODO: Move this appropriately
            console.log(
                `CONFIGURATION ERRORS: ${this._config.errors.join('\n')}`
            );
            return;
        }
        this._services = this._config.services;
    }
    /**
     * Outputs text to console if in debug mode
     * @method _debugLog
     * @private
     * @param {String} text Text to output
     */
    _debugLog(text) {
        if (this._config.debug) {
            console.log(text);
        }
    }
    /**
     * Executes a service action
     * @method _doServiceAction
     * @private
     * @param {String} service Service on which to execute the action
     * @param {String} action Action to execute
     */
    _doServiceAction(service, action) {
        try {
            return Boolean(this._services[service][action]());
        } catch(e) {
            this.emit('serviceError', service, action);
            this._debugLog(e);
            return false;
        }
    }
    /**
     * Execution and start of a process
     * @method start
     * @param {String} name Service to start
     */
    start(name) {
        if (typeof name === 'string') {
            return this._doServiceAction(name, 'start');
        } else if (this._initialized) {
            this.emit('userError', 'initialized');
            return false;
        } else {
            return Object
                .keys(this._services)
                .every(k => this._doServiceAction(k, 'start'));
        }
    }
}

module.exports = Lux;