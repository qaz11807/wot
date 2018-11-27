var msgHdlr={};

function hex2a(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

msgHdlr.Analysis = function(packet){
    var payload = packet.payload.toString();
    var m=[];
    if(payload[0]=="{"||payload[0]=="[") {
        var obj = JSON.parse(payload);
        if(Array.isArray(obj)){
            obj.forEach(function check(obj) {
                if(obj.hasOwnProperty('data')){
                    var msg = hex2a(obj.data).split(':');
                    obj.data = {
                        sensorType:msg[0],
                        sensorValue:msg[1],
                        Unit:msg[2]
                    }
                    m.push(obj);
                }else return null;
            });

        }
        else {
            if(obj.hasOwnProperty('data')){
                var msg = hex2a(obj.data).split(':');
                obj.data = {
                    sensorType:msg[0],
                    sensorValue:msg[1],
                    Unit:msg[2]
                }
                m.push(obj);
            }else return null;
        }
    }else return null;

    return m;
}

module.exports = msgHdlr;