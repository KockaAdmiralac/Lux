/**
 * config.js
 * 
 * Handles Lux configuration
 */
'use strict';

/**
 * Importing modules
 */
const Service = require('./service.js'),
      Integratable = require('./integratable.js');

/**
 * Constants
 */
const SERVICE_REGEX = /^[a-z][a-z0-9-]*[a-z0-9]$/;

/**
 * Class handling Lux configuration
 * @class Configuration
 */
class Configuration {
    /**
     * Class constructor
     * @constructor
     */
    constructor() {
        this._errors = [];
        this._errorsEx = [];
        this._services = {};
        this._queue = [];
        try {
            this._config = require('../config.json');
        } catch(e) {
            this._errors.push(
                'Configuration could not be loaded. Check if `config.json` ' +
                'file exists and is valid JSON'
            );
            this._errorsEx.push(e);
        }
        if (this._config) {
            if (typeof this._config === 'object') {
                const opts = [];
                for (let i in this._config) {
                    const func = this[`_${i}Option`];
                    if (typeof func === 'function') {
                        func.call(this, this._config[i]);
                    } else {
                        opts.push(i);
                    }
                }
                if (opts.length) {
                    this._errors.push(
                        `Options ${opts.join(', ')} are unneeded`
                    );
                }
            } else {
                this._errors.push(
                    'Configuration has invalid format. Consult the ' +
                    'documentation on how to configure Lux'
                );
            }
        }
        Object.freeze(this._errors);
    }
    /**
     * Configures the process title
     * @param {String} title Title to set
     */
    _titleOption(title) {
        if (typeof title === 'string') {
            process.title = title;
        } else {
            this._errors.push('`title` option has to be a string');
        }
    }
    /**
     * Configures debug mode
     * @param {Boolean} debug If debug mode is enabled
     */
    _debugOption(debug) {
        this._debug = Boolean(debug);
    }
    /**
     * Configures services
     * @param {Object} config Services configuration
     */
    _servicesOption(config) {
        if (typeof config === 'object') {
            this._services = {};
            for (let i in config) {
                let val = config[i];
                if (typeof val !== 'object') {
                    val = {};
                }
                const name = val.name || i;
                if (SERVICE_REGEX.test(name)) {
                    this._errors.push(`Invalid service name: ${name}`);
                    continue;
                }
                let cls, def;
                const path = config.path || '../modules';
                try {
                    cls = require(`${path}/${name}/main.js`);
                    def = require(`${path}/${name}/main.json`);
                } catch(e) {
                    this._errors.push(`Failed to load resources for ${name}`);
                    this._errorsEx.push(e);
                }
                if (cls && def) {
                    if (!(cls instanceof Service)) {
                        this._errors.push(
                            `${name} has to inherit the correct superclass`
                        );
                    } else if (typeof def !== 'object') {
                        this._errors.push(
                            `Invalid definition format for ${name}`
                        );
                    } else {
                        this._createService({name, cls, def, config});
                    }
                }
            }
        }
    }
    /**
     * Validates service configuration and definition
     * and instantiates the service object
     * @param {String} name Service name
     * @param {Function} cls Service class
     * @param {Object} def Service definition
     * @param {Object} config Service configuration
     */
    _createService({name, cls, def, config}) {
        if (def.dependencies instanceof Array) {
            const deps = def.dependencies.filter(d => !this._services[d], this);
            if (deps.length) {
                this._queue.push({ name, cls, def, config, deps });
                return;
            }
        }
        if (def.config && !this._validateConfig(def.config, config)) {
            this._errors.push(`Failed to validate configuration for ${name}`);
            return;
        }
        const integrations = [];
        if (def.integrations instanceof Array) {
            const path = `${config.path || '../modules'}/integrations`;
            def.integrations.forEach(function(iname) {
                const service = this._services[iname];
                if (service) {
                    try {
                        const Integ = require(`${path}/${iname}.js`);
                        if (Integ instanceof Integratable) {
                            integrations.push(new Integ(service.integration));
                        } else {
                            this._errors.push(
                                'Integratable has to extend correct superclass'
                            );
                        }
                    } catch(e) {
                        this._errors.push(
                            `Service ${iname} is not integratable`
                        );
                    }
                } else {
                    this._errors.push(
                        `Service ${iname} doesn't exist [integration]`
                    );
                }
            }, this);
        }
        this._services[name] = new cls(def, config, integrations); // jshint ignore: line
        this._queue.forEach(function(el, i) {
            const index = el.deps.indexOf(name);
            if (index !== -1) {
                el.deps.splice(index, 0);
            }
            if (!el.deps.length) {
                this._createService({name, cls, def, config});
                delete this._queue[i];
            }
        }, this);
    }
    /**
     * Validates a service is properly configured
     * @param {Object} def Configuration definition
     * @param {Object} config Configuration
     * @todo
     */
    _validateConfig(def, config) {
        return true;
    }
    /**
     * Getter for services
     * @returns {Object} Registered services
     */
    get services() {
        return this._services;
    }
    /**
     * Getter for errors that occurred
     * @returns {Array<String>} Errors that occured
     */
    get errors() {
        return this._errors;
    }
    /**
     * Getter for debug mode
     * @returns {Boolean} If debug mode is enabled
     */
    get debug() {
        return this._debug;
    }
}

module.exports = Configuration;