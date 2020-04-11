// var FCTToken = artifacts.require("./FCTToken.sol");
var TelemetryCore = artifacts.require("../contracts/TelemetryCore.sol");
var AssetTransfer = artifacts.require("../contracts/AssetTransfer.sol");
var XFTToken = artifacts.require("../contracts/XFT.sol");
// var Migrations = artifacts.require("./Migrations.sol");
var fs = require('fs');
module.exports = function (deployer) {
  deployer.then(async () => {
    // var instance = await deployer.deploy(FCTToken);
    var xftContractAddr = await deployer.deploy(XFTToken, 10000000000, 'XFT', 5, 'XFT');
    var telemetryContractAddr = await deployer.deploy(TelemetryCore);
    var assetTransferContractAddr = await deployer.deploy(AssetTransfer, 'Mayank', telemetryContractAddr.address);
    console.log('XFT token contract address : ', xftContractAddr.address)
    console.log('Telemetry contract address : ', telemetryContractAddr.address)
    console.log('AssetTransfer contract address : ', assetTransferContractAddr.address)
    // await deployer.deploy(Migrations);
    var stream = fs.createWriteStream('deployed_contracts.txt');
    stream.once('open', (fd) => {
      stream.write('CONTRACT_XFT_TOKEN=' + xftContractAddr.address + '\n');
      stream.write('CONTRACT_TELEMETRY=' + telemetryContractAddr.address + '\n');
      stream.write('CONTRACT_ASSET_TRANSFER=' + assetTransferContractAddr.address + '\n');
      stream.end();
    });
  })
};