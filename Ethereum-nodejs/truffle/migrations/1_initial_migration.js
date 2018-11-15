var SeaFoodContract = artifacts.require("./SeaFoodContract.sol");
var StateContract = artifacts.require("./StateContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SeaFoodContract);
  deployer.deploy(StateContract);
};
