var chalk = require('chalk'),
    _ = require('busyman');

var apis = require('./helpers/apis');

var Freebird = require('freebird'),
    bleCore = require('freebird-netcore-ble')('noble'),
    coapCore = require('freebird-netcore-coap')(),
    mqttCore = require('freebird-netcore-mqtt')('my_iot_mqtt',{
        broker: {
            port: 8883,
            http: {
                port: 8080,
                bundle: true,
                static: './'
            }
        }
    });

var Datastore = require('nedb')
    , db = new Datastore({ filename: './Database/gadValue.db', autoload: true });
    db.loadDatabase(function (err) {    // Callback is optional
        if(erre)console.log(chalk.red('db load failed!'));
        else console.log(chalk.cyan('db load success!'));
    });

var MqttNode = require('mqtt-node'),
    SmartObject = require('smartobject');

var so = new SmartObject();
var qnode = new MqttNode('iNode', so);

function timeZone(date){
    var d = new Date(date);
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000*8));
}

qnode.on('ready', function () {
    qnode.connect('mqtt://192.168.88.134:8883', function (err, rsp) {
    });
});
qnode.on('registered', function () {
});
qnode.on('login', function () {
});

qnode.on('message', function (topic, message, packet) {
    if(topic.indexOf("cmd")!=-1){
        var cmd = JSON.parse(packet.payload.toString());
        var Type = topic.split('/')[1];
        switch(Type){
            case 'findAll':
                var d =timeZone(cmd.date);
                d.setHours(d.getHours()+8);
                var d1 = new Date(d);
                var d2 = new Date(d);
                d1.setHours(0);
                d2.setHours(23);
                db.find({
                    id:cmd.id,
                    updated:{
                        $lte:d2,
                        $gte:d1
                    }
                }).sort({ updated: 1 }).exec( function (err, docs) {
                    qnode.publish('cmd/finaAll/response', JSON.stringify(docs), function (err, encMsg) {
                        if (err)
                            console.log(err);
                    });
                });
                break;
            case 'findSpecific':
                var d1 = timeZone(cmd.dateStart)
                var d2 = timeZone(cmd.dateEnd)
                d1.setHours(d1.getHours()+8);
                d2.setHours(d2.getHours()+8);
                db.find({
                    id:cmd.id,
                    updated:{
                        $gte:timeZone(d1),
                        $lte:timeZone(d2)}
                }).sort({ updated: 1 }).exec(function (err, docs) {
                    qnode.publish('cmd/findSpecific/response', JSON.stringify(docs), function (err, encMsg) {
                        if (err)
                            console.log(err);
                    });
                });
                break;
            case'getAllGadAndDev':
                apis.getAllDevsInfo(freebird).done(function (devs) {
                    _.forEach(devs, function (dev) {
                        if(!dev)return;
                        var path = 'dev/' + dev.id + '/devInfo';
                        qnode.publish(path, dev, function (err, encMsg) {
                            if (err)
                                console.log(err);
                        });
                    });
                });
                setTimeout(function () {
                    apis.getAllGadsInfo(freebird).done(function (gads) {
                        _.forEach(gads, function (gad) {
                            if(!gad)return;
                            var path = 'gad' + '/' + gad.id + '/' + 'gadInfo';
                            qnode.publish(path, gad, function (err, encMsg) {
                                if (err)
                                    console.log(err);
                            });
                        });
                    });
                },1000);
                break;
            default: return;
        }
    }
});


var LoraShepherd = require('./lora/lora-shepherd');
var loraServer = new LoraShepherd('LoRaGateway1',{
    broker: {
        port: 1883
    }
});

loraServer.start(function (err) {      // start the sever
    if (err)
        console.log(err);
    else
        console.log(chalk.cyan('LoRa server is started...'));
});

