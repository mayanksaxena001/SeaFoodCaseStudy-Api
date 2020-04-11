var TokenApi = require('../api/TokenApi');
var auth = require('../controllers/AuthController');
var express = require('express');
const router = express.Router();
router.use('/', auth.checkToken, auth.isWeb3Connected,TokenApi.setGas);

//
router.post('/transfer', TokenApi.transfer);
router.get('/details', TokenApi.getTokenDetails);
router.get('/balance', TokenApi.getBalance);
router.get('/allowed', TokenApi.allowed);
router.post('/mint', TokenApi.mintTokens);
module.exports = router;