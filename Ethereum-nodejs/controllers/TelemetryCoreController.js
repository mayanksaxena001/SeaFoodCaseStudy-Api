var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config');

var artifacts = require('../bin/truffle/latest/contracts/TelemetryCore.json');
var TelemetryCoreContract = contract(artifacts);
var Util = require('./Util');

var {
    assetTransferContract
} = require('../controllers/AssetTransferController');
var sensorUpdate = new Array();
var sensorAdd = new Array();
var sensorTelemetry = new Array();
class TelemetryCoreController {
    constructor() {
        try {
            if (contractConfig.isWeb3Connected()) {
                this._web3 = contractConfig._web3;
                this.TelemetryCoreContract = TelemetryCoreContract;
                this.init();
            } else {
                console.error("Web3 not connected to any ethereum node over HTTP");
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async init() {
        this.TelemetryCoreContract.setProvider(this._web3.currentProvider)
        this.TelemetryCoreContract.setNetwork(contractConfig.NETWORK_ID);
        this._instance = await this.TelemetryCoreContract.at(contractConfig.CONTRACT_ADDRESS.TelemetryCoreContract);
        this._accounts = await this._web3.eth.accounts;
        // this._web3.eth.defaultAccount = this._accounts[0];
        this._gas = {
            from: this._accounts[0],
            gas: contractConfig.getGasLimit() //9000000000000
        }
        this._logSensorAddedEvent = await this._instance.LogSensorAddedEvent();
        this._logSensorTelemetryEvent = await this._instance.LogSensorTelemetryEvent();
        this._logSensorUpdateEvent = await this._instance.LogSensorUpdateEvent();

        this.toConsole("LogSensorAddedEvent", this._logSensorAddedEvent);
        this.toConsole("LogSensorTelemetryEvent", this._logSensorTelemetryEvent);
        this.toConsole("LogSensorUpdateEvent", this._logSensorUpdateEvent);

        this.watch(this._logSensorAddedEvent);
        this.watch(this._logSensorTelemetryEvent);
        this.watch(this._logSensorUpdateEvent);

    }

    watch(event) {
        event.watch(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Event ## ", result);
            if (result.event == 'LogSensorAddedEvent') {
                sensorAdd.push(result.args);
            } else if (result.event == 'LogSensorTelemetryEvent') {
                sensorTelemetry.push(result.args);
            } else if (result.event == 'LogSensorUpdateEvent') {
                sensorUpdate.push(result.args);
            }
        });
    }

    logError(err) {
        console.error(err);
    }
    toConsole(param, msg) {
        console.log(param + " : ", msg);
    }

    async addSensor(_address, _name, _username) {
        if (!_address || !_name || !_username) {
            throw new Error("missing details");
        }
        await this._instance.addSensor(_address, _name, _username, this._gas);
    }

    async getSensors(_address) {
        if (!_address) {
            throw new Error("Unknown address ");
        }
        var sensors = new Array();
        var arr = await this._instance.getSensorsByAddress(_address, this._gas);
        for (var i = 0; i < arr.length; i++) {
            var sensor = await this.getSensorById(arr[i]);
            sensors.push(sensor);
        }
        return sensors;
    }

    async getSensorById(_id) {
        if (!_id) {
            throw new Error("Empty Asset id provided");
        }
        var _sensor = await this._instance.getSensorById(_id, this._gas);
        var sensor = {};
        sensor.id = _sensor[0];
        sensor.trackId = _sensor[1];
        sensor.address = _sensor[2];
        sensor.name = _sensor[3];
        sensor.status = _sensor[4];
        sensor.createdAt = Util.formatDate(_sensor[5]);
        sensor.updatedAt = Util.formatDate(_sensor[6]);
        try{
            var user = await assetTransferContract.getUserByAddress(_sensor[2]);
            sensor.supplierName = user[0];
        }catch(err){console.log(err)}
        return sensor;
    }

    async getSensorTelemetries(_id) {
        if (!_id) {
            throw new Error("Empty Id ");
        }
        var telemetries = new Array();
        var arr = await this._instance.getSensorTelemetries(_id);
        for (var i = 0; i < arr.length; i++) {
            var telemetry = await this.getTelemetryById(arr[i]);
            telemetries.push(telemetry);
        }
        return telemetries;
    }

    async getTransactionTelemetries(_id) {
        if (!_id) {
            throw new Error("Empty Id ");
        }
        var telemetries = new Array();
        var arr = await this._instance.getTransactionTelemetries(_id);
        for (var i = 0; i < arr.length; i++) {
            var telemetry = await this.getTelemetryById(arr[i]);
            telemetries.push(telemetry);
        }
        return telemetries;
    }

    async getTelemetryById(_id) {
        if (!_id) {
            throw new Error("Empty Asset id provided");
        }
        var _telemetry = await this._instance.getTelemetryById(_id, this._gas);
        var telemetry = {};
        telemetry.id = _telemetry[0];
        telemetry.sensorId = _telemetry[1];
        telemetry.weight = _telemetry[2].toNumber();
        telemetry.temperature = _telemetry[3].toNumber();
        telemetry.latitude = _telemetry[4];
        telemetry.longitude = _telemetry[5];
        telemetry.place = _telemetry[6];
        telemetry.updatedAt = Util.formatDate(_telemetry[7]);
        return telemetry;
    }

    async updateSensorTelemetry(_sensorId,
        _weight,
        _temperature,
        _latitude,
        _longitude,
        _place) {
        if (!_sensorId || !_place || !_latitude || !_longitude) {
            throw new Error("Insufficient Information");
        }
        var transaction = await this._instance.updateSensorTelemetry(_sensorId,
            _weight,
            _temperature,
            _latitude,
            _longitude,
            _place, this._gas);
        // asset.address = _address;
        return transaction;
    }

    async getSensorUpdateEvent() {
        return sensorUpdate;
    }

    async getSensorAddedEvent() {
        return sensorAdd;
    }

    async getSensorTelemetryUpdateEvent() {
        return sensorTelemetry;
    }

}
var telemetryContract = new TelemetryCoreController();
module.exports = {
    telemetryContract
}