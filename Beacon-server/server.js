var express = require('express');
var morgan = require('morgan');
var dotenv = require('dotenv');
var path = require('path');
var expressConfig = require('./config/express');
var config = require('./config/config.json');
var router = require('./routes/router');
var MqttBroker = require('./iot-controllers/mqtt.broker');
const env = process.env.NODE_ENV || "development";

class Server {
    constructor() {
        this.app = express();
        this.config = config[env];
        this.init();
    }

    init() {
        dotenv.load();
        // HTTP request logger
        this.app.use(morgan('dev'));

        this.app.use(express.static(path.join(__dirname, '/public')));
        // express settings
        expressConfig(this.app);
        //router settings
        router(this.app);
        // start server
        this.app.listen(this.config.port, () => {
            // connect to database
            console.log(`[Server] listening on port ${this.config.port}`);
            //start mosca server
            MqttBroker(this.config.host, this.config.mqttport);
        });
    }
}
module.exports = new Server().app;