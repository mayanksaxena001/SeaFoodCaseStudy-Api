var telemetrycore_contract_json = require('../build/contracts/TelemetryCore.json');
module.exports = (web3) => {
  var _name = 'TelemetryCore'/* var of type string here */;

  var telemetryCore = web3.eth.contract(telemetrycore_contract_json.abi);
  export default telemetryCoreContract = telemetryCore.new(
    _name,
    {
      from: web3.eth.accounts[0],
      //  data: ', 
      gas: web3.eth.getBlock("latest").gasLimit
    }, function (e, contract) {
      console.log(e, contract);
      if (typeof contract !== 'undefined') {
        console.log('Contract mined! address: ' + contract._eth.coinbase + ' transactionHash: ' + contract.transactionHash);
      }
    })
}
