// var SeaFoodContractApi = require('../api/SeaFoodContractApi');
// var StateContractApi = require('../api/StateContractApi');
var TelemetryCore = require('../api/TelemetryCoreApi');
var auth = require('../controllers/AuthController');
var express = require('express');
const router = express.Router();
router.use('/', auth.checkToken, auth.isWeb3Connected);
router.param('id', TelemetryCore.validation_req);
router.post('/', TelemetryCore.addSensor); //add sensor here
router.put('/', TelemetryCore.UpdateSensorTelemetry);
router.get('/', TelemetryCore.getSensors);
router.get('/:id', TelemetryCore.getSensorById);
router.get('/telemetry/:id', TelemetryCore.getTelemetryById);
router.get('/telemetries/:id', TelemetryCore.getSensorTelemetries);
router.get('/transaction/telemetries/:id', TelemetryCore.getTransactionTelemetries);
router.get('/location/track', TelemetryCore.track);
// router.post('/state/sensor/attach',StateContractApi.attachSensor);
module.exports = router;