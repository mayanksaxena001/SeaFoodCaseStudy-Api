var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
var Util = require('../controllers/Util');

module.exports = {

    //menmonic,hd wallet ,password required!!
    async getWalletDetails(req, res) {
        try {
            var user = await repo.findByUserName(req.decoded.username);
            var details = await Util.getWalletByPath(user.mnemonic, req.body.path, req.body.password);
            return res.status(200).send(details);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getPrivateKey(req, res) {
        try {
            var user = await repo.findByUserName(req.decoded.username);
            var privateKey = await Util.getPrivateKeyFromSeed(user.account, user.mnemonic, req.body.password);
            return res.status(200).send(privateKey);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

};