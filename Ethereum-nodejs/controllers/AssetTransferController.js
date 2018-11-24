var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config');
var artifacts = require('../bin/truffle/latest/contracts/AssetTransfer.json');
var AssetTransferContract = contract(artifacts);
var Util = require('./Util');

var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
// var EthSendTransaction = require('./EthSendTransaction');

var transactionData = new Array();
var supplierAlert = new Array();
class AssetTransferController {
    constructor() {
        this._web3 = contractConfig._web3;
        this.AssetTransferContract = AssetTransferContract;
        this.init();
        // console.log("Sending Ether ==========================================");
        // EthSendTransaction.sendEther();
        // console.log("Ether Sent ==========================================");
    }

    async init() {
        this.AssetTransferContract.setProvider(this._web3.currentProvider);
        this.AssetTransferContract.setNetwork(contractConfig.NETWORK_ID);
        this._instance = await this.AssetTransferContract.at(contractConfig.CONTRACT_ADDRESS.AssetTransferContract);
        this._accounts = await this._web3.eth.accounts;
        // this._web3.eth.defaultAccount = this._accounts[0];
        this._gas = {
            from: this._accounts[0],
            gas: contractConfig.getGasLimit() //9000000000000
        }
        this._logTransferTokenEvent = await this._instance.Transfer();
        this._logApprovalTokenEvent = await this._instance.Approval();
        this._logTransferAssetEvent = await this._instance.LogTransferAssetEvent();
        this._logUpdateAssetEvent = await this._instance.LogUpdateAssetEvent();
        // this._logDeleteAssetEvent = await this._instance.LogDeleteAssetEvent();
        this._logNewUserEvent = await this._instance.LogNewUserEvent();

        this._logNewAssetEvent = await this._instance.LogNewAssetEvent();
        this._logSupplierSensorAlert = await this._instance.LogSupplierSensorAlert();

        this._logTransactionUpdateEvent = await this._instance.LogTransactionUpdateEvent();
        this._logLockedFundsEvent = await this._instance.LogLockedFundsEvent();
        this._logReleasedFundsEvent = await this._instance.LogReleasedFundsEvent();
        this._logOwnershipTransferred = await this._instance.OwnershipTransferred();
        this._logMemberAdded = await this._instance.MemberAdded();
        this._logMemberRemoved = await this._instance.MemberRemoved();

        this.toConsole("LogTransferAssetEvent", this._logTransferAssetEvent);
        this.toConsole("LogUpdateAssetEvent", this._logUpdateAssetEvent);
        // this.toConsole("LogDeleteAssetEvent", this._logDeleteAssetEvent);
        this.toConsole("LogNewUserEvent", this._logNewUserEvent);
        this.toConsole("Transfer", this._logTransferTokenEvent);
        this.toConsole("Approval", this._logApprovalTokenEvent);
        this.toConsole("MemberAdded", this._logMemberAdded);
        this.toConsole("MemberRemoved", this._logMemberRemoved);
        this.toConsole("OwnershipTransferred", this._logOwnershipTransferred);
        this.toConsole("LogLockedFundsEvent", this._logLockedFundsEvent);
        this.toConsole("LogReleasedFundsEvent", this._logReleasedFundsEvent);
        this.toConsole("LogTransactionUpdateEvent", this._logTransactionUpdateEvent);
        this.toConsole("LogSupplierSensorAlert", this._logSupplierSensorAlert);
        this.toConsole("LogNewAssetEvent", this._logNewAssetEvent);

        this.watch(this._logTransferAssetEvent);
        this.watch(this._logUpdateAssetEvent);
        // this.watch(this._logDeleteAssetEvent);
        this.watch(this._logNewUserEvent);
        this.watch(this._logTransferTokenEvent);
        this.watch(this._logApprovalTokenEvent);
        this.watch(this._logMemberAdded);
        this.watch(this._logMemberRemoved);
        this.watch(this._logOwnershipTransferred);
        this.watch(this._logLockedFundsEvent);
        this.watch(this._logReleasedFundsEvent);
        this.watch(this._logTransactionUpdateEvent);
        this.watch(this._logSupplierSensorAlert);
        this.watch(this._logNewAssetEvent);
    }

    watch(event) {
        event.watch(function (err, result) {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Event ## ");
            console.log(result.event + " : ", result.args);
            if (result.event == 'LogTransferAssetEvent') {
                transactionData.push(result.args);
            } else if (result.event == 'LogSupplierSensorAlert') {
                supplierAlert.push(result.args);
            } else if (result.event == 'LogTransferAssetEvent') {

            } else if (result.event == 'LogNewAssetEvent') {

            } else if (result.event == 'LogUpdateAssetEvent') {

            } else if (result.event == 'LogTransactionUpdateEvent') {

            } else if (result.event == 'Transfer') {

            }
        });
    }

