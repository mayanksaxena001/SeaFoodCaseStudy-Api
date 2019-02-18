var Wallet = require('../config/contract.config').Wallet,
    fs = require('fs');
const Promise = require('bluebird');
const fileSystem = Promise.promisifyAll(fs);
var bcrypt = require('bcryptjs');
let bip39 = require("bip39");
let hdkey = require('ethereumjs-wallet/hdkey');
//For Ethereum
let HD_WALLET_PATH = "m/44'/60'/0'/0/";
var UserRepository = require('../mysql/db/user.repository');
const repo = new UserRepository();
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
    // async getPrivateKey(account, password) {
    //     var utcFile = "/home/synerzip/Desktop/Ethereum/Blockchain2/node1/keystore/";
    //     const keyStore = '/home/synerzip/Desktop/Ethereum/Blockchain2/node1/keystore';
    //     var found = false;
    //     var files = await fileSystem.readdirAsync(keyStore);
    //     files.forEach(file => {
    //         var _words = file.split('--');
    //         var _account = '0x' + _words[2];
    //         if (_account === account) {
    //             found = true;
    //             utcFile = utcFile + '' + file;
    //         }
    //     })
    //     if (!found) {
    //         return false;
    //     }
    //     var key = {};
    //     const myWallet = Wallet.fromV3(fs.readFileSync(utcFile).toString(), password, true);
    //     key.address = '0x' + myWallet.getAddress().toString('hex');
    //     key.privateKey = '0x' + myWallet.getPrivateKey().toString('hex');
    //     key.publicKey = '0x' + myWallet.getPublicKey().toString('hex');
    //     key.fileName = myWallet.getV3Filename();
    //     key.fileContents = myWallet.toV3(password);
    //     return key;
    // },
    async generateHDWalletMenemonic() {
        var mnemonic = bip39.generateMnemonic();
        this.checkMnemonic(mnemonic);
        var entropy = bip39.mnemonicToEntropy(mnemonic,bip39.wordlists.english);
        return mnemonic;
    },

    async getAddress(mnemonic, index, password) {
        this.checkMnemonic(mnemonic);
        // if( mnemonic.split('').length == 12 ) throw new Error('Invalid Mnemonic size.12 words expected');
        var HD_WALLET = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic, password));
        if (HD_WALLET == null) {
            throw new Error('No HD wallet defined!');
        }
        let wallet_path = HD_WALLET_PATH + index;
        let wallet = HD_WALLET.derivePath(wallet_path).getWallet();
        let address = '0x' + wallet.getAddress().toString("hex");
        return address;
    },

    //full hd wallet path
    async getWalletByPath(mnemonic, walletPAth, password) {
        this.checkMnemonic(mnemonic);
        if(walletPAth === undefined){
        walletPAth = HD_WALLET_PATH + 0;
        }
        // if( mnemonic.split('').length == 12 ) throw new Error('Invalid Mnemonic size.12 words expected');
        var HD_WALLET = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic, password));
        if (HD_WALLET == null) {
            throw new Error('No HD wallet defined!');
        }
        let wallet = HD_WALLET.derivePath(walletPAth).getWallet();
        var key = {};
        let address = '0x' + wallet.getAddress().toString("hex");
        let privateKey = wallet.getPrivateKey().toString("hex");
        let publicKey = wallet.getPublicKey().toString('hex');
        key.address = '0x' + address;
        key.privateKey = '0x' + privateKey;
        key.publicKey = '0x' + publicKey;
        key.fileName = wallet.getV3Filename();
        key.fileContents = wallet.toV3(password);
        key.mnemonic = mnemonic;
        key.entropy = bip39.mnemonicToEntropy(mnemonic,bip39.wordlists.english);
        key.hdWalletPath = walletPAth;
        return key;
    },

    async getPrivateKeyFromSeed(account, mnemonic, password) {
        this.checkMnemonic(mnemonic);
        // if( mnemonic.split('').length == 12 ) throw new Error('Invalid Mnemonic size.12 words expected');
        // var HD_WALLET = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic, password));
        // if (HD_WALLET == null) {
        //     throw new Error('No HD wallet defined!');
        // }
        // var address = await this.getAddress(mnemonic, 0, password);
        // if (account === address) {
        //     key = await this.getWalletByPath(mnemonic, HD_WALLET_PATH + 0, password);
        //     console.log('Found!! ', key);
        //     // break;
        // }
        // // }
        return this.getWalletByPath(mnemonic,HD_WALLET_PATH+0,password);
    },
    async verifyPassword(username, password) {
        var user = await repo.findByUserName(username);
        if (!user) return false;
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        return passwordIsValid;
    },

    checkMnemonic(mnemonic){
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error("Mnemonic invalid or undefined")
          } 
    }
}