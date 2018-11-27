var Q = require('q'),
    _ = require('busyman');

var apis={};

function dumpDeviceInfo(dev) {
    var info = dev.dump(),
        gadIds = _.map(info.gads, function (rec) {
            return rec.gadId;
        });

    info.gads = null;
    info.gads = gadIds;
    delete info.net.maySleep;
    delete info.net.sleepPeriod;

    return info;
}

apis.getAllDevsInfo = function (arg) {
    var deferred = Q.defer();

    apis.getAllDevIds(arg).then(function (ids) {
        return apis.getDevs({shepherd:arg,ids:ids});
    }).fail(function (err) {
        deferred.reject(err);
    }).done(function (devs) {
        deferred.resolve(devs);
    });

    return deferred.promise;
}

apis.getAllGadsInfo = function(arg){
    var deferred = Q.defer();

    apis.getAllGadIds(arg).then(function (ids) {
        return apis.getGads({shepherd:arg,ids:ids});
    }).fail(function (err) {
        deferred.reject(err);
    }).done(function (gads) {
        deferred.resolve(gads);
    });

    return deferred.promise;
}

apis.getAllDevIds = function (args) {
    var deferred = Q.defer();
    var self = args;

    var ids = self._devbox.exportAllIds();

    deferred.resolve(ids);
    return deferred.promise;
};

apis.getAllGadIds = function (args) {
    var deferred = Q.defer();
    var self = args;

    var ids = self._gadbox.exportAllIds();

    deferred.resolve(ids);
    return deferred.promise;
};

apis.getDevs = function (args) {
    var deferred = Q.defer();
    var devs = (args.ids).map(function (id) {
        var dev = args.shepherd.findById('device', id),
            devInfo = dev.dump();
        if(devInfo.net.address.permanent.indexOf('LoRaGateway')!=-1 || devInfo.netcore=='freebird-netcore-ble')
            return dumpDeviceInfo(dev);
        else return;
    });

    deferred.resolve(devs);
    return deferred.promise;
};

apis.getGads = function (args) {
    var deferred = Q.defer();

    var gads = (args.ids).map(function (id) {
        var gad = args.shepherd.findById('gadget', id),
            gadInfo = gad.dump();
        if(gadInfo.dev.permAddr.indexOf('LoRaGateway')!=-1 || gadInfo.netcore=='freebird-netcore-ble')
            return gadInfo;
    });

    deferred.resolve(gads);
    return deferred.promise;
};

module.exports = apis;