var Wallet = require('../config/contract.config').Wallet,
    fs = require('fs');
const Promise = require('bluebird');
const fileSystem = Promise.promisifyAll(fs);
let bip39 = require("bip39");
let hdkey = require('ethereumjs-wallet/hdkey');
let HD_WALLET_PATH = "m/44'/60'/0'/0/";
module.exports = {
    formatDate(date) {
        date = date.toNumber() * 1000;
        var d = new Date(date);
        // month = '' + (d.getMonth() + 1),
        // day = '' + d.getDate(),
        // year = d.getUTCFullYear(),
        // hour = d.getHours(),
        // minute = d.getMinutes(),
        // seconds = d.getSeconds();

        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;

        // return [year, month, day].join('-') +" , "+ [hour, minute, seconds].join('-');
        d = d.toISOString().split('T')[0];
        return d;
    },
    async getPrivateKey(account, password) {
        var utcFile = "/home/synerzip/Desktop/Ethereum/Blockchain2/node1/keystore/";
        const keyStore = '/home/synerzip/Desktop/Ethereum/Blockchain2/node1/keystore';
        var found = false;
        var files = await fileSystem.readdirAsync(keyStore);
        files.forEach(file => {
            var _words = file.split('--');
            var _account = '0x' + _words[2];
            if (_account === account) {
                found = true;
                utcFile = utcFile + '' + file;
                console.log('FILE FOUND :', file);
            }
        })
        if (!found) {
            return false;
        }
        var key = {};
        const myWallet = Wallet.fromV3(fs.readFileSync(utcFile).toString(), password, true);
        key.address = '0x' + myWallet.getAddress().toString('hex');
        key.privateKey = '0x' + myWallet.getPrivateKey().toString('hex');
        key.publicKey = '0x' + myWallet.getPublicKey().toString('hex');
        key.fileName = myWallet.getV3Filename();
        key.fileContents = myWallet.toV3(password);
        console.log("KEY ", key);
        return key;
    },
    async generateHDWalletMenemonic() {
        var mnemonic = bip39.generateMnemonic();
        console.log('Mnemonic ', mnemonic);
        var entropy = bip39.mnemonicToEntropy(mnemonic);
        console.log('Entropy ', entropy);
        return mnemonic;
    },

    async generateNextAddress(mnemonic,index) {
        var HD_WALLET = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
        if (HD_WALLET == null) {
            throw new Error('No HD wallet defined!');
        }
        let wallet_path = HD_WALLET_PATH + index;
        let wallet = HD_WALLET.derivePath(wallet_path).getWallet();
        let address = '0x' + wallet.getAddress().toString("hex");
        console.log('New Address Created ', address);
        return address;
    },

    async getPrivateKeyFromSeed(account,mnemonic, password) {
        var HD_WALLET = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
        if (HD_WALLET == null) {
            throw new Error('No HD wallet defined!');
        }
        var key = {};
        //TODO : remove hard coded
        for (let i = 0; i < 10000; i++) {
            let wallet = HD_WALLET.derivePath(HD_WALLET_PATH + i).getWallet();
            let address = '0x' + wallet.getAddress().toString("hex");
            let privateKey = wallet.getPrivateKey().toString("hex");
            let publicKey = wallet.getPublicKey().toString('hex');
            if (account === address) {
                console.log('Found!! ', privateKey);
                key.address = '0x' + address;
                key.privateKey = '0x' + privateKey;
                key.publicKey = '0x' + publicKey;
                key.fileName = wallet.getV3Filename();
                key.fileContents = wallet.toV3(password);
                break;
            }
        }
        return key;
    }
}