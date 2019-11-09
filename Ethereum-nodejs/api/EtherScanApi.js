// var UserRepository = require('../mysql/db/user.repository');
// const repo = new UserRepository();
// var Util = require('../controllers/Util');
const request = require('request');
var Promise = require( 'bluebird');
const https = require('https');
const API_KEY = 'I72EM35CDD1YYHBHNA5RGIT2C7J1FMRKGT ';


module.exports = {
    validation_req(req, res, callback, id) {
        console.log('Doing id validations on ' + id);
        req.id = id;
        callback();
    },
    async getBlockDetails(req, res) {
        try {
            var blockNum = req.id;
            var   url =  'https://api.etherscan.io/api?module=block&action=getblockreward&blockno='+blockNum+'&apikey='+API_KEY;
            var details = await module.exports.request(url);
            return res.status(200).send(details);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
    },
    async getEtherBalance(req, res) {
        try {
            var address = req.id;
            if(!address) address = req.decoded.account;
            var   url = 'https://api.etherscan.io/api?module=account&action=balance&address='+address+'&tag=latest&apikey='+API_KEY;
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