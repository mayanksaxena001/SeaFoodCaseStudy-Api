var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
var Util = require('../controllers/Util');
var bcrypt = require('bcryptjs');

module.exports = {
//TODO seggregate details
    //menmonic,hd wallet ,password required!!
    async getWalletDetails(req, res) {
        try {
            if(!req.body.password) throw new Error("Password required ");
            var user = await repo.findByUserName(req.decoded.username);
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordIsValid) throw new Error("Password do not mach");
            var details = await Util.getWalletByPath(user.mnemonic, req.body.path, req.body.password);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

    async getPrivateKey(req, res) {
        try {
            if(!req.body.password) throw new Error("Password required ");
            var user = await repo.findByUserName(req.decoded.username);
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordIsValid) throw new Error("Password do not mach");
            var privateKey = await Util.getPrivateKeyFromSeed(user.account, user.mnemonic, req.body.password);
            return res.status(200).send(privateKey);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

};