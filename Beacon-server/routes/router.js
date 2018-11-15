// var  defaultRouter = require( './default.router');
var  sensorRouter = require( './sensor.router');
var express = require( 'express');
const router = express.Router();
module.exports = (app) => {

    app.use('/sensor', sensorRouter);
}