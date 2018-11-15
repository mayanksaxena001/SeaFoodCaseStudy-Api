import { deprecate } from 'util';

var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config');

var artifacts = require('../truffle/build/contracts/SeaFoodContract.json');
var SeaFoodContract = contract(artifacts);

var transactionData = [];
@deprecate
class ContractController {
  constructor() {
    this._web3 = contractConfig._web3;
    this.SeaFoodContract = SeaFoodContract;
    this.init();
  }

  async init() {
    //work around for truffle issue
    // if (typeof this.SeaFoodContract.currentProvider.sendAsync !== "function") {
    //   var _contract = this.SeaFoodContract;
    //   this.SeaFoodContract.currentProvider.sendAsync = function () {
    //     return _contract.currentProvider.send.apply(
    //       _contract.currentProvider, arguments
    //     );
    //   };
    // }
    this.SeaFoodContract.setProvider(this._web3.currentProvider)
    this.SeaFoodContract.setNetwork(contractConfig.NETWORK_ID);
    this._instance = await this.SeaFoodContract.at(contractConfig.CONTRACT_ADDRESS.SeaFoodContract);
    this._accounts = await this._web3.eth.accounts;
    // this._web3.eth.defaultAccount = this._accounts[0];
    this._gas = {
      from: this._accounts[0],
      gas: contractConfig.getGasLimit() //9000000000000
    }
    this._transactionEvent = await this._instance.Transaction();
    this._logNewEntityEvent = await this._instance.LogNewEntity();
    this._logUpdateEntityEvent = await this._instance.LogUpdateEntity();
    this._logNewUserEvent = await this._instance.LogNewUser();
    this.toConsole("Transaction", this._transactionEvent);
    this.watch(this._transactionEvent);
    this.toConsole("logNewEntityEvent", this._logNewEntityEvent);
    this.toConsole("LogUpdateEntityEvent", this._logUpdateEntityEvent);
    this.toConsole("LogNewUserEvent", this._logNewUserEvent);
    this.watch(this._logNewEntityEvent);
    this.watch(this._logUpdateEntityEvent);
    this.watch(this._logNewUserEvent);
  }

