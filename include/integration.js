/**
 * integration.js
 * 
 * Module for integrating a service with another service
 */
'use strict';

/**
 * Integration interface with other services
 * @class Integration
 */
class Integration {
    /**
     * Class constructor
     * @constructor
     * @param {Service} service Related service to integrate
     */
    constructor(service) {
        this._service = service;
    }
}

module.exports = Integration;