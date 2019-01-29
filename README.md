
## Getting Started

$ npm install

---
node_modules\mqtt-node\lib\init.js
var network = require("network")  replace to

var network = {
        get_active_interface: function (cb) {
            setTimeout(function () {
                cb(null, {
                    ip_address: '192.168.1.99',
                    gateway_ip: '192.168.1.1',
                    mac_address: '00:11:22:AA:BB:CC'
                });
            }, 100);
        }
    };

---

node_modules\mqtt-shepherd\lib\init.js
add  options.port = shepherd.brokerSettings.port; under options.clientId = shepherdId; 

---

$ npm start
