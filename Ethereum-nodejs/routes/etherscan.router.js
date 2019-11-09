var EtherScanApi = require('../api/EtherScanApi');
var express = require('express');
const router = express.Router();
// router.use('/', auth.default_req);
router.param('id', EtherScanApi.validation_req);

// router.post('/signup', auth.register);
// router.post('/login', auth.login);

router.get('/block/:id', EtherScanApi.getBlockDetails);
router.get('/balance/:id', EtherScanApi.getEtherBalance);
// router.put('/logout', auth.checkToken, auth.logout);
// router.get('/user', auth.checkToken, auth.getUser);
// router.put('/user', auth.checkToken, auth.updateUser);
module.exports = router;