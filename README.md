
## Getting Started

        $ npm install

---
### node_modules\mqtt-node\lib\init.js
        
        var network = require("network")  
        
#### replace to

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

### node_modules\mqtt-shepherd\lib\init.js
#### add  
        options.port = shepherd.brokerSettings.port; 
#### under 
        options.clientId = shepherdId; 

---

        $ npm start
        
---

# Intro

> The Internet of Things (IoT) technology can be applied to various scenarios, e.g., smart city, smart manufacturing, and smart agriculture. Even if a lot of wireless access techniques, e.g., 3G/4G, Wi-Fi, Zigbee, or Bluetooth, enable to interconnect a mass of sensors and devices, brand-new wireless communications are still defined and devised continuously. For example, the LoRa technology is proposed to provide long-distance and low-power wireless access. With the rapid development of IoT, the next stage of IoT should be the integration of IoT and web service called Web of Things (WoT). In this project, we focus on the software development of WoT. In other words, we utilize and extend one famous open-source project called Freebird.js, that exchanges IoT data over Zigbee, Bluetooth, CoAP and MQTT, to further support LoRa. Finally, we implement one Web interface to realize data visualization in this project.

