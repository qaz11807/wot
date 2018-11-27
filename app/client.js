require("./styles/main.css");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     init when page ready                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$( document ).ready(function() {

    ///////////////////////////
    //   datepicker   init   //
    ///////////////////////////

    $('#datepicker2').datepicker({
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });
    $('#datepicker2').datepicker("setDate", new Date());
    $('#datepicker1').datepicker({
        weekStart: 1,
        daysOfWeekHighlighted: "6,0",
        autoclose: true,
        todayHighlight: true,
    });
    $('#datepicker1').datepicker("setDate", new Date());
    $('#datepicker1').hide();
    $("#datepicker2").hide();

    ///////////////////////////
    //datepicker change event//
    ///////////////////////////

    $('#datepicker1').datepicker()
        .on('changeMonth', function() {
            if(selected==2){
                console.log($('#datepicker1').data('datepicker').getDate ());
                mqttnode.publish('cmd/findAll/ind',{
                    id:observeGad,
                    date: timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }if(selected==3){
                mqttnode.publish('cmd/findSpecific/ind',{
                    id:observeGad,
                    dateStart:timeZone($('#datepicker2').data('datepicker').getDate ()),
                    dateEnd:timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }
        });
    $('#datepicker1').datepicker()
        .on('changeDate', function() {
            if(selected==2){
                mqttnode.publish('cmd/findAll/ind',{
                    id:observeGad,
                    date: timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }if(selected==3){
                mqttnode.publish('cmd/findSpecific/ind',{
                    id:observeGad,
                    dateStart:timeZone($('#datepicker2').data('datepicker').getDate ()),
                    dateEnd:timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }
        });
    $('#datepicker2').datepicker()
        .on('changeMonth', function() {
            if(selected==2){
                mqttnode.publish('cmd/findAll/ind',{
                    id:observeGad,
                    date: timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }if(selected==3){
                mqttnode.publish('cmd/findSpecific/ind',{
                    id:observeGad,
                    dateStart:timeZone($('#datepicker2').data('datepicker').getDate ()),
                    dateEnd:timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }
        });
    $('#datepicker2').datepicker()
        .on('changeDate', function() {
            if(selected==2){
                mqttnode.publish('cmd/findAll/ind',{
                    id:observeGad,
                    date: timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }if(selected==3){
                mqttnode.publish('cmd/findSpecific/ind',{
                    id:observeGad,
                    dateStart:timeZone($('#datepicker2').data('datepicker').getDate ()),
                    dateEnd:timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
            }
        });

    ///////////////////////////
    //   chart mode select   //
    ///////////////////////////

    $('#inlineFormCustomSelect').on('change', function(){
        selected = $(this).val();
        switch (selected){
            case '1' :
                $('#datepicker1').hide();
                $("#datepicker2").hide();
                reqData(observeGad);
                break;
            case '2' :
                $('#datepicker1').show();
                $("#datepicker2").hide();
                var d = timeZone($('#datepicker1').data('datepicker').getDate ());
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                mqttnode.publish('cmd/findAll/ind',{
                    id:observeGad,
                    date: d
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
                break;
            case '3' :
                $('#datepicker1').show();
                $("#datepicker2").show();
                mqttnode.publish('cmd/findSpecific/ind',{
                    id:observeGad,
                    dateStart:timeZone($('#datepicker2').data('datepicker').getDate ()),
                    dateEnd:timeZone($('#datepicker1').data('datepicker').getDate ())
                },function (err,encMsg) {
                    if(!err)
                        console.log(encMsg)
                })
                break;
        }

    });

    ///////////////////////////
    // limit value set event //
    ///////////////////////////

    $('.valueBtn').on('click',function () {
        var nIndex = gads[observeGad].node;
        nodes[nIndex].Max=$('#max').val();
        nodes[nIndex].Min=$('#min').val();
        alert('limits set Success!');
    });

    ///////////////////////////
    // limit value set event //
    ///////////////////////////

    $('.closeBtn').on('click',function () {
        $('#inlineFormCustomSelect').val(1);
        selected=1;
        $('#datepicker1').hide();
        $("#datepicker2").hide();
        $('#max').val(null);
        $('#min').val(null);
    })

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                       Global Variable                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var data=[];
var gads = [];
var devs = {};
var reqIng=false;

var nodes = [
    { tier:0,image:'./icon/netcore/freebird_logo.png',status:'online',isShow:true},
    { tier:1,image:'./icon/netcore/ble.jpg',status:'online',isShow:true},
    { tier:1,image:'./icon/netcore/mt.jpg',status:'online',isShow:true},
    { tier:1,image:'./icon/netcore/zigbee.jpg',status:'online',isShow:true},
    { tier:1,image:'./icon/netcore/coap.png',status:'online',isShow:true},
];

var edges = [
    { source: 0, target: 1 ,isShow:true},
    { source: 0, target: 2 ,isShow:true},
    { source: 0, target: 3 ,isShow:true},
    { source: 0, target: 4 ,isShow:true},
];

var observeGad = -1;
var selected=1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   indexDB                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var db;
var request = indexedDB.deleteDatabase("myDb");
var request = indexedDB.open("myDb");
request.onerror = function(event) {
    console.log("Database error: " + event.target.errorCode);
};
request.onsuccess = function(event) {
    db = request.result;
    logging('IndexDB load success!');
};
request.onupgradeneeded = function (evt) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("Data", { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('gid', 'gid');
    objectStore.createIndex('type', 'Type');
    objectStore.createIndex('value', 'Value');
    objectStore.createIndex('unit', 'Unit');
    objectStore.createIndex('updated', 'updated');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                    mqtt                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var MqttNode = require('mqtt-node')
var SmartObject = require('smartobject');

var so = new SmartObject();
var mqttnode = new MqttNode('web-node', so);

mqttnode.on('ready', function () {
    logging('Mqtt-Node ready!');
});
mqttnode.on('registered', function () {
    logging('Mqtt-Node registered!');
});
mqttnode.on('login', function () {
    logging('Mqtt-Node login!');
    mqttnode.subscribe('dev/#',function (err, granted) {
        if(err)console.log(err);
    });
    mqttnode.subscribe('gad/#',function (err, granted) {
        if(err)console.log(err);
    });
    mqttnode.subscribe('cmd/+/response',function (err, granted) {
        if(err)console.log(err);
    });

    mqttnode.publish('cmd/getAllGadAndDev/ind',{ind:'getAllGadAndDev'},function (err, granted) {
        if(err)console.log(err);
        else logging('getAllGadAndDev by Mqtt-Node!');
        console.log(granted);
    });

});
mqttnode.on('message', function (topic, message, packet) {
    var obj = JSON.parse(packet.payload.toString());
    if(topic.indexOf("dev")!=-1){
        logging('----------------------------------------');
        logging('dev.id:'+obj.id);
        logging('   .Addr:'+obj.net.address.permanent);
        logging('   .ncName:'+obj.netcore);
        var imgPath,sourceNode;
        if(obj.netcore=="freebird-netcore-ble") {
            sourceNode=1;
            switch (obj.attrs.model){
                case 'WeatherStation':
                    imgPath = './icon/dev/weather.jpg';
                    break;
                default:break;
            }
        }else if(obj.netcore=="freebird-netcore-zigbee"){

        }else {
            sourceNode=2;
            imgPath = './icon/dev/gw.jpg';
        }
        mqttnode.subscribe(obj.net.address.permanent+'/#',function (err, granted) {
        });

        var n = {
            tier: 2,
            image:imgPath,
            status:obj.net.status,
            ind:obj.id,
            isShow:true};

        if(!devs[obj.id]){
            nodes.push(n);
            edges.push({source: sourceNode,target:nodes.length-1,isShow:true,status:obj.net.status});
            devs[obj.id]=obj;
            devs[obj.id].node=nodes.length-1;
        }else{
            var nIndex = devs[obj.id].node;
            devs[obj.id].net.status=obj.net.status;
            nodes[nIndex].status =obj.net.status;
    }
        restart();
    }else if(topic.indexOf("gad")!=-1){
        logging('----------------------------------------');
        logging('gad.id:'+obj.id);
        logging('   .Addr:'+obj.dev.permAddr);
        logging('   .ncName:'+obj.netcore);
        logging('   .auxId:'+obj.auxId);
        var gadType = obj.panel.classId,
            attrType=getAttrType(gadType);

        if(typeof obj.attrs[attrType]==='number')
            obj.attrs[attrType] = obj.attrs[attrType].toFixed(2);

        if(gadType=='accelerometer'){
            obj.attrs.Value={xValue:obj.attrs['xValue'],yValue:obj.attrs['yValue'],zValue:obj.attrs['zValue']};
        }else obj.attrs.Value = obj.attrs[attrType];

        var n = {tier: 3,
            value:obj.attrs.Value,
            image:getImg(gadType),
            status:devs[obj.dev.id].net.status,
            ind:obj.id,
            isShow:true,
            Max:null,
            Min:null
        };

        if(!gads[obj.id]){
            nodes.push(n);
            edges.push({
                source:devs[obj.dev.id].node,
                target:nodes.length-1,
                isShow:true,
                status:devs[obj.dev.id].net.status=='online'?true:false
            });
            gads[obj.id]=obj;
            gads[obj.id].node = nodes.length-1;
        }else {
            var nIndex = gads[obj.id].node;
            nodes[nIndex].status =devs[obj.dev.id].net.status;
        }
        restart();
    }else if(topic.indexOf("cmd")!=-1){
        var id = obj[0].id;
        var gadType = gads[id].panel.classId,
            attrType = getAttrType(gadType);
        var unit = gads[id].attrs.units;
        data=[];

        if(gadType=='accelerometer'){
            obj.forEach(function(d){
                var v;
                if(d.attr.hasOwnProperty('xValue')){
                    v = {xValue:d.attr['xValue']};
                }else if(d.attr.hasOwnProperty('yValue')){
                    v = {yValue:d.attr['yValue']};
                }else if(d.attr.hasOwnProperty('zValue')){
                    v = {zValue:d.attr['zValue']};
                }
                data.push({
                    gid: d.id,
                    Value: v,
                    Unit: unit,
                    Type: gadType,
                    updated: timeZone(d.updated)
                });
            })
        }else {
            obj.forEach(function(d){
                data.push({
                    gid: d.id,
                    Value: String(d.attr[attrType]),
                    Unit:unit,
                    Type:gadType,
                    updated: timeZone(d.updated)
                })
            })
        }

        drawDay();
    }else{

        if(!gads[obj.id]) return;
        var gadType = gads[obj.id].panel.classId,
            attrType = getAttrType(gadType);
        if (typeof obj.data[attrType] === 'number')
            obj.data[attrType] = obj.data[attrType].toFixed(2);

        if(obj.data.hasOwnProperty('xValue')){
            gads[obj.id].attrs.Value.xValue = obj.data['xValue'];
        }else if(obj.data.hasOwnProperty('yValue')){
            gads[obj.id].attrs.Value.yValue = obj.data['yValue'];
        }else if(obj.data.hasOwnProperty('zValue')){
            gads[obj.id].attrs.Value.zValue = obj.data['zValue'];
        }else  gads[obj.id].attrs.Value =String(obj.data[attrType]);

        gads[obj.id].attrs.updated = timeZone(new Date());
        nodes[gads[obj.id].node].value=gads[obj.id].attrs.Value;
        nT.text(function (d) {
            if(d.value){
                var acc = d.value.hasOwnProperty('xValue');
                if(acc){
                    return  d.value.xValue+','+
                        d.value.yValue+','+
                        d.value.zValue;
                }else return d.value.toString();
            }
        });
        var transaction = db.transaction(["Data"], "readwrite");
        var objectStore = transaction.objectStore("Data");

        if(gadType=='accelerometer'){
            var v;
            if(obj.data.hasOwnProperty('xValue')){
                v = {xValue:obj.data['xValue']};
            }else if(obj.data.hasOwnProperty('yValue')){
                v = {yValue:obj.data['yValue']};
            }else if(obj.data.hasOwnProperty('zValue')){
                v = {zValue:obj.data['zValue']};
            }
            objectStore.add({
                gid: obj.id,
                Value: v,
                Unit: gads[obj.id].attrs.units,
                Type: gadType,
                updated: timeZone(new Date())
            });
            if(observeGad == obj.id &&selected==1 &&!reqIng){
                data.push({
                    gid: obj.id,
                    Value: v,
                    Unit: gads[obj.id].attrs.units,
                    Type: gadType,
                    updated: timeZone(new Date())
                });
                drawDay();
            }
        }else{
            objectStore.add({
                gid: obj.id,
                Value: obj.data[attrType],
                Unit: gads[obj.id].attrs.units,
                Type: gadType,
                updated: timeZone(new Date())
            });
            if(observeGad == obj.id &&selected==1 &&!reqIng){
                data.push({
                    gid: obj.id,
                    Value: obj.data[attrType],
                    Unit: gads[obj.id].attrs.units,
                    Type: gadType,
                    updated: timeZone(new Date())
                });
                drawDay();
            }
        }



    }
});
mqttnode.connect('ws://localhost:8080', function (err, rsp) {
    if (!err && rsp.status === 200) {
        mqttnode.checkin(function (err, rsp) {
            console.log(rsp);  // { status: 200 }
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                             d3 service                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var svg = d3.select(".force");

var defs = svg.append("defs").attr("id", "bgDef")
var pattern = defs.append("pattern")
    .attr("id", "bgpattern")
    .attr("height", 400)
    .attr("width", 400)
    .attr('patternUnits',"userSpaceOnUse")

pattern.append("image")
    .attr("x", 0)
    .attr("y", 0)
    .attr('height',400)
    .attr('width',400)
    .attr("xlink:href", './icon/background/spirationdark.png')

svg.append('rect')
    .attr('fill','url(#bgpattern)')
    .attr('class','forceback');

var zoom_handler = d3.zoom()
    .on("zoom", function(){
        g.attr("transform",d3.event.transform)
    });

zoom_handler(svg);

var height = parseFloat(svg.style('height')),
    width = parseFloat(svg.style('width'));

var radius = 30;

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(edges).distance(120))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1)
    .on("tick", ticked);

var nT = svg.selectAll(".nodetext")
    .data(nodes)
    .enter()
    .append("text")
    .attr('fill','#000000')
    .attr("class","nodetext")
    .attr('font','monospace')
    .attr("dx",-8)
    .attr("dy",30);

var div = d3.select(".tooltip").style("opacity", 0);

var g = svg.append("g"),
    link = g.append("g").attr("stroke", "#FFFFFF").attr("stroke-width", 1.5).selectAll(".link"),
    node = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll('.node');

restart();

function restart() {

    link = link.data(edges.filter(function(d){return d.isShow;}));
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    node = node.data(nodes.filter(function(d){return d.isShow;}));
    node.exit().remove();
    node = node.enter().append("circle")
        .attr("r", function(d){
            return  radius - d.tier*5;
        })
        .style("stroke",function (d) {
            if(d.status =='online') return '#06a900';
            else return '#ff8000';
        })
        .style("stroke-width",2)
        .attr("fill", function(d, i){
            var defs = svg.append("defs").attr("id", "imgdefs")
            var catpattern = defs.append("pattern")
                .attr("id", "catpattern" + i)
                .attr("height", 1)
                .attr("width", 1)

            var width,height;
            switch (d.tier){
                case 0:
                    width=60;
                    height=60;
                    break;
                case 1:
                    width=50;
                    height=50;
                    break;
                case 2:
                    width=38;
                    height=38;
                    break;
                case 3:
                    width=30;
                    height=30;
                    break;
            }
            catpattern.append("image")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height)
                .attr("xlink:href", d.image)

            return "url(#catpattern" + i + ")";
        })
        .on('click',function (d,i) {
            if(d.tier==3){
                observeGad = d.ind;
                $("#myModal").modal();
                reqData(d.ind);
            }
            else if(d.tier==2){
                var g = devs[d.ind].gads;
                g.forEach(function (gad) {
                    var index = gads[gad].node;
                    nodes[index].isShow=!nodes[index].isShow;
                });
                edges.forEach(function (l) {
                    if(l.source.index==i)
                        l.isShow=!l.isShow;
                })
                restart();
            }
        })
        .on("mouseover",function(d){

            if(d.tier==2){
                var dev = devs[d.ind];
                var addr = dev.net.address.permanent.split('/');
                var permAddr=addr[0];
                var model= addr[1] ? addr[1]:dev.attrs.model;

                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                $('.type').text('-');
                $('.value').text('-');
                $('.unit').text('-');
                $('.netcore').html('<b>Netcore:</b>'+dev.netcore);
                $('.status').html('<b>Status:</b>'+d.status);
                $('.gadId').html('<b>Id:</b>'+dev.id);
                $('.model').html('<b>Model:</b>'+model);
                $('.addr').html('<b>permAddr:</b>'+permAddr);

                div.style("left", d.x+ width / 2+50+400+'px')
                    .style("top", d.y+ height / 2+'px');

            }else if(d.tier==3){
                var gad = gads[d.ind];
                var dev = devs[gad.dev.id];
                var addr = dev.net.address.permanent.split('/');
                var permAddr=addr[0];
                var model= addr[1] ? addr[1]:dev.attrs.model;
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                $('.type').text(gad.panel.classId);
                if(gad.panel.classId=='accelerometer'){
                    $('.value').css("font-size", "12px");
                    $('.value').text(gad.attrs.Value.xValue+','+gad.attrs.Value.yValue+','+gad.attrs.Value.zValue);
                }else {
                    $('.value').css("font-size", "20px");
                    $('.value').text(gad.attrs.Value);
                }
                $('.unit').text(gad.attrs.units);
                $('.netcore').text(gad.netcore);
                $('.status').text(d.status);
                $('.gadId').text(gad.id);
                $('.model').text(model);
                $('.addr').text(permAddr);

                div.style("left", d.x+ width / 2+50+400+'px')
                    .style("top", d.y+ height / 2+'px');
            }else return;

            if(!dev) return;

        })
        .on("mouseout",function(d){
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .merge(node)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    svg.selectAll(".nodetext").remove();
    nT.exit().remove();
    nT = g.append("g").attr("stroke", "#000000")
        .attr("stroke-width", 1).selectAll(".nodetext")
        .data(nodes.filter(function(d){return d.isShow;}))
        .enter()
        .append("text")
        .attr('fill',function (d) {
            if(d.status =='online') return '#FFFFFF';
            else return '#2c2424';
        })
        .attr("class","nodetext")
        .attr('font','monospace')
        .attr("dx",function (d) {
            if(d.value){
                if(d.value.hasOwnProperty('xValue')){
                    return  -30;
                }else return -15;
            }
        })
        .attr("dy",30)
        .text(function(d){
            if(d.value){
                if(d.value.hasOwnProperty('xValue')){
                    return  d.value.xValue+','+
                        d.value.yValue+','+
                        d.value.zValue;
                }else return d.value.toString();
            }

        });

    simulation.nodes(nodes);
    simulation.force("link").links(edges);
    simulation.alpha(1).restart();
} // redraw the force

function ticked() {
    nT.attr("x", function(d) { return d.x + width/2; })
        .attr("y", function(d) { return d.y + height/2;})
        .text(function (d) {
            if(d.value){
                if(d.value.hasOwnProperty('xValue')){
                    return  d.value.xValue+','+
                            d.value.yValue+','+
                            d.value.zValue;
                }else return d.value.toString();
            }
        });
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .style("stroke",function (d) {
            if(((d.value>d.Max)&&d.Max!=null||(d.value<d.Min)&&d.Min!=null))return '#c20000';
            else if(d.status =='online') return '#06a900';
            else return '#ff8000';
        });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; }).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
} // force update when ticked

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
} // mouse drag start event

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}  // mouse draging event

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
} // mouse drag end event

d3.select("#myModal .tip").remove();
var div_tootip = d3.select("#myModal").append("div")
    .attr("class", "tip")
    .style("opacity", 0);

function drawDay() {
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 750 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var path,circle;
    var scaleX = d3.scaleTime().range([0,width]);
    var scaleY = d3.scaleLinear().range([height,0]);

    var gad = gads[observeGad],
        gadType = gad.panel.classId;
    var limitMax=nodes[gad.node].Max,limitMin=nodes[gads[observeGad].node].Min;

    var zoom = d3.zoom().on("zoom",function (){
            if(selected!=1){
                gX.call(axisX.scale(d3.event.transform.rescaleX(scaleX)));
                var new_x = d3.event.transform.rescaleX(scaleX);
                s.selectAll("circle").data(data)
                    .attr("cx",function(d){
                        var newX=new_x(d.updated);
                        if(newX>0)return newX;
                    });
                }
        });

    var valueline = d3.line()
        .x(function(d) { return scaleX(d.updated); })
        .y(function(d) { return scaleY(d.Value); })
        .curve(d3.curveMonotoneX);

    d3.select('.chartDiv svg').remove();
    var s = d3.select('.chartDiv').append("svg").attr('class','chart')
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    d3.select('.modal-body .chart').call(zoom);
    var max = d3.max(data, function(d) { return d.updated; });
    var min = d3.min(data, function(d) { return d.updated; });
    scaleX.domain([min,max]);
    var minY=d3.min(data, function(d) {
        if(d.Value.hasOwnProperty('xValue')){
            return parseFloat(d.Value.xValue);
        }else if(d.Value.hasOwnProperty('yValue')){
            return parseFloat(d.Value.yValue);
        }else if(d.Value.hasOwnProperty('zValue')){
            return parseFloat(d.Value.zValue);
        }return d.Value;
    }),maxY=d3.max(data, function(d) {
        if(d.Value.hasOwnProperty('xValue')){
            return parseFloat(d.Value.xValue);
        }else if(d.Value.hasOwnProperty('yValue')){
            return parseFloat(d.Value.yValue);
        }else if(d.Value.hasOwnProperty('zValue')){
            return parseFloat(d.Value.zValue);
        }else return d.Value;
    });
    if(limitMin){
        if(parseFloat(limitMin)<minY)
            minY=limitMin;
    }
    if(limitMax){
        console.log(limitMax+'  '+maxY);
        if(parseFloat(limitMax)>maxY)
            maxY=limitMax;
        console.log(maxY);
    }
    scaleY.domain([minY,maxY]);

    if(selected==1){
        if(gadType=='accelerometer'){
            var data_x=[],data_y=[],data_z=[];
            data.forEach(function (d) {
                if(d.Value.hasOwnProperty('xValue')){
                    data_x.push(d);
                }else if(d.Value.hasOwnProperty('yValue')){
                    data_y.push(d);
                }else {
                    data_z.push(d);
                }
            });
            var valuelineX = d3.line()
                .x(function(d) { return scaleX(d.updated); })
                .y(function(d) { return scaleY(parseFloat(d.Value.xValue)); })
                .curve(d3.curveMonotoneX);

            var valuelineY = d3.line()
                .x(function(d) { return scaleX(d.updated); })
                .y(function(d) { return scaleY(parseFloat(d.Value.yValue)); })
                .curve(d3.curveMonotoneX);

            var valuelineZ = d3.line()
                .x(function(d) { return scaleX(d.updated); })
                .y(function(d) { return scaleY(parseFloat(d.Value.zValue)); })
                .curve(d3.curveMonotoneX);

            s.append("path")
                .data([data_x])
                .attr("class", "line")
                .attr("d", valuelineX)
                .attr("fill", 'none')
                .attr('stroke',function (d) {
                    return "#09c";
                });

            s.append("path")
                .data([data_y])
                .attr("class", "liney")
                .attr("d", valuelineY)
                .attr("fill", 'none')
                .attr('stroke',function (d) {
                    return "#228b22";
                });

            s.append("path")
                .data([data_z])
                .attr("class", "linez")
                .attr("d", valuelineZ)
                .attr("fill", 'none')
                .attr('stroke',function (d) {
                    return "#9b7cac";
                });

            if(limitMax!=null){
                s.append('line')
                    .attr('x1',0)
                    .attr('y1',scaleY(limitMax))
                    .attr('x2',width)
                    .attr('y2',scaleY(limitMax))
                    .style("stroke",function(d){return '#C20000';})
                    .style("stroke-width",1)
            }

            if(limitMin!=null){
                s.append('line')
                    .attr('x1',0)
                    .attr('y1',scaleY(limitMin))
                    .attr('x2',width)
                    .attr('y2',scaleY(limitMin))
                    .style("stroke",function(d){return '#c20000';})
                    .style("stroke-width",1)
            }
        }else{
            path = s.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline)
                .attr("fill", 'none')
                .attr('stroke',function (d) {
                    return "#09c";
                });

            if(limitMax!=null){
                s.append('line')
                    .attr('x1',0)
                    .attr('y1',scaleY(limitMax))
                    .attr('x2',width)
                    .attr('y2',scaleY(limitMax))
                    .style("stroke",function(d){return '#C20000';})
                    .style("stroke-width",1)
            }

            if(limitMin!=null){
                s.append('line')
                    .attr('x1',0)
                    .attr('y1',scaleY(limitMin))
                    .attr('x2',width)
                    .attr('y2',scaleY(limitMin))
                    .style("stroke",function(d){return '#c20000';})
                    .style("stroke-width",1)
            }
        }

    }else {
        if(gadType=='accelerometer'){

            s.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .style("stroke", "none")
                .style("fill", function (d) {
                    if(d.Value.hasOwnProperty('xValue')){
                        if ((limitMax != null && d.Value.xValue > limitMax) || (limitMin != null && d.Value.xValue < limitMin))
                            return '#c20000';
                        else return "#09c";
                    }else if(d.Value.hasOwnProperty('yValue')){
                        if ((limitMax != null && d.Value.yValue > limitMax) || (limitMin != null && d.Value.yValue < limitMin))
                            return '#c20000';
                        else return "#228b22";
                    }else {
                        if ((limitMax != null && d.Value.zValue > limitMax) || (limitMin != null && d.Value.zValue < limitMin))
                            return '#c20000';
                        else return "#9b7cac";
                    }
                })
                .attr("r", 1)
                .attr("cx", function (d) {
                    return scaleX(d.updated);
                })
                .attr("cy", function (d) {
                    if(d.Value.hasOwnProperty('xValue')){
                        return d.Value.xValue;
                    }else if(d.Value.hasOwnProperty('yValue')){
                        return d.Value.yValue;
                    }else {
                        return d.Value.zValue;
                    }
                })
                .on("mouseover", function (d) {

                    var v ;
                    if(d.Value.hasOwnProperty('xValue')){
                        v=d.Value.xValue;
                    }else if(d.Value.hasOwnProperty('yValue')){
                        v=d.Value.yValue;
                    }else {
                        v=d.Value.zValue;
                    }

                    div_tootip.transition()
                        .duration(200)
                        .style("opacity", .9);

                    div_tootip.html(
                        d.updated.getHours() + ":" + d.updated.getMinutes() + ":" + d.updated.getSeconds() + "<br/>" +
                        'Value:' + v);

                    div_tootip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                })
                .on("mouseout", function (d) {
                    div_tootip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });


        }else {
            var circle = s.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .style("stroke", "none")
                .style("fill", function (d) {
                    if ((limitMax != null && d.Value > limitMax) || (limitMin != null && d.Value < limitMin))
                        return '#c20000';
                    else return "#09c";
                })
                .attr("r", 1)
                .attr("cx", function (d) {
                    return scaleX(d.updated);
                })
                .attr("cy", function (d) {
                    return scaleY(d.Value);
                })
                .on("mouseover", function (d) {
                    var str = d.Value.split('.');
                    if (str[1])
                        str[1] = str[1].slice(0, 4);
                    div_tootip.transition()
                        .duration(200)
                        .style("opacity", .9);

                    div_tootip.html(
                        d.updated.getHours() + ":" + d.updated.getMinutes() + ":" + d.updated.getSeconds() + "<br/>" +
                        'Value:' + str[0] + (str[1] ? '.' + str[1] : ''));

                    div_tootip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");

                })
                .on("mouseout", function (d) {
                    div_tootip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }
    }

    var axisX=d3.axisBottom(scaleX),
        axisY=d3.axisLeft(scaleY);

    var gX=s.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axisX);

    var gY=s.append("g")
        .call(axisY);

    s.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    s.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(gads[observeGad].attrs.units);
} // draw the chart

function reqData(index){
    reqIng = true;
    var transaction = db.transaction(['Data'], 'readonly');
    var objectStore = transaction.objectStore('Data');
    var myIndex = objectStore.index('updated');
    var cnt = 0;
    data=[];
    myIndex.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if(index==cursor.value.gid) {
                var d = timeZone(cursor.value.updated);
                data[cnt]={
                    gid: cursor.value.gid,
                    Value:cursor.value.Value,
                    Unit:cursor.value.Unit,
                    Type:cursor.value.Type,
                    updated: d
                }
                cnt++;
            }
            cursor.continue();
        } else {
            drawDay();
            reqIng = false;
        }
    }

} // load datas from indexDB

function timeZone(date){
    var d = new Date(date);
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000*8));
} // format the date to UTC+8


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  api                                                               //                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function logging(msg){
    var text = $('.log');
    text.val(text.val() + msg+'\n');
    text.scrollTop(text[0].scrollHeight);
}  //console log funtion

function getAttrType(gadType) {
    switch (gadType) {
        case 'presence':
            return 'dInState';
            break;
        case 'pwrCtrl':
            return 'onOff';
            break;
        case 'multistateSelector':
            return 'mStateIn';
            break
        case 'dIn':
            return 'dInState';
            break;
        case 'aIn':
            return 'aInCurrValue';
            break;
        case 'accelerometer':
            break;
        default:
            return 'sensorValue';
            break;
    }
}  //get gad attr type

function getImg(gadType) {
    switch (gadType) {
        case 'temperature':
            return './icon/gad/thermometer.jpg';
            break;
        case 'humidity':
            return './icon/gad/humidity.jpg';
            break;
        case 'illuminance':
            return './icon/gad/illuminance.jpg';
            break
        case 'barometer':
            return './icon/gad/barometer.jpg';
            break;
        case 'loudness':
            return './icon/gad/decibelmeter.jpg';
            break;
        case 'concentration':
            return './icon/gad/concentration.jpg';
            break;
        case 'aIn':
            return './icon/gad/analog.jpg';
            break;
        case 'dIn':
            return './icon/gad/digital.jpg';
            break;
        case'accelerometer':
            return './icon/gad/rotate.jpg';
            break;
        default:
            return '';
            break;
    }
} //get dev/gad img path