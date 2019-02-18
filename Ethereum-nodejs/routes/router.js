var AssetContract = require('./assetContract.router');
var Auth = require('./auth.router');
// var Api = require('./contract.router');
var Sensor = require('./sensor.router');
var WalletApi = require('./wallet.router');
var TokenApi = require('./token.router');
var express = require('express');
const router = express.Router();
module.exports = (app) => {
    app.use('/api/auth', Auth);
    app.use('/contract', AssetContract);
    app.use('/sensor', Sensor);
    app.use('/wallet', WalletApi);
    app.use('/token', TokenApi);
}