var mosca = require('mosca');
var MqttSubscriber = require('./mqtt.client');
const USERNAME = 'mayank';
const PASSWORD = 'secret';
module.exports = (host, port) => {
    const URL = 'mqtt://' + host + ':' + port;
    var settings = {
        port: port,
    };
    var server = new mosca.Server(settings);

    // Accepts the connection if the username and password are valid
    var authenticate = function (client, username, password, callback) {
        var authorized = (username === USERNAME && password.toString() === PASSWORD);
        if (authorized) client.user = username;
        callback(null, authorized);
    }

    var authorizePublish = function (client, topic, payload, callback) {
        callback(null, client.user == topic.split('/')[1]);
    }

    var authorizeSubscribe = function (client, topic, callback) {
        callback(null, client.user == topic.split('/')[1]);
    }
    //here we start mosca
    server.on('ready', () => {
        console.log('Mosca server is up and running on port ', port);
        // fired when the mqtt server is ready
        // server.authenticate = authenticate;
        // server.authorizePublish = authorizePublish;
        // server.authorizeSubscribe = authorizeSubscribe;
        MqttSubscriber(URL, 'IOT-RECEIVER--1', 'sensor/device/#');
    });
    // fired whena  client is connected
    server.on('clientConnected', function (client) {
        console.log('clientConnected :', client.id);
    });
    // fired when a message is received
    // server.on('published', function (packet, client) {
    //     console.log('Published : ', packet.payload.toString("utf-8"));
    // });
    // fired when a client subscribes to a topic
    server.on('subscribed', function (topic, client) {
        console.log('Subscribed : ', topic);
    });
    // fired when a client subscribes to a topic
    server.on('unsubscribed', function (topic, client) {
        console.log('unsubscribed : ', topic);
    });
    // fired when a client is disconnecting
    server.on('clientDisconnecting', function (client) {
        console.log('clientDisconnecting : ', client.id);
    });
    // fired when a client is disconnected
    server.on('clientDisconnected', function (client) {
        console.log('clientDisconnected : ', client.id);
    });
}