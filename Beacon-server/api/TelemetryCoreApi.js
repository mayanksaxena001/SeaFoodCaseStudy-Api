var {
    telemetryContract
} = require('../controllers/TelemetryCoreController');
var _contract = telemetryContract;
module.exports = {
    default_req(req, res, callback) {
        console.log('default gateway | Telemetry ContractApi : ', req.method, req.url);
        callback();
    },

    validation_req(req, res, callback, id) {
        console.log('Doing id validations on ' + id);
        req.id = id;
        callback();
    },

    async getSensorUpdateEvent(req, res) {
        try {
            var events = await _contract.getSensorUpdateEvent();
            return res.status(200).send(events);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getSensorAddedEvent(req, res) {
        try {
            var events = await _contract.getSensorAddedEvent();
            return res.status(200).send(events);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getSensorTelemetryEvent(req, res) {
        try {
            var events = await _contract.getSensorTelemetryUpdateEvent();
            return res.status(200).send(events);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getSensors(req, res) {
        try {
            var sensors = await _contract.getSensors(req.decoded.account);
            return res.status(200).send(sensors);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    // bytes32 _id
    async getSensorById(req, res) {
        try {
            var asset = await _contract.getSensorById(req.id);
            return res.status(200).send(asset);
        } catch (err) {
            return res.status(500).send(err);

        }
    },
     // bytes32 _id
     async getTelemetryById(req, res) {
        try {
            var telemetry = await _contract.getTelemetryById(req.id);
            return res.status(200).send(telemetry);
        } catch (err) {
            return res.status(500).send(err);

        }
    },

    async getSensorTelemetries(req, res) {
        try {
            var telemetries = await _contract.getSensorTelemetries(req.id);
            return res.status(200).send(telemetries);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getTransactionTelemetries(req, res) {
        try {
            var telemetries = await _contract.getTransactionTelemetries(req.id);
            return res.status(200).send(telemetries);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async UpdateSensorTelemetry(req, res) {
        try {
            var _sensorId = req.body.sensorId;
            var _temp = req.body.temperature;
            var _latitude = req.body.latitude;
            var _longitude = req.body.longitude;
            var _location = req.body.place;
            var _weight = req.body.weight;
            var transaction = await _contract.updateSensorTelemetry(_sensorId, _weight, _temp, _latitude, _longitude, _location); //
            return res.status(200).send(transaction);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

};