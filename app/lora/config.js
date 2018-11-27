'use strict';

var mosca = require('mosca');

var config = {
    shepherdName: 'lora-shepherd',
    defaultAccount: null,
    brokerUrl: 'mqtt://localhost',
    brokerSettings: {
        port: 1883,
        persistence: {
            factory: mosca.persistence.LevelUp,
            path: './persist'
        }
    },
    clientConnOptions: {
        keepalive: 10,                      // seconds, default 0, can be any positive number
        clientId: null,
        protocolId: 'MQTT',                 // or 'MQIsdp' in MQTT 3.1.1
        protocolVersion: 4,                 // or 3 in MQTT 3.1
        clean: true,                        // set to false to receive QoS 1 and 2 msg while offline
        reconnectPeriod: 20000,             // interval between two reconnections
        connectTimeout: 30*1000,            // time to wait before a CONNACK is received
        // username: account.username,               // the username required by your broker, if any
        // password: new Buffer(account.password),   // the pwd required by your broker, if any. passwords are buffers
        will: {                                      // a msg that will sent by the broker automatically when the client disconnect badly
            topic: 'announce',                       // the topic to pub
            payload: new Buffer('shepherd is down'), // the msg to publish, payloads are buffers
            qos: 1,
            retain: 1,
        }
    },
    reqTimeout: 10000,
    initTimeout: 20000,
    channelTopics: {
        'register/#': 0,
        'deregister/#': 0,
        'schedule/#': 0,
        'update/#': 1,
        'response/#': 1,
        'ping/#': 0,
        'lora/#': 0,
        'request/#': 0,
    }
};

module.exports = config;