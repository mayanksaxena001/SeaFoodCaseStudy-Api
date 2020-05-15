var auth = require('../controllers/AuthController');
var express = require('express');
const router = express.Router();
router.use('/', auth.default_req);
router.param('username', auth.validation_req);

router.post('/signup', auth.register);
router.post('/login', auth.login);

router.get('/index', auth.get_req);
router.put('/logout', auth.checkToken, auth.logout);
router.get('/user', auth.checkToken,auth.isWeb3NodeConnected, auth.getUser);//TODO : remove checking for web3 connection
router.put('/user', auth.checkToken, auth.updateUser);
module.exports = router;