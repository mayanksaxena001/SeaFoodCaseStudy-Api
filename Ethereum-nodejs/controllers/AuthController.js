'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
var Promise = require('bluebird');
var {
  assetTransferContract
} = require('./AssetTransferController');
var _contract = assetTransferContract;
var web3 = require('web3');

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

  async registerJWT(req, res) {
    try {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      if (!req.body.name || !req.body.username || !req.body.email) throw new Error('Insufficient Info');
      /**
       * Other variants
       // var _account = web3.utils.soliditySha3(req.body.username);
       // var _account = web3.prototype.sha3(req.body.username);
       // var _account = web3.utils.randomHex(16);
       */
      if (!_contract.isWeb3Connected()) {
        throw new Error("Web3 not connected");
      }
      var _account = await _contract.createNewAccount(req.body.username, req.body.password, req.body.type);
      var _user = await repo.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        account: _account,
        type: req.body.type,
        active: true
      });
      // create a token
      var token = jwt.sign({
        //payload
        id: _user.id,
        account: _account,
        role: req.body.type,
        username: _user.username
      }, config.secret, {
        expiresIn: config.TOKEN_EXPIRE_TIME // just playing with it ,expires in 1 min
      });
      res.status(200).send({
        auth: true,
        token: token
      });
      // console.log(res);

    } catch (err) {
      res.status(500).send(err.message);
    };

  },

  async getUser(req, res) {
    try {
      var user ={};
       user = await repo.getById(req.decoded.id);
      //TODO remove password from user object
      if (!user) return res.status(404).send("No user found.");
      user.password = '';
      // user.account = '';
      var _user = await _contract.getUserByAddress(user.account);
      user.balance = _user[2].toNumber(); //_balance
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async updateUser(req, res) {
    try {
      await repo.update(req.body, req.decoded.id);
      res.status(200).send({
        succes: true
      });
    } catch (err) {
      res.status(500).send(err);
    };
  },

  async checkToken(req, res, callback) {
    try {
      var token = req.headers['x-access-token'];
      if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
      });
      var jwtVerifyAsync = Promise.promisify(jwt.verify, {
        context: jwt
      })
      var decoded = await jwtVerifyAsync(token, config.secret);
      if (decoded) {
        var user = await repo.getById(decoded.id);
        if (!user.active) return res.status(500).send("Invalid token , User is inactive")
        req.decoded = decoded;
        callback();
      } else {
        throw new Error('Invalid session . No user Found');
      }
    } catch (err) {
      return res.status(500).send(err);

    }
  },

  async login(req, res) {
    try {
      var user = await repo.findByUserName(req.body.username);
      if (!user) return res.status(404).send('No user found.');
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({
        auth: false,
        token: null
      });
      await repo.update({
        active: true
      }, user.id);
      var token = jwt.sign({
        id: user.id,
        account: user.account,
        role: user.type,
        username: user.username
      }, config.secret, {
        expiresIn: config.TOKEN_EXPIRE_TIME
      });
      res.status(200).send({
        auth: true,
        token: token
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async logout(req, res) {
    try {
      // TODO
      // var id = req.decoded.id;
      // await repo.update({
      //   active: false
      // }, id);
      res.status(200).send({
        auth: false,
        token: null
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
}