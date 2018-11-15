var mqtt = require('mqtt');
var {
    telemetryContract
} = require('../controllers/TelemetryCoreController');
// var _contract = require('../controllers/StateContractController');
var updateSensor = async (id, message) => {
    await telemetryContract.updateSensorTelemetry(id,message.weight,message.temp,message.latitude, message.longitude, message.location);
}
module.exports = (url, name, topic) => {
    var client = mqtt.connect(url, {
        clean: false,
        clientId: name
    })

    client.on('connect', () => {
        console.log('Receiver/Subscriber connected...', name);
    });

    client.on('message', function (topic, message) {
        //TODO store data
        var sensorId = topic.split('/')[2];
        var msg = JSON.parse(message.toString('utf8'));
        updateSensor(sensorId, msg);
        console.log("RECEIVER/SUBSCRIBER :", sensorId, msg);

    })
    /*** client on close ***/
    client.on("close", function () {
        console.log("client is closed");
    })
    /*** client on offline ***/
    client.on("offline", function (err) {
        console.log("client is offline");
    });

    /** subscribe to a topic */
    client.subscribe(topic, {
        qos: 1
    }, (err, granted) => {
        if (err)
            console.log(err);
        else
            console.log("client connected : ", granted);
    });

    // setTimeout(() => {
    //     client.unsubscribe(topic + '101');
    // }, 15000);


}