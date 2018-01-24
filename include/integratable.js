/**
 * integratable.js
 * 
 * Module for handling an integration
 */
'use strict';

/**
 * Handles an integration
 * @class Integratable
 * @see Integration
 */
class Integratable {
    /**
     * Class constructor
     * @constructor
     * @param {Integration} integration Related integration
     */
    constructor(integration) {
        this._integration = integration;
    }
}

module.exports = Integratable;