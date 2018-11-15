var auth = require('../controllers/AuthController');
var express = require( 'express');
const router = express.Router();
router.use('/', auth.default_req);
router.param('username', auth.validation_req);

router.post('/signup', auth.registerJWT);
router.post('/login',auth.login);
router.get('/index',auth.get_req);
router.put('/logout', auth.logout);
router.get('/user', auth.checkToken,auth.getUser);
router.put('/user',auth.checkToken,auth.updateUser);
module.exports = router;