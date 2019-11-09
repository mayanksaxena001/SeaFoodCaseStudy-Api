let {
    tokenController
} = require('../controllers/TokenController');
var Util = require('../controllers/Util');
var bcrypt = require('bcryptjs');

module.exports = {
    //TODO seggregate details
    async transfer(req, res) {
        try {
            let reqBody = req.body;
            if (reqBody == null || reqBody.from_address == null ||
                reqBody.to_address == null ||
                reqBody.transfer_amount == null) {
                throw new Error("Insufficient details,Please check the Api ");
            }
            var details = await tokenController.transferTokens(reqBody.from_address, reqBody.to_address, req.transfer_amount);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

    async getTokenDetails(req, res) {
        try {
            var details = await tokenController.getTokenDetails();
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

    async getBalance(req, res) {
        try {
            // let reqBody = req.body;
            // if (reqBody == null || reqBody._address == null) {
            //     throw new Error("Insufficient details,Please check the Api ");
            // }
            var details = await tokenController.balanceOf(req.decoded.account);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

    async mintTokens(req, res) {
        try {
            let reqBody = req.body;
            if (reqBody == null || reqBody.mint_value == null) {
                throw new Error("Insufficient details,Please check the Api ");
            }
            var details = await tokenController.mintTokens(reqBody.mint_value);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },

    async allowed(req, res) {
        try {
            let reqBody = req.body;
            if (reqBody == null 
                || reqBody.owner_address == null
                || reqBody.spender_address == null) {
                throw new Error("Insufficient details,Please check the Api ");
            }
            var details = await tokenController.allowed(reqBody.owner_address,reqBody.spender_address);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },


};