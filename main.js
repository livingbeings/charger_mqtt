var exec =require('child_process').exec
var mqtt = require('mqtt')
, host = 'your_ip'
, port = '2930';

var settings = {
keepalive: 1000,
protocolId: 'MQIsdp',
protocolVersion: 3,
clientId: 'clientid',
username:'username',
password: 'password'
};

// client connection
var client = mqtt.connect('mqtt://'+host+':'+port, settings);
var topic = 'Charger'
var battery_level=0,battery_status=''
var battery_target
if (typeof (process.argv.slice(2)[0])!='undefined')
    battery_target=Number(process.argv.slice(2)[0])
else
    battery_target=101

client.on('connect', ()=>{
    setInterval(()=>{
        exec('termux-battery-status',(err,out,der)=>{
            battery_level=JSON.parse(out).percentage
            battery_status=JSON.parse(out).status
            if (battery_level>=battery_target||battery_status=="FULL"){
               client.publish(topic,0)
               process.exit()
            }
        })
        console.log(battery_level)
    }, 5000)
})
