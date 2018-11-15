var {
  _contract
} = require('../controllers/ContractController');
var {
  _stateContract
} = require('../controllers/StateContractController');
// var TransactionRepository = require('../mysql/db/transaction.repository');
// const repo = new TransactionRepository();
module.exports = {
  default_req(req, res, callback) {
    console.log('default gateway | ContractApi : ', req.method, req.url);
    callback();
  },

  validation_req(req, res, callback, id) {
    console.log('Doing id validations on ' + id);
    req.id = id;
    callback();
  },

  get_accounts(req, res) {
    try {
      var _accounts = _contract.getAccounts();
      return res.status(200).json({
        _accounts
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  //address _address,
  // string _name,
  // uint _value,
  // uint _quantity
  async add_entity(req, res) {
    try {
      if (req.decoded.role != 'PRODUCER') {
        return res.status(401).send('Unauthorized Access!!');
      }
      var val = await _contract.addEntity(req.decoded.account, req.body.name, req.body.value, req.body.quantity);
      return res.status(200).send(val);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  //All the entities of the current user
  async getEntities(req, res) {
    try {
      var _address = req.decoded.account;
      var val = await _contract.getEntityByAddress(_address);
      return res.status(200).send(val);

    } catch (err) {
      return res.status(500).send(err);
    }

  },

  // bytes32 _id
  async getEntityById(req, res) {
    try {
      var _entity = await _contract.getEntityById(req.id);

      return res.status(200).send(_entity);
    } catch (err) {
      return res.status(500).send(err);

    }
  },

  // address _address
  async getEntityByAddress(req, res) {
    try {
      var _entities = await _contract.getEntityByAddress(req.id);
      return res.status(200).send(_entities);
    } catch (err) {
      return res.status(500).send(err);

    }
  },

  async getAllEntities(req, res) {
    try {
      var _address = req.decoded.account;
      var entities = await _contract.getAllEntities(_address);
      return res.status(200).send(entities);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  // address _address,
  //     string _name,
  //     uint _value,
  //     uint _quantity
  async update_entity(req, res) {
    try {
      if (req.decoded.role != 'PRODUCER') {
        return res.status(401).send('Unauthorized Access!!');
      }
      var val = await _contract.updateEntity(req.decoded.account, req.body.name, req.body.value, req.body.quantity, req.body.index, req.body.trackId);
      return res.status(200).send(val);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async transactEntities(req, res) {
    try {
      var _decoded = req.decoded;
      var _success_ = await _contract.transactEntities(req.body.sender, _decoded.account, req.body.name, req.body.entityId, req.body.quantity, req.body.amount, req.body.index);
      var _amount = req.body.amount * req.body.quantity;
      var _buyerEntityId = await _contract.createId(_decoded.account, req.body.name, _decoded.username);
      var date = new Date().toString();
      var _success = await _stateContract.attachSensor(
        req.body.sensorId, req.body.entityId, _buyerEntityId, req.body.weight,
        req.body.quantity,
        req.body.place,
        req.body.latitude,
        req.body.longitude,
        date,
        _amount);
      // await repo.update(json, req.body._sender);
      // await repo.update(json, _decoded.account);
      //update entities about the state id
      var _stateId = await _stateContract.getEntityStateId(req.body.entityId);
      await _contract.updateEntityStateId(req.body.entityId, _buyerEntityId, _stateId);
      return res.status(200).send({
        success: 'true'
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  // async add_user(req, res) {
  //     try {
  //         var _account = await _contract.createNewAccount(req.body.username,req.body. req.body.type);
  //         return res.status(200).send(val);
  //     } catch (err) {
  //         return res.status(500).send(err);
  //     }
  // },

  // address _address
  async get_user(req, res) {
    try {
      var val = await _contract.getUser(req.id);
      return res.status(200).send(val);
    } catch (err) {
      return res.status(500).send(err);
    }
  }


};