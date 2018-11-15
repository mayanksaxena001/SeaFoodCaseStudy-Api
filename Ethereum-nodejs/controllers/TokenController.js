var contract = require('truffle-contract');
var contractConfig = require('../config/contract.config');

var artifacts = require('../truffle/build/contracts/StandardToken.json');
var StandardToken = contract(artifacts);

class TokenController {
  constructor() {
    this._web3 = contractConfig._web3;
    this.StandardToken = StandardToken;
    this.init();
  }

  async init() {
    this.StandardToken.setProvider(this._web3.currentProvider);
    this.StandardToken.setNetwork(contractConfig.NETWORK_ID);
    this._instance = await this.StandardToken.at(contract_id.StandardToken);
    // this._web3.eth.defaultAccount = this._accounts[0];
    this._gas = {
      from: this._accounts[0],
      gas: contractConfig.getGasLimit()//9000000000000
    }
  }

  async transfer(_from,_to,_value) {
    var transaction =  await this._instance.transferFrom(_from,_to,_value,this._gas);
    return transaction;
  }

  async mintTokens(_value) {
    var transaction = await this._instance.mint(_value,this._gas);
    return transaction;
  }

  async getTokenDetails(){
    var details = await this._instance.tokenDetails();
    return details;
  }

  async balanceOf(_address) {
    return await this._instance.balanceOf(_address, this._gas);
  }


}
var _contract = new TokenController();
module.exports = {
  _contract
}