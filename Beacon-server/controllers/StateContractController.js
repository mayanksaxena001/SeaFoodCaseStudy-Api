var contract = require('truffle-contract');
var contract_id = require('../config/contract_id');
var {
  _web3
} = require('./Contract');
var artifacts = require('../../Ethereum-nodejs/truffle/build/contracts/StateContract.json');
var StateContract = contract(artifacts);
StateContract.setProvider(_web3.currentProvider)
class StateContractController {
  constructor() {
    this.StateContract = StateContract;
    this._web3 = _web3;
    this.init();
  }

  async init() {
    // this.StateContract.setProvider(this._web3.currentProvider);
    this.StateContract.setNetwork(2134)
    this._instance = await this.StateContract.at(contract_id.StateContract);
    this._accounts = await _web3.eth.accounts;
    this._gas = {
      from: this._accounts[0],
      gas: 9000000000000
    }
    //work around for truffle issue
  }

  async addSensor(_name) {
    if (!_name) {
      throw new Error("Missing Name");
    }
    return await this._instance.addSensor(_name, this._gas);
  }

  async getAllSensors() {
    try {
      var _count = await this._instance.getSensorsCount(this._gas);
      var _sensors = [];
      for (var i = 0; i < _count; i++) {
        _sensors.push(await this._instance.getSensorByIndex(i, this._gas));
      }
      return _sensors;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getSensorByIndex(_index) {
    if (_index < 0) {
      throw new Error("Missing Name");
    }
    return await this._instance.getSensorByIndex(_index, this._gas);
  }

  async getSensorName(_sensorId) {
    if (!_sensorId) {
      throw new Error("Misiing Name");
    }
    return await this._instance.getSensorName(_sensorId, this._gas);
  }

  async getLocation(_id) {
    if (!_id) {
      throw new Error("Missing Name");
    }
    return await this._instance.getLocation(_id, this._gas);
  }

  async attachSensor(_sensorId, _senderEntityId, _buyerEntityId,
    _weight,
    _quantity,
    _place,
    _latitude,
    _longitude,
    _date,
    _amount) {
    return await this._instance.attachSensor(_sensorId, _senderEntityId, _buyerEntityId,
      _weight,
      _quantity,
      _place,
      _latitude,
      _longitude,
      _date,
      _amount, this._gas);
  }

  async updateSensor(_sensorId, _latitude, _longitude, _location, _temp) {
    if (!_sensorId || !_latitude || !_temp ||
      !_longitude || !_location) {
      throw new Error("Missing Details");
    }
    return await this._instance.updateSensor(_sensorId, _latitude, _longitude, _location, _temp, this._gas);
  }

  async getTransactionStateByIndex(_index) {
    if (_index < 0) {
      throw new Error("Missing Index");
    }
    return await this._instance.getTransactionStateByIndex(_index, this._gas);
  }

  async getTransactionInfo(_stateId) {
    if (!_stateId) {
      throw new Error("Missing Id");
    }
    return await this._instance.getTransactionInfo(_stateId, this._gas);
  }

  async getTelemetryInfo(_telementryId) {
    if (!_telementryId) {
      throw new Error("Missing Id");
    }
    return await this._instance.getTelemetryInfo(_telementryId, this._gas);
  }

  async getSensorTelemetryCount(_sensorId) {
    if (!_sensorId) {
      throw new Error("Missing Id");
    }
    return await this._instance.getSensorTelemetryCount(_sensorId, this._gas);
  }

  async getSensorTelemetry(_sensorId, _index) {
    if (!_sensorId || _index < 0) {
      throw new Error("Missing Data");
    }
    return await this._instance.getSensorTelemetry(_sensorId, _index, this._gas);
  }

  async getTransactState(_stateId) {
    if (!_stateId) {
      throw new Error("Missing Id");
    }
    return await this._instance.getTransactState(_stateId, this._gas);
  }

  async getEntityStateId(_entityId) {
    if (!_entityId) {
      throw new Error("Missing Id");
    }
    return await this._instance.getEntityStateId(_entityId, this._gas);
  }

  async deleteTelemetryInfo(_telementryId) {
    if (!_telementryId) {
      throw new Error("Missing Id");
    }
    return await this._instance.deleteTelemetryInfo(_telementryId, this._gas);
  }

  async deleteTransactionState(_stateId) {
    if (!_stateId) {
      throw new Error("Missing Id");
    }
    return await this._instance.deleteTransactionState(_stateId, this._gas);
  }

  async createId(_address, _name) {
    try {
      return await this._instance.createId(_address, _name, this._gas);
    } catch (err) {
      throw new Error(err);
    }
  }
}
var _stateContract = new StateContractController();
module.exports = {
  _stateContract
}