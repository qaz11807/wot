'use strict';

var Q = require('q'),
    _ = require('busyman'),
    mqtt = require('mqtt'),
    mosca = require('mosca');

var MqttNode = require('mqtt-node'),
    SmartObject = require('smartobject');

var msgHdlr = require('./msgHdlr');

var init = {};

init.setupShepherd = function (shepherd, callback) {
    var deferred = Q.defer(),
        broker,
        initProcedure;

    initProcedure = function () {
        init._removeAllListeners(shepherd).then(function () {
            return init._attachBrokerEventListeners(shepherd);
        }).then(function () {
            return init._setShepherdAsClient(shepherd);
        }).then(function(){
            return init._setShepherdAsNode(shepherd);
        }).fail(function (err) {
            deferred.reject(err);
        }).done(function () {
            deferred.resolve();
        });
    };

    if (!shepherd.mBroker) {
        shepherd.mBroker = new mosca.Server(shepherd.brokerSettings);
    } else {
        setTimeout(function () {
            shepherd.mBroker.emit('ready');
        }, 20);
    }

    broker = shepherd.mBroker;
    broker.once('ready', initProcedure);

    return deferred.promise.nodeify(callback);
};

init._removeAllListeners = function (shepherd) {
    var deferred = Q.defer(),
        broker = shepherd.mBroker,
        mBrokerEvents = [
            'ready', 'clientConnected', 'clientDisconnecting', 'clientDisconnected', 'published', 'subscribed', 'unsubscribed'
        ];

    _.forEach(mBrokerEvents, function (event) {
        broker.removeAllListeners(event);
    });

    deferred.resolve();
    return deferred.promise;
};

init._attachBrokerEventListeners = function (shepherd) {
    var deferred = Q.defer(),
        broker = shepherd.mBroker,
        shepherdId = shepherd.clientId;

    broker.on('clientConnected', function (client) {
    });

    broker.on('clientDisconnecting', function (client) {
    });

    broker.on('clientDisconnected', function (client) {
    });

    broker.on('published', function (packet, client) {
        var msg =  msgHdlr.Analysis(packet);
        var qnode = shepherd.mNode,
            so = qnode.getSmartObject();
        if(qnode){
            if(qnode.isConnected()){
                if(msg)
                {
                    _.forEach(msg,function (inf){
                        switch(inf.data.sensorType){
                            case 'TP':
                                so.write('temperature', inf.fport,'sensorValue' ,inf.data.sensorValue, function (err, val) {
                                });
                                break;
                            case 'HU':
                                so.write('humidity', inf.fport,'sensorValue' ,inf.data.sensorValue, function (err, val) {
                                });
                                break;
                            case 'GX':
                                so.write('accelerometer', inf.fport,'xValue' ,inf.data.sensorValue, function (err, val) {
                                });
                                break;
                            case 'GY':
                                so.write('accelerometer', inf.fport,'yValue' ,inf.data.sensorValue, function (err, val) {
                                });
                                break;
                            case 'GZ':
                                so.write('accelerometer', inf.fport,'zValue' ,inf.data.sensorValue, function (err, val) {
                                });
                                break;
                        }

                    });
                }
            }
        }
    });

    broker.on('subscribed', function (topic, client) {
        if (client.id !== shepherdId)
            shepherd.emit('priphSubscribed', topic, client);
    });

    broker.on('unsubscribed', function (topic, client) {
        if (client.id !== shepherdId)
            shepherd.emit('priphUnsubscribed', topic, client);
    });

    deferred.resolve();
    return deferred.promise;
};

init._setShepherdAsClient = function (shepherd) {
    var deferred = Q.defer(),
        shepherdId = shepherd.clientId,
        options = shepherd.clientConnOptions,
        mc;

    options.clientId = shepherdId;
    options.port = shepherd.brokerSettings.port;

    if (!shepherd.mClient) {
        shepherd.mClient = mqtt.connect('mqtt://localhost', options);

        mc = shepherd.mClient;

        mc.on('connect', function (connack) {
            if (connack.sessionPresent) {   // session already exists, no need to subscribe again
                deferred.resolve();
                return deferred.promise.nodeify(callback);
            }

            mc.subscribe(shepherd._channels, function (err, granted) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(granted);
                }
            });
        });
    }
    return deferred.promise;
};

init._setShepherdAsNode = function (shepherd) {
    var deferred = Q.defer(),
        shepherdId = shepherd.clientId,
        options = shepherd.clientConnOptions,
        qnode;

    options.clientId = shepherdId;
    options.port = shepherd.brokerSettings.port;

    if (!shepherd.mNode) {

        var so = new SmartObject();
        so.init('temperature', 0, {
            sensorValue: 31,
            units : 'C'
        });
        so.init('accelerometer', 0, {
            xValue: 31,
            yValue: 0,
            zValue: 5,
            units :'g',
        });
        so.init('humidity', 0, {
            sensorValue: 20,
            units : '%RH'
        });

        setTimeout(function(){

            shepherd.mNode = new MqttNode(options.clientId,so);
            qnode = shepherd.mNode;
            qnode.on('ready', function () {
                qnode.connect('mqtt://192.168.88.134:8883', function (err, rsp) {
                    if (!err && rsp.status === 200) {
                        /*
                        qnode.checkin(function (err, rsp) {
                        });*/
                    }
                });
                deferred.resolve();
            });

            qnode.on('registered', function () {
            });

            qnode.on('login', function () {

            });
        },2000)
    }
    return deferred.promise;
};

module.exports = init;
