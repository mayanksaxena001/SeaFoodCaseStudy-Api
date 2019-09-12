var AssetContractApi = require('./assetContract.router');
var AuthApi = require('./auth.router');
// var Api = require('./contract.router');
var Sensor = require('./sensor.router');
var Wallet = require('./wallet.router');
var express = require('express');
const router = express.Router();
module.exports = (app) => {
    app.use('/api/auth', Auth);
    app.use('/api/contract', AssetContract);
    app.use('/api/sensor', Sensor);
    app.use('/api/wallet/', Wallet);
}