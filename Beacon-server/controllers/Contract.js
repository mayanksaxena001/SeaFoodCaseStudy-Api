var Web3 = require('web3')
if (typeof web3 !== 'undefined') {
    var _web3 = new Web3(web3.currentProvider)
} else {
    var _web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8501'))
}
module.exports = {
    _web3
};