  watch(event) {
    event.watch(function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Event ", result);
    });
  }
  logError(err) {
    console.error(err);
  }
  toConsole(param, msg) {
    console.log(param + ": ", msg);
  }

  isWeb3Connected() {
    return this._web3.isConnected();
  }

  async addAsFisherMan(_address, _username) {
    if (!_address || !_username) {
      throw new Error("missing details");
    }
    await this._instance.addAsFisherMan(_address, _username, this._gas);
  }

  async addAsBuyer(_address, _username) {
    await this._instance.addAsBuyer(_address, _username, this._gas);
  }

  async addAsRestaurantOwner(_address, _username) {
    await this._instance.addAsRestaurantOwner(_address, _username, this._gas);
  }

  async insertUser(_address, _username, _type) {
    if (!_address || !_username || !_type) {
      throw new Error("Missing details");
    }
    if (_type == "Admin") {
      return new Error("Not allowed !");
    } else if (_type == "Fisherman") {
      return await this.addAsFisherMan(_address, _username);
    } else if (_type == "Buyer") {
      return await this.addAsBuyer(_address, _username);
    } else if (_type == "Restauranteur") {
      return await this.addAsRestaurantOwner(_address, _username);
    }
  }

  async getUser(_address) {
    if (!_address) {
      throw new Error("Unknown address ");
    }
    return await this._instance.getUser(_address, this._gas);
  }

  async addEntity(_address, _name, _value, _quantity) {
    if (!_address || !_name || !_value || !_quantity) {
      throw new Error("Missing details");
    }
    return await this._instance.addEntity(_address, _name, _value, _quantity, this._gas);
  }

  async getEntityByAddress(_address) {
    var _entities = new Array();
    if (!_address) {
      throw new Error("Unknown address ");
    }
    var _count = await this.getEntityCount(_address);

    for (var i = 0; i < _count; i++) {
      try {
        var _entity = await this._instance.getEntityByAddress(_address, i, this._gas);
        var entity = {};
        entity.id = _entity[0];
        entity.name = _entity[1];
        entity.value = _entity[2];
        entity.quantity = _entity[3];
        entity.username = _entity[4];
        entity.index = _entity[5];
        entity.stateId = _entity[6];
        entity.address = _address;
        _entities.push(entity); //entity is already alive
      } catch (err) {

      }
    }
    return _entities;
  }

  async getEntityById(_id) {
    if (!_id) {
      throw new Error("Empty id provided");
    }
    var _entity = await this._instance.getEntityById(_id, this._gas);
    var entity = {};
    entity.address = _entity[0];
    entity.name = _entity[1];
    entity.value = _entity[2];
    entity.quantity = _entity[3];
    entity.username = _entity[4];
    entity.index = _entity[5];
    entity.stateId = _entity[6];
    entity.id = _id;
    return entity;
  }

  async getEntityCount(_address) {
    if (!_address) {
      throw new Error("Unknown address ");
    }
    return await this._instance.getEntityCount(_address, this._gas);
  }

  async updateEntity(_address, _name, _value, _quantity, _index, _stateId) {
    if (!_address || !_name || !_value || !_quantity || _index < 0) {
      throw new Error("Missing details");
    }
    return await this._instance.updateEntity(_address, _name, _value, _quantity, _index, _stateId, this._gas);
  }

  async updateEntityStateId(_sender_entityId, buyer_entityId, _stateId) {
    if (!_sender_entityId || !buyer_entityId || !_stateId) {
      throw new Error("Missing details");
    }

    return await this._instance.updateEntityStateId(_sender_entityId, buyer_entityId, _stateId, this._gas);
  }

  getAccounts() {
    return this._accounts;
  }

  async transactEntities(_sender, _buyer, _name, _id, _quantity, _amount, _index) {
    try {
      if (_index < 0) {
        throw new Error('No Entity found!!');
      }
      return await this._instance.buyEntity(_sender, _buyer, _name, _id, _quantity, _amount, _index, this._gas);
    } catch (err) {
      throw new Error(err);
    }
  }

  async createNewAccount(_username, _password, _type) {
    try {
      let val = await this._web3.personal.newAccount(_password, this._gas);
      await this.insertUser(val, _username, _type);
      return val;
    } catch (err) {
      throw new Error(err);
    };
  }

  async createId(_address, _name, _username) {
    try {
      return await this._instance.createId(_address, _name, _username, this._gas);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTransactionHistory() {
    try {
      return await repo.getByAccountId(req.decoded.account);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllEntities(_address_) {
    try {
      var _count = await this.getUsersAddressCount();
      var _addressess = {
        Fisherman: [],
        Buyer: [],
        Restauranteur: []
      };
      for (var i = 0; i < _count; i++) {
        try {
          var _address = await this._instance.getUserAddressByIndex(i, this._gas);
          var _entities = await this.getEntityByAddress(_address);
          var _user = await _contract.getUser(_address);
          //entity is already alive
          for (var j = 0; j < _entities.length; j++) {
            _entities[j].address = _address;
            _entities[j].type = _user[1];
            if (_user && _address_ != _address) {
              if (_user[1] == "Fisherman") {
                _addressess.Fisherman.push(_entities[j]);
              } else if (_user[1] == "Buyer") {
                _addressess.Buyer.push(_entities[j]);
              } else if (_user[1] == "Restauranteur") {
                _addressess.Restauranteur.push(_entities[j]);
              }
            }
          }
          // user.balance = _user[2]; //_balance
        } catch (err) {
          //entities which are not alive are discarded
        }
      }
      return _addressess;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUsersAddressCount() {
    try {
      return await this._instance.getUsersAddressCount(this._gas);
    } catch (err) {
      throw new Error(err);
    }
  }

}
var _contract = new ContractController();
module.exports = {
  _contract
}