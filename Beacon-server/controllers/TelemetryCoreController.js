var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config');

var artifacts = require('../bin/truffle/latest/contracts/TelemetryCore.json');
var TelemetryCoreContract = contract(artifacts);

// var UserRepository = require('../mysql/db/user.repository');
// const repo = new UserRepository();

var sensorUpdate = new Array();
var sensorAdd = new Array();
var sensorTelemetry = new Array();
class TelemetryCoreController {
    constructor() {
        this._web3 = contractConfig._web3;
        this.TelemetryCoreContract = TelemetryCoreContract;
        this.init();
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
            }
            else if (result.event == 'LogSensorTelemetryEvent') {
                sensorTelemetry.push(result.args);
            }
            else if (result.event == 'LogSensorUpdateEvent') {
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

    isWeb3Connected() {
        return this._web3.isConnected();
    }

    async getSensors(_address) {
        if (!_address) {
            throw new Error("Unknown address ");
        }
        var sensors = new Array();
        var arr = await this._instance.getSensorsByAddress(_address,this._gas);
        for(var i =0 ;i<arr.length;i++){
            var sensor = await this.getSensorById(arr[i]);
            sensors.push(sensor);
        }
        return sensors;
    }

    async getSensorById(_id) {
        if (!_id) {
            throw new Error("Empty Asset id provided");
        }
        var sensor = await this._instance.getSensorById(_id, this._gas);
        // asset.address = _address;
        return sensor;
    }

    async getSensorTelemetries(_id) {
        if (!_id) {
            throw new Error("Empty Id ");
        }
        var telemetries = new Array();
        var arr = await this._instance.getSensorTelemetries(_id);
        for(var i =0 ;i<arr.length;i++){
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
        for(var i =0 ;i<arr.length;i++){
            var telemetry = await this.getTelemetryById(arr[i]);
            telemetries.push(telemetry);
        }
        return telemetries;
    }

    async getTelemetryById(_id) {
        if (!_id) {
            throw new Error("Empty Asset id provided");
        }
        var telemetry = await this._instance.getTelemetryById(_id, this._gas);
        // asset.address = _address;
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