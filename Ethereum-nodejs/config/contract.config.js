var Web3 = require('web3');
if (typeof web3 !== 'undefined') {
  var _web3 = new Web3(web3.currentProvider)
} else {
  var _web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8503'))
}
const Wallet = require('ethereumjs-wallet');
// Transaction id should be replaced in the file to connect ot the backend
const CONTRACT_ADDRESS = {
  AssetTransferContract: '0x5bd370ac3210c5a39cae6f8973571ca29706957c',
  TelemetryCoreContract: '0x64608459aeee81db14ecbe577007ccb26e99057e',
  SeaFoodContract: '0xe0069998731086939970f57a6a9558864b605042',
  StateContract: '0xc01af623758f56a50d6a879e7a65d24ffe1aa913',
  StandardToken: '0x435eb45ac9e60980d6069c275397b8f7b3af2d18'
}
// _web3.eth.isListening()
//    .then(() => console.log('is connected'))
//    .catch(e => console.log('Wow. Something went wrong'));

const NETWORK_ID = '*';
module.exports = {
  _web3,
  CONTRACT_ADDRESS,
  NETWORK_ID,
  Wallet,
  getGasLimit() {
    return _web3.eth.getBlock("latest").gasLimit;
  },
  isWeb3Connected() {
    return _web3.isConnected();
  }
};