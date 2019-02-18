var WalletApi = require('../api/WalletApi');
var auth = require('../controllers/AuthController');
var express = require('express');
const router = express.Router();
router.use('/', auth.checkToken);

//
router.post('/key', WalletApi.getPrivateKey);
router.post('/details', WalletApi.getWalletDetails);
module.exports = router;