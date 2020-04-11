var {
    assetTransferContract
} = require('../controllers/AssetTransferController');
var _contract = assetTransferContract;
var bcrypt = require('bcryptjs');
var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
var Util = require('../controllers/Util');

module.exports = {
    default_req(req, res, callback) {
        console.log('default gateway | Asset Transfer ContractApi : ', req.method, req.url);
        callback();
    },

    validation_req(req, res, callback, id) {
        console.log('Doing id validations on ' + id);
        req.id = id;
        callback();
    },
    setGas(req, res, callback) {
        _contract.setGas(req.decoded.account);
        callback();
    },

    async createAsset(req, res) {
        try {
            if (req.decoded.role != 'PRODUCER') {
                return res.status(401).send('Unauthorized Access!!');
            }
            var transaction = await _contract.createAsset(req.decoded.account, req.body.name, req.body.value, req.body.quantity);
            return res.status(200).send(transaction);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    //All the entities of the current user
    async getAccounts(req, res) {
        try {
            var accounts = await _contract.getAccounts();
            return res.status(200).send(accounts);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    //All the entities of the current user
    async getUserAssets(req, res) {
        try {
            var assets = await _contract.getUserAssets(req.decoded.account);
            return res.status(200).send(assets);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    // bytes32 _id
    async getAssetById(req, res) {
        try {
            var asset = await _contract.getAssetById(req.id);
            return res.status(200).send(asset);
        } catch (err) {
            return res.status(500).send(err);

        }
    },

    async getTransferableAssets(req, res) {
        try {
            var assets = await _contract.getTransferableAssets();
            return res.status(200).send(assets);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async getTransactionData(req, res) {
        try {
            var transactions = await _contract.getTransactionData();
            return res.status(200).send(transactions);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async getSuppliers(req, res) {
        try {
            var suppliers = await _contract.getSuppliers();
            return res.status(200).send(suppliers);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    // TODO
    async getSupplierAlerts(req, res) {
        try {
            var alerts;
            if (req.decoded.role != 'SUPPLIER') {
                alerts = await _contract.getSupplierAlert();
            }
            return res.status(200).send(alerts);
        } catch (err) {
            return res.status(500).send(err);

        }
    },
    //
    async editAsset(req, res) {
        try {
            if (req.decoded.role != 'PRODUCER') {
                return res.status(401).send('Unauthorized Access!!');
            }
            var val = await _contract.editAsset(req.decoded.account, req.body.id, req.body.value, req.body.quantity);
            return res.status(200).send(val);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async requestTokens(req, res) {
        try {
            if (req.body.value == 0) {
                throw new Error("Value should be positive non zero");
            }
            var transaction = await _contract.requestTokens(req.decoded.account, req.body.value);
            return res.status(200).send(transaction);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async transferTokens(req, res) {
        try {
            if (req.body.value == 0) {
                throw new Error("Value should be positive non zero");
            }
            var transaction = await _contract.transferTokens(req.decoded.account, req.body.to, req.body.value);
            return res.status(200).send(transaction);
        } catch (err) {
            return res.status(500).send(err);
        }
    },

    async transferAsset(req, res) {
        try {
            var _decoded = req.decoded;
            var transaction = await _contract.transferAsset(req.body.from, _decoded.account, req.body.supplier, req.body.id, req.body.quantity, req.body.value);
            //
            return res.status(200).send(transaction);
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    },
    async getUserTransactions(req, res) {
        try {
            var _decoded = req.decoded;
            var transactions = await _contract.getUserTransactions(_decoded.account); //
            return res.status(200).send(transactions);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async getTransactionById(req, res) {
        try {
            var transactions = await _contract.getTransactionById(req.id); //
            return res.status(200).send(transactions);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async UpdateTransactionAccepted(req, res) {
        try {
            if (req.decoded.role == 'SUPPLIER') {
                var transaction = await _contract.updateTransactionSensorId(req.decoded.account, req.body.transactionId, req.body.sensorId); //
                return res.status(200).send(transaction);
            } else {
                throw new Error('Not allowed for this role');
            }
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async UpdateTransactionPickUp(req, res) {
        try {
            if (req.decoded.role == 'SUPPLIER') {
                var transaction = await _contract.updateTransactionPickUp(req.decoded.account, req.body.transactionId); //
                return res.status(200).send(transaction);
            } else {
                throw new Error('Not allowed for this role');
            }
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async UpdateTransactionCompleted(req, res) {
        try {
            if (req.decoded.role == 'SUPPLIER') {
                var transaction = await _contract.updateTransactionCompleted(req.decoded.account, req.body.transactionId); //
                return res.status(200).send(transaction);
            } else {
                throw new Error('Not allowed for this role');
            }
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async cancelTransaction(req, res) {
        try {
            var transaction = await _contract.cancelTransaction(req.decoded.account, req.body.transactionId); //
            return res.status(200).send(transaction);

        } catch (err) {
            return res.status(500).send(err);
        }
    },

};