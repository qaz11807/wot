var util = require('util'),
    EventEmitter = require('events');

var MqttNode = require('mqtt-node'),
    SmartObject = require('smartobject');

var Q = require('q'),
    _ = require('busyman'),
    Areq = require('areq');

var init = require('./init');

var config = require('./config');

function LoRaShepherd(name,settings){
    var self = this,
        propWritable = { writable: true, enumerable: false, configurable: false };

    EventEmitter.call(this);

    var _domain = this.domain,
        __events = this._events,
        __eventsCount = this._eventsCount,
        __maxListeners = this._maxListeners;

    delete this.domain;
    delete this._events;
    delete this._eventsCount;
    delete this._maxListeners;

    Object.defineProperty(this, 'domian', _.assign({ value: _domain }, propWritable));
    Object.defineProperty(this, '_events', _.assign({ value: __events }, propWritable));
    Object.defineProperty(this, '_eventsCount', _.assign({ value: __eventsCount }, propWritable));
    Object.defineProperty(this, '_maxListeners', _.assign({ value: __maxListeners }, propWritable));

    if (arguments.length === 1 && _.isObject(name)) {
        settings = name;
        name = null;
    }

    settings = settings || {};

    if (!_.isNil(name) && !_.isString(name))
        throw new TypeError('name should be a string if gieven.');
    else if (!_.isPlainObject(settings))
        throw new TypeError('settings should be an object if gieven.');

    this.name = name || config.shepherdName;

    Object.defineProperty(this, 'clientId', _.assign({ value: this.name }, propWritable));
    Object.defineProperty(this, 'brokerSettings', _.assign({ value: settings.broker || config.brokerSettings }, propWritable));

    this.clientConnOptions = settings.clientConnOptions || config.clientConnOptions;
    this.reqTimeout = settings.reqTimeout || config.reqTimeout;

    Object.defineProperty(this, '_startTime', _.assign({ value: 0 }, propWritable));
    Object.defineProperty(this, '_enabled', _.assign({ value: false }, propWritable));
    Object.defineProperty(this, '_net', _.assign({ value: { intf: '', ip: '', mac: '', routerIp: '' } }, propWritable));
    Object.defineProperty(this, '_channels', _.assign({ value: config.channelTopics }, propWritable));
    Object.defineProperty(this, '_areq', _.assign({ value: new Areq(this, config.reqTimeout) }, propWritable));

    Object.defineProperty(this, 'mBroker', _.assign({ value: null }, propWritable));
    Object.defineProperty(this, 'mClient', _.assign({ value: null }, propWritable));
    Object.defineProperty(this, 'mNode', _.assign({ value: null }, propWritable));

    this.on('_ready', function () {
        self._startTime = Math.floor(Date.now()/1000);
        setImmediate(function () {
            self.emit('ready');
        });
    });

}

util.inherits(LoRaShepherd, EventEmitter);

LoRaShepherd.prototype.info = function () {
    return {
        name: this.clientId,
        enabled: this._enabled,
        net: _.cloneDeep(this._net),
        devNum: _.size(this._nodebox),
        startTime: this._startTime,
        joinTimeLeft: this._permitJoinTime
    };
};

LoRaShepherd.prototype.start = function (callback) {
    var self = this;

    return init.setupShepherd(this).timeout(config.initTimeout,'LoRa Broker init timeout.').then(function () {
        self._enabled = true;
        self.emit('_ready');
    }).nodeify(callback);
};

LoRaShepherd.prototype.stop = function (callback) {
    var self = this;

    return Q.fcall(function () {
        if (!self._enabled || !self.mClient) {
            return 'resolve';
        } else {
            self.permitJoin(0);
            return self.announce('stopped').then(function () {
                // close mClient, force = true, close immediately
                return Q.ninvoke(self.mClient, 'end', true);
            });
        }
    }).then(function () {
        self.mClient = null;
        self._enabled = false;
    }).nodeify(callback);
};

module.exports = LoRaShepherd;