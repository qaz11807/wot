
var CoapNode = require('coap-node');
var coapnode = new CoapNode('web-cnode', so);

coapnode.register('localhost', 5683, function (err, rsp) {
    if (err) console.log(err);
    logging('Coap-Node registered!');
    console.log('dsdsd')
});
