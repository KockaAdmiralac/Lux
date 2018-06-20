/**
 * data.js
 *
 * Class for storing service data
 */
'use strict';

/**
 * Importing modules
 */
const cp = require('child_process');

/**
 * Constants
 */
const PING = 1000;

/**
 * Service data class
 */
class ServiceData {
    /**
     * Class constructor
     * @param {String} name Service name
     * @param {String} path Service path
     * @param {Object} def Service definition
     * @param {Object} config Service configuration
     */
    constructor(name, path, def, config) {
        this._name = name;
        this._path = path;
        this._def = def;
        this._config = config;
        this._status = 0;
        this.dependencies = [];
    }
    /**
     * Starts the service
     * @param {Function} listener Listener function for messages
     */
    start(listener) {
        this._process = cp.fork('service.js', [this._path]);
        if (typeof listener === 'function') {
            this._process.on('message', listener);
        }
        this._status = 1;
    }
    /**
     * Connects the service to Lux
     */
    connect() {
        if (this._process) {
            this._process.send({
                action: 'connect',
                config: this._config,
                def: this._def,
                name: this._name
            });
        }
    }
    /**
     * Marks the service as connected
     */
    connected() {
        if (this._process) {
            this._status = 2;
            this._process.send({
                action: 'connected'
            });
        }
    }
    /**
     * Pings the service
     */
    ping() {
        if (this._process) {
            this._process.send({
                action: 'ping'
            });
        }
    }
    /**
     * Receives a pong from the service
     */
    pong() {
        this._pong = Date.now();
    }
    /**
     * Forcibly kills the service
     */
    kill() {
        if (this._process) {
            this._process.kill('SIGINT');
            this._process = null;
        }
    }
    /**
     * Gets the service name
     * @returns {String} Service name
     */
    get name() {
        return this._name;
    }
    /**
     * Gets the service directory location
     * @returns {String} Service path
     */
    get path() {
        return this._path;
    }
    /**
     * Gets if service should be auto-starting
     * @returns {Boolean} If service should be auto-starting
     */
    get autoStart() {
        return this._def.autoStart && this._config.autoStart !== false;
    }
    /**
     * Gets if the service is dead
     * @returns {Boolean} If the service is dead
     */
    get dead() {
        return this._status === 0;
    }
    /**
     * Gets if the service is starting
     * @returns {Boolean} If the service is starting
     */
    get starting() {
        return this._status === 1;
    }
    /**
     * Gets if the service is running
     * @returns {Boolean} If the service is running
     */
    get running() {
        return this._status === 2;
    }
    /**
     * Gets if the service is paused
     * @returns {Boolean} If the service is paused
     */
    get paused() {
        return this._status === 3;
    }
    /**
     * Gets if the service's ping is dead
     * @returns {Boolean} If the service's ping is dead
     */
    get deadPing() {
        return this._pong > 4 * PING;
    }
    /**
     * Gets the service type
     * @returns {String} Service name
     */
    get type() {
        return this._def.name;
    }
    /**
     * Gets the service description
     * @returns {String} Service description
     */
    get description() {
        return this._def.description;
    }
    /**
     * Gets the service version
     * @returns {Array<Number>} Service version [MAJOR, MINOR, PATCH]
     */
    get version() {
        return this._def.version;
    }
}

module.exports = ServiceData;
