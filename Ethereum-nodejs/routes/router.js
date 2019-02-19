var AssetContractApi = require('./assetContract.router');
var AuthApi = require('./auth.router');
// var Api = require('./contract.router');
var SensorApi = require('./sensor.router');
var WalletApi = require('./wallet.router');
var TokenApi = require('./token.router');
var express = require('express');
const router = express.Router();
module.exports = (app) => {
    app.use('/api/auth', AuthApi);
    app.use('/contract', AssetContractApi);
    app.use('/sensor', SensorApi);
    app.use('/wallet', WalletApi);
    app.use('/token', TokenApi);
}