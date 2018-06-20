/**
 * service.js
 *
 * Base class for services
 */
'use strict';

/**
 * Constants
 */
const PING = 1000;

/**
 * Main class for services
 */
class Service {
    /**
     * Class constructor
     * @param {Object} definition Service definition
     * @param {Object} configuration Service configuration
     */
    constructor() {
        this._status = 1;
    }
    /**
     * Starts the service
     * @returns {*} False if service failed to start, null otherwise
     */
    start() {
        if (this.running) {
            this._signalError = 'running';
            return false;
        }
        return null;
    }
    /**
     * Stops the service
     * @returns {*} False if service failed to stop, null otherwise
     */
    stop() {
        if (this.dead) {
            this._signalError = 'stopped';
            return false;
        }
        return null;
    }
    /**
     * Restarts the service
     * @returns {*} False if service failed to restart, null otherwise
     */
    restart() {
        return null;
    }
    /**
     * Pauses the service
     * @returns {*} False if service failed to pause, null otherwise
     */
    pause() {
        if (!this.running) {
            this._signalError = 'notRunning';
            return false;
        }
        return null;
    }
    /**
     * Updates the service
     * @returns {*} False if service failed to update, null otherwise
     */
    update() {
        return null;
    }
    /**
     * Reloads the service configuration
     * @returns {*} False if service failed to reload, null otherwise
     */
    reload() {
        return null;
    }
    /**
     * Resets service data
     * @returns {*} False if service failed to reset, null otherwise
     */
    reset() {
        return null;
    }
    /**
     * Connects the service to Lux
     */
    connect() {
        process.on('message', this._message.bind(this));
        process.send({
            action: 'connect',
            dependencies: this.dependencies
        });
    }
    /**
     * Sends an ACK after receiving configuration and definition
     */
    connected() {
        process.send({
            action: 'connected'
        });
    }
    /**
     * Receives messages sent by Lux
     * @param {Object|Boolean|Number|String|null} msg Received message
     * @private
     */
    _message(msg) {
        if (typeof msg !== 'object' || typeof msg.action !== 'string') {
            console.error('Invalid message:', msg);
            return;
        }
        switch (msg.action) {
            case 'connect':
                this._config = msg.config;
                this._def = msg.def;
                this._name = msg.name;
                this.connected();
                break;
            case 'connected':
                this.start();
                break;
            case 'ping':
                setTimeout(this.ping.bind(this), PING);
                break;
            default:
                console.log('Invalid action');
                break;
        }
    }
    /**
     * Gets if the service is auto-starting
     * @returns {Boolean} If the service is auto-starting
     */
    get autoStart() {
        return this._autoStart;
    }
    /**
     * Gets if the service is dead
     * This should never happen
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
     * Gets if the service is connecting
     * @returns {Boolean} If the service is connecting
     */
    get connecting() {
        return this._status === 2;
    }
    /**
     * Gets if the service is running
     * @returns {Boolean} If the service is running
     */
    get running() {
        return this._status === 3;
    }
    /**
     * Gets if the service is paused
     * @returns {Boolean} If the service is paused
     */
    get paused() {
        return this._status === 4;
    }
    /**
     * Gets service dependencies
     * @returns {Array<String>} Service dependencies
     */
    get dependencies() {
        return [];
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

module.exports = Service;