    logError(err) {
        console.error(err);
    }
    toConsole(param, msg) {
        console.log(param + " : ", msg);
    }

    isWeb3Connected() {
        return this._web3.isConnected();
    }

    async createNewAccount(_username, _password, _type,menmonic) {
        try {
            let val = await Util.generateNextAddress(menmonic,0);
            await this.insertUser(val, _username, _type);
            return val;
        } catch (err) {
            throw new Error(err);
        };
    }

    async insertUser(_address, _username, _type) {
        if (!_address || !_username || !_type) {
            throw new Error("Missing details");
        }
        if (_type == "ADMIN") {
            return new Error("Not allowed !");
        } else if (_type == "PRODUCER") {
            return await this.addProducer(_address, _username);
        } else if (_type == "CONSUMER") {
            return await this.addConsumer(_address, _username);
        } else if (_type == "SUPPLIER") {
            return await this.addSupplier(_address, _username);
        }
    }

    async addProducer(_address, _username) {
        if (!_address || !_username) {
            throw new Error("missing details");
        }
        await this._instance.addProducer(_address, _username, this._gas);
    }

    async addConsumer(_address, _username) {
        if (!_address || !_username) {
            throw new Error("missing details");
        }
        await this._instance.addConsumer(_address, _username, this._gas);
    }

    async addSupplier(_address, _username) {
        if (!_address || !_username) {
            throw new Error("missing details");
        }
        await this._instance.addSupplier(_address, _username, this._gas);
    }

    async getUserByAddress(_address) {
        if (!_address) {
            throw new Error("Unknown address ");
        }
        var user = await this._instance.getUserByAddress(_address, this._gas);
        return user;
    }

    async createAsset(_address, _name, _value, _quantity) {
        if (!_address || !_name || !_value || !_quantity) {
            throw new Error("Missing details");
        }
        var transaction = await this._instance.createAsset(_address, _name, _value, _quantity, this._gas);
        return transaction;
    }

    async balanceOf(_address) {
        return await this._instance.balanceOf(_address, this._gas);
      }

    async getUserAssets(_address) {
        if (!_address) {
            throw new Error("Unknown address ");
        }
        var assets = new Array();
        var arr = await this._instance.getAssetIdsByAddress(_address);
        for (var i = 0; i < arr.length; i++) {
            var asset = await this.getAssetById(arr[i]);
            //TODO: All user assets fetched,change in contract itself
            if (asset.address == _address) {
                assets.push(asset);
            }
        }
        return assets;
    }

    async getAssetById(_id) {
        if (!_id) {
            throw new Error("Empty Asset id provided");
        }
        var _asset = await this._instance.getAssetById(_id, this._gas);
        var asset = {};
        asset.address = _asset[0];
        asset.id = _asset[1];
        asset.name = _asset[2];
        asset.value = _asset[3].toNumber();
        asset.quantity = _asset[4].toNumber();
        asset.trackId = _asset[5];
        asset.username = _asset[6];
        asset.type = _asset[7];
        asset.createdAt = Util.formatDate(_asset[8]);
        asset.updatedAt = Util.formatDate(_asset[9]);
        return asset;
    }

    async editAsset(_address, _id, _value, _quantity) {
        if (!_address || !_id || !_value || !_quantity) {
            throw new Error("Missing details");
        }
        return await this._instance.editAsset(_address, _id, _value, _quantity, this._gas);
    }

    async getAccounts() {
        var accounts = await repo.getAddressDetails();
        return accounts;
    }

    async getPrivateKey(_account ,mnemonic, _password) {
        // var privateKey =await Util.getPrivateKey(_account,_password);
        var privateKey =await Util.getPrivateKeyFromSeed(_account,mnemonic,_password);
        if(privateKey){
            return privateKey;
        }else{
            throw new Error('Address Keys Not found');
        }
    }

    async transferAsset(_from, _to, _supplier, _id, _quantity, _value) {
        try {
            var transaction = await this._instance.transferAsset(_from, _to, _supplier, _id, _quantity, _value, this._gas);
            return transaction;
        } catch (err) {
            throw new Error(err);
        }
    }

    async requestTokens(_from, _value) {
        try {
            return await this._instance.requestTokens(_from, _value, this._gas);
        } catch (err) {
            throw new Error(err);
        }
    }

    async transferTokens(_from, _to, _value) {
        try {
            return await this._instance.transferTokens(_from, _to, _value, this._gas);
        } catch (err) {
            throw new Error(err);
        }
    }

