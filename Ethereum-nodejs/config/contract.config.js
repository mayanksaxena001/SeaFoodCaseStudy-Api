var Web3 = require('web3');
const env = process.env;
// import {Debug} from 'web3-eth-debug';
if (typeof web3 !== 'undefined') {
  var _web3 = new Web3(web3.currentProvider)
} else {
  var _web3 = new Web3(new Web3.providers.HttpProvider(env.WEB3_URL))
}

// const debug = new Debug(web3.givenProvider || 'ws://localhost:8501', null, options);
const Wallet = require('ethereumjs-wallet');
// Transaction id should be replaced in the file to connect ot the backend
const CONTRACT_ADDRESS = {
  AssetTransferContract: env.CONTRACT_ASSET_TRANSFER,
  TelemetryCoreContract: env.CONTRACT_TELEMETRY,
  XFTTokenContract: env.CONTRACT_XFT_TOKEN,
}
// _web3.eth.isListening()
//    .then(() => console.log('is connected'))
//    .catch(e => console.log('Wow. Something went wrong'));

const NETWORK_ID = env.NETWORK_ID;
module.exports.default = {
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