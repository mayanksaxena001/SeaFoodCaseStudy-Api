var AssetContractApi = require('./assetContract.router');
var EtherScanApi = require('./etherscan.router');
var AuthApi = require('./auth.router');
var TokenApi = require('./token.router');
var SensorApi = require('./sensor.router');
var WalletApi = require('./wallet.router');
var express = require('express');
const router = express.Router();
module.exports = (app) => {
    app.use('/api/auth', AuthApi);
    app.use('/api/contract', AssetContractApi);
    app.use('/api/sensor', SensorApi);
    app.use('/api/wallet/', WalletApi);
    app.use('/api/etherscan/', EtherScanApi);
    app.use('/api/token/', TokenApi);
}