// var UserRepository = require('../mysql/db/user.repository');
// const repo = new UserRepository();
// var Util = require('../controllers/Util');
var request = require('request');
var Promise = require('bluebird');
const https = require('https');
const API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
    validation_req(req, res, callback, id) {
        console.log('Doing id validations on ' + id);
        req.id = id;
        callback();
    },
    //get ethereum block details
    async getBlockDetails(req, res) {
        try {
            var blockNum = req.id;
            var url = 'https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNum + '&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //get ether last price
    async getEtherLastPrice(req, res) {
        try {
            var blockNum = req.id;
            var url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //get total ether supply
    async getTotalEtherSupply(req, res) {
        try {
            var blockNum = req.id;
            var url = 'https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //get ether node size , startdate and enddate format 'yyyy-MM-dd',
    async getEtherNodeSize(req, res) {
        try {
            var blockNum = req.id;
            const startDate = '2019-03-21';
            const endDate = '2020-03-21';
            var url = 'https://api.etherscan.io/api?module=stats&action=chainsize&startdate=' + startDate + '&' + 'enddate=' + endDate + '&clienttype=geth&syncmode=default&sort=asc' + '&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //get ethereum address balance
    async getEtherBalance(req, res) {
        try {
            var address = req.id;
            if (!address) address = req.decoded.account;
            var url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //get multiple ethereum address balance separated by comma
    async getMultipleEtherBalance(req, res) {
        try {
            var address = req.id;
            if (!address) address = req.decoded.account;
            var url = 'https://api.etherscan.io/api?module=account&action=balancemulti&address=' + address + '&tag=latest&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //Check Contract Execution Status 
    async getEthereumAddressTransactionStatus(req, res) {
        try {
            var txHash = req.id;
            if (!txHash) throw new Error('transaction hash not present')
            var url = 'https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=' + txHash + '&tag=latest&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    //Check Transaction Receipt Status
    async getEthereumAddressTransactionReceiptStatus(req, res) {
        try {
            var txHash = req.id;
            if (!txHash) throw new Error('transaction hash not present')
            var url = 'https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=' + txHash + '&tag=latest&apikey=' + API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    async request(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve(body);
            });
        });
    }


};