var freebird = new Freebird([ mqttCore, coapCore, bleCore ]);
var app = function () {

    setLeaveMsg();

    freebird.start(function (err) {
        console.log(chalk.green("[Server Started]"))
        bleCore._controller.onDiscovered(function (pInfo, cb) {
            if (
                pInfo.addr === '0x20c38ff1c09d'||
                pInfo.addr === '0x209148381fae'||
                pInfo.addr === '0x20c38ff1bbbb'||
                pInfo.addr === '0x20c38ff1a56e'||
                pInfo.addr === '0x209148381f9d'||
                pInfo.addr === '0x20c38ff1a536'||
                pInfo.addr === '0x689e192a894a'||
                pInfo.addr === '0x209148381f8f'
            )
                cb(null, true);
            else
                cb(null, false);
        });
        freebird.permitJoin(500);
    });

    freebird.on('ncPermitJoin',function (msg) {
        if(msg.timeLeft==0)freebird.permitJoin(300);
    });

    freebird.on('ready', function () {
        console.log(chalk.green("[     ready    ]"))
    });

    freebird.on('devIncoming', function (dev) {
        console.log(chalk.yellow('[  devIncoming ]')+
            ' dev.id:'+dev.id+
            ' |dev.Addr:'+dev.permAddr+
            ' |dev.ncName:'+dev.ncName);
    });

    freebird.on('gadIncoming', function (gad) {
        console.log(chalk.yellow('[  gadIncoming ]')+
            ' gad.id:'+gad.id+
            ' |gad.Addr:'+gad.permAddr+
            ' |gad.ncName:'+gad.ncName+
            ' |gad.auxId:'+gad.auxId);
    });

    freebird.on('devNetChanged', function (msg) {
        var dev = freebird.findByNet('device', msg.ncName, msg.permAddr),
            gads = [];
        console.log(chalk.blue('[ devNetChanged]')+
            ' dev.id:'+msg.id+
            ' |dev.Addr:'+msg.permAddr+
            ' |dev.ncName:'+msg.ncName+
            ' |dev.status:'+dev.dump().net.status);

        function regGadAndQNODE() {
            if (qnode.isConnected()) {
                if(msg.ncName=='my_iot_mqtt'){
                    if(msg.permAddr.indexOf('iNode')!=-1){
                        qnode.subscribe('db/+/ind',function (err, granted) {
                            if(err)console.log(err);
                        });
                        qnode.subscribe('cmd/+/ind',function (err, granted) {
                            if(err)console.log(err);
                        });
                    }
                    if(msg.permAddr.indexOf('LoRaGateway1')!=-1){

                        var devInfo=dev.dump();

                        devInfo.gads.forEach(function (gadInfo) {
                            var gad = freebird.findByNet('gadget', msg.ncName, msg.permAddr, gadInfo.auxId);
                            if (gad)
                                gads.push(gad);
                        });

                        gads.forEach(function (gad) {
                            var gadInfo = gad.dump(),
                                gadType = gadInfo.panel.classId;

                            switch (gadType){
                                case  'accelerometer':
                                    gad.writeReportCfg('xValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('xValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('xValue report config set error: ' + err);
                                        }
                                    });
                                    gad.writeReportCfg('yValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('yValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('yValue report config set error: ' + err);
                                        }
                                    });
                                    gad.writeReportCfg('zValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('zValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('zValue report config set error: ' + err);
                                        }
                                    });
                                    break;
                                default:
                                    gad.writeReportCfg('sensorValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('sensorValue report config set error: ' + err);
                                        }
                                    });
                                    break;
                            }

                        });
                    }
                }
                else if(msg.ncName=='freebird-netcore-coap') {
                }else{
                    var devInfo = dev.dump();
                    var path = 'dev/' + msg.id + '/devInfo';

                    qnode.publish(path, devInfo, function (err, encMsg) {
                        if (err)
                            console.log(err);
                    });

                    devInfo.gads.forEach(function (gadInfo) {
                        var gad = freebird.findByNet('gadget', msg.ncName, msg.permAddr, gadInfo.auxId);
                        if (gad)
                            gads.push(gad);
                    });

                    gads.forEach(function (gad) {
                        var gadInfo = gad.dump(),
                            gadType = gadInfo.panel.classId,
                            path = 'gad' + '/' + gadInfo.id + '/' + 'gadInfo';

                        qnode.publish(path, gadInfo, function (err, encMsg) {
                            if (err)
                                console.log(err);
                        });

                        if (devInfo.net.status === 'online') {
                            switch (gadType) {
                                case 'presence':
                                    gad.writeReportCfg('dInState', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('dInState', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('presence report config set error: ' + err);
                                        }
                                    });
                                    break;
                                case 'pwrCtrl':
                                    gad.writeReportCfg('onOff', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('onOff', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('pwrCtrl report config set error: ' + err);
                                        }
                                    });
                                    break;
                                case 'dIn':
                                    gad.writeReportCfg('dInState', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('dInState', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('dIn report config set error: ' + err);
                                        }
                                    });
                                    break;
                                case 'aIn':
                                    gad.writeReportCfg('aInCurrValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('aInCurrValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('aIn report config set error: ' + err);
                                        }
                                    });
                                    break;
                                default:
                                    gad.writeReportCfg('sensorValue', {enable: true}, function (err) {
                                        if (err) {
                                            setTimeout(function () {
                                                gad.writeReportCfg('sensorValue', { enable: true }, function () {});
                                            }, 1000);
                                            console.log('sensorValue report config set error: ' + err);
                                        }
                                    });
                                    break;
                            }
                        }

                    });
                }
            }else setTimeout(regGadAndQNODE, 2000);
        }
        setTimeout(regGadAndQNODE, 2000);
    });

    freebird.on('gadAttrsChanged', function (msg) {
        var gad = freebird.findById('gadget', msg.id),
            gadInfo = gad.dump(),
            devAddr = gadInfo.dev.permAddr,
            gadType = gadInfo.panel.classId;
        switch (gadType) {
            case 'presence':
                console.log(chalk.red('[gadAttrChanged]')+
                    ' gad.id:'+msg.id+
                    ' |gad.data:'+msg.data.dInState);
                break;
            case 'pwrCtrl':
                console.log(chalk.red('[gadAttrChanged]')+
                    ' gad.id:'+msg.id+
                    ' |gad.data:'+msg.data.pwrCtrl);
                break;
            case 'dIn':
                console.log(chalk.red('[gadAttrChanged]')+
                    ' gad.id:'+msg.id+
                    ' |gad.data:'+msg.data.dInState);
                break;
            case 'aIn':
                console.log(chalk.red('[gadAttrChanged]')+
                    ' gad.id:'+msg.id+
                    ' |gad.data:'+msg.data.aInCurrValue);
                break;
            default:
                console.log(chalk.red('[gadAttrChanged]')+
                    ' gad.id:'+msg.id+
                    ' |gad.data:'+msg.data.sensorValue);
                break;
        }

        var path = devAddr+'/'+msg.id+'/'+gadType;
        db.insert({id:msg.id,attr:msg.data,updated:timeZone(new Date())}, function (err, newDoc) {
        });
        if(qnode.isConnected) {
            qnode.publish(path, msg, function (err, encMsg) {
                if (err)
                    console.log(err);
            });
        }
    });

    freebird.on('error', function (err) {
        console.log('freebire error: ' + err);
    });
};

/**********************************/
/* goodBye function               */
/**********************************/
function setLeaveMsg() {
    process.stdin.resume();

    function showLeaveMessage() {
        console.log(' ');
        console.log(chalk.blue('      _____              __      __                  '));
        console.log(chalk.blue('     / ___/ __  ___  ___/ /____ / /  __ __ ___       '));
        console.log(chalk.blue('    / (_ // _ \\/ _ \\/ _  //___// _ \\/ // // -_)   '));
        console.log(chalk.blue('    \\___/ \\___/\\___/\\_,_/     /_.__/\\_, / \\__/ '));
        console.log(chalk.blue('                                   /___/             '));
        console.log(' ');
        console.log('    >>> This is a wot project base on the freebird.');
        console.log(' ');

        if (process.listeners('SIGINT').length === 1)
            process.exit();
    }

    process.on('SIGINT', showLeaveMessage);
}

module.exports = app;
