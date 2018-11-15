var AssetContract = require('./assetContract.router');
var Auth = require('./auth.router');
// var Api = require('./contract.router');
var Sensor = require('./sensor.router');
var express = require('express');
const router = express.Router();
module.exports = (app) => {
    app.use('/api/auth', Auth);
    app.use('/contract', AssetContract);
    app.use('/sensor', Sensor);
}