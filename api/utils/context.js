"use strict";

class ServiceContext {
    constructor(services) {
        this._instances = new Map();
        this._services = services;
        this._circleDetection = [];
    }

    get(key) {
        this._assertServiceExists(key);
        this._assertNoCircleDetected(key);
        const service = this._services[key];
        this._circleDetection.push(key);
        if (!this._instances.has(key)) {
            this._instances.set(key, service.call(this));
        }
        this._circleDetection.pop();
        return this._instances.get(key);
    }
    _assertServiceExists(key) {
        if (!this._services[key]) {
            throw new Error(`Service "${key}" is not registered!`)
        }
    }
    _assertNoCircleDetected(key) {
        if (this._circleDetection.includes(key)) {
            const tmp = this._circleDetection;
            this._circleDetection = [];
            tmp.push(key);
            const circleText = tmp.join(' -> ');
            throw new Error(`Circular dependency injection: ${circleText}`);
        }
    }
}

module.exports = {ServiceContext};