    async getTransactionData() {
        return transactionData;
    }

    async getSupplierAlert() {
        return supplierAlert;
    }

    async getSuppliers() {
        var suppliers = new Array();
        var users = await this._instance.getUsers(this._gas);
        for (var i = 0; i < users.length; i++) {
            var user = await this._instance.getUserByAddress(users[i]);
            if (user != null && user[1] == "SUPPLIER") {
                suppliers.push({
                    "address": users[i],
                    "name": user[0],
                    "type": user[1]
                });
            }
        }
        return suppliers;
    }

    async getTransferableAssets() {
        try {
            var arr = await this._instance.getUsers(this._gas);
            var assets = new Array();
            for (var i = 0; i < arr.length; i++) {
                try {
                    var user = await this._instance.getUserByAddress(arr[i]);
                    if (user != null && user[1] == 'PRODUCER') {
                        var _assets = await this.getUserAssets(arr[i]);
                        //entity is already alive
                        for (var j = 0; j < _assets.length; j++) {
                            var asset = _assets[j];
                            if (asset.type == 'PRODUCER') assets.push(asset);
                        }
                        //nothing for now
                    }
                } catch (err) {}
                // user.balance = _user[2]; //_balance
            }
        } catch (err) {
            throw new Error(err);
        }
        return assets;
    }

    async getUserTransactions(_address) {
        if (!_address) {
            throw new Error("Unknown address ");
        }
        try {
            var transactions = new Array();
            var arr = await this._instance.getTransactionIdsByAddress(_address, this._gas);
            for (var i = 0; i < arr.length; i++) {
                var transaction = await this.getTransactionById(arr[i]);
                transactions.push(transaction);
            }
        } catch (err) {
            throw new Error(err);
        }
        return transactions;
    }

    async getTransactionById(_id) {
        if (!_id) {
            throw new Error("Empty Id ");
        }
        var _transaction = await this._instance.getTransactionById(_id, this._gas);
        var transaction = {};
        transaction.id = _transaction[0];
        transaction.status = _transaction[1];
        var fromUser = await this.getUserByAddress(_transaction[2]);
        var toUser = await this.getUserByAddress(_transaction[3]);
        transaction.fromUsername = fromUser[0];
        transaction.toUsername = toUser[0];
        transaction.from = _transaction[2];
        transaction.to = _transaction[3];
        transaction.supplier = _transaction[4];
        transaction.sensorId = _transaction[5];
        transaction.assetId = _transaction[6];
        transaction.assetName = _transaction[7];
        transaction.amount = _transaction[8].toNumber();
        transaction.updatedAt = Util.formatDate(_transaction[9]);
        return transaction;
    }

    async updateTransactionSensorId(_address, _transactionId, _sensorId) {
        var transaction = await this._instance.updateTransactionSensorId(_address, _transactionId, _sensorId, this._gas);
        return transaction;
    }

    async updateTransactionPickUp(_address, _transactionId) {
        var transaction = await this._instance.updateTransactionPickUp(_address, _transactionId, this._gas);
        return transaction;
    }

    async updateTransactionCompleted(_address, _transactionId) {
        var transaction = await this._instance.updateTransactionCompleted(_address, _transactionId, this._gas);
        return transaction;
    }

    async cancelTransaction(_address, _transactionId) {
        var transaction = await this._instance.cancelTransaction(_address, _transactionId, this._gas);
        return transaction;
    }

    // async fetchTransactionReceipt(hash){
    //      waitForReceipt(hash, 1000).then(transactionReceipt => {
    //         console.log(transactionReceipt);
    //     })
    // } 


    // async waitForReceipt(hash, millisecondsInterval) {
    //     var retryCount = 0;
    //     var retryCountLimit = 100;

    //     var promise = new Promise((resolve, reject) => {
    //         var timer = setInterval(function () {

    //             contractConfig._web3.eth.getTransactionReceipt(hash, function(err, rec) {
    //                 if(err) {
    //                     console.log(err)
    //                     clearInterval(interval);
    //                     reject(err)
    //                 }

    //                 if(rec != null) {
    //                     clearInterval(timer);
    //                     resolve(rec);
    //                     return;
    //                 }

    //                 retryCount++;
    //                 if (retryCount >= retryCountLimit) {
    //                     clearInterval(timer);
    //                     reject("retry count exceeded");
    //                 }
    //             });

    //         }, millisecondsInterval);
    //     });

    //     return promise;
    // }

}
var assetTransferContract = new AssetTransferController();
module.exports = {
    assetTransferContract
}