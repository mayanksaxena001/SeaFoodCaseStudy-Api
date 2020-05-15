'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var UserRepository = require('../mysql/db/user.repository');
var ApiTokenRepository = require('../mysql/db/apitoken.repository');
const repo = new UserRepository();
const apiTokenRepo = new ApiTokenRepository();
var Promise = require('bluebird');
var Util = require('./Util');
var {
  assetTransferContract
} = require('./AssetTransferController');
var _contract = assetTransferContract;
var contractConfig = require('../config/contract.config').default;

module.exports = {

  default_req(req, res, callback) {
    console.log('default gateway | Auth : ', req.method, req.url);
    callback();
  },

  validation_req(req, res, callback, username) {
    console.log('Doing username validations on ' + username);
    res.username = username;
    callback();
  },

  get_req(req, res) {
    res.render('index');
  },

  async register(req, res) {
    try {
      if (!req.body || !req.body.name || !req.body.password || !req.body.username || !req.body.email) throw new Error('Insufficient Info')
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      /**
       * Other variants
       // var _account = web3.utils.soliditySha3(req.body.username);
       // var _account = web3.prototype.sha3(req.body.username);
       // var _account = web3.utils.randomHex(16);
       */
      let _mnemonic = await Util.generateHDWalletMenemonic();
      let _account = await Util.getAddress(_mnemonic, 0, req.body.password);
      let _balance = 0;
      try {
        if (req.body.type != 'user') {

          if (!contractConfig.isWeb3Connected()) {
            throw new Error("Web3 not connected");
          }
          await _contract.createNewAccount(_account, req.body.username, hashedPassword, req.body.type);
          _balance = await _contract.balanceOf(_account);
          _balance = _balance.toNumber();
        }
      } catch (error) {
        console.log(error);
      }
      let _user = await repo.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        account: _account,
        type: req.body.type,
        active: true,
        balance: _balance,
        mnemonic: _mnemonic
      });
      // create a token
      let token = await module.exports.generateToken(_user.id, _account, _user.type, _user.username);
      await module.exports.saveApiToken(
        'TOKEN_GENERATED',
        _user.id,
        true,
        token,
        req.originalUrl,
        req.method
      );
      res.status(200).send({
        'auth': true,
        'x-access-token': token,
        'token': token
      });
      // console.log(res);

    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    };

  },

  async getUser(req, res) {
    try {
      var user = {};
      user = await repo.getById(req.decoded.id);
      //TODO remove password from user object
      if (!user) return res.status(404).send("No user found.");
      user.password = '';
      // user.account = '';
      try {
        var _user = await _contract.getUserByAddress(user.account);
        user.balance = _user[2].toNumber(); //_balance
      } catch (err) {
        console.error(err);
        user.balance = 'NA';
      }
      res.status(200).send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  async updateUser(req, res) {
    try {
      var passwordIsValid = Util.verifyPassword(req.decoded.username, req.body.password);
      if (!passwordIsValid) throw new Error('Password do not match!');
      await repo.update(req.body, req.decoded.id);
      res.status(200).send({
        succes: true
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    };
  },

  async checkToken(req, res, callback) {
    try {
      var token = req.headers['x-access-token'];
      if (!token) {
        console.log('No token present...')
        return res.status(401).send({
        auth: false,
        message: 'No token provided.'
      });
    }
      var jwtVerifyAsync = Promise.promisify(jwt.verify, {
        context: jwt
      })
      var decoded = await jwtVerifyAsync(token, process.env.SECRET);
      if (decoded) {
        var user = await repo.getById(decoded.id);
        if (!user) throw new Error("User is not registered or might not be active");

        await module.exports.saveApiToken(
          'CHECK_TOKEN',
          user.id,
          true,
          token,
          req.originalUrl,
          req.method
        );

        if (!user.active) return res.status(500).send("Invalid token , User is inactive");
        req.decoded = decoded;
        callback();
      } else {
        throw new Error('Invalid session');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);

    }
  },

  async isWeb3NodeConnected(req, res, callback) {
    try {
      if (!contractConfig.isWeb3Connected()) throw new Error("Web3 not connected to any Ethereum node");
      // await _contract.setGas(req.decoded.account);
      callback();
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  async login(req, res) {
    try {
      var user = await repo.findByUserName(req.body.username);
      if (!user) return res.status(404).send('User Not Found');;
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({
        'auth': false,
        'x-access-token': null
      });
      try {
        if (contractConfig.isWeb3Connected()) {
          var _balance = await _contract.balanceOf(user.account);
          //TODO : do not update balance while login
          await repo.update({
            active: true,
            balance: _balance.toNumber()
          }, user.id);
        }
      } catch (err) {
        console.error(err)
      }
      let token = await module.exports.generateToken(user.id, user.account, user.type, user.username);
      await module.exports.saveApiToken(
        'TOKEN_GENERATED',
        user.id,
        true,
        token,
        req.originalUrl,
        req.method
      );

      res.status(200).send({
        'auth': true,
        'x-access-token': token,
        'token': token
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  async saveApiToken(_type, _id, _status, _token, _url, _method) {
    try {
      await apiTokenRepo.create({
        type: _type,
        user_id: _id,
        status: _status,
        token: _token,
        url: _url,
        method: _method
      });
    } catch (err) {
      console.error(err)
    }
  },

  //TODO
  async logout(req, res) {
    try {
      // TODO
      // var id = req.decoded.id;
      // await repo.update({
      //   active: false
      // }, id);
      // await apiTokenRepo.update();
      res.status(200).send({
        'auth': false,
        'x-access-token': null
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  async generateToken(_id, _account, _type, _username) {
    // create a token
    return jwt.sign({
      //payload
      id: _id,
      account: _account,
      role: _type,
      username: _username
    }, process.env.SECRET, {
      // algorithm: "ES256",TODO : use some algo with jwt
      expiresIn: process.env.TOKEN_EXPIRE_TIME // just playing with it ,expires in 24h
    });
  }
}