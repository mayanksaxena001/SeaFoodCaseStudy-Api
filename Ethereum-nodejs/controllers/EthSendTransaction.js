var Tx = require('ethereumjs-tx')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/7b30f9956886413c865cb55ee22c0b0a'))

var account1 = '0x4c40483b812030dbBD41ad121A83b939650096B9'
var account2 = '0xeA64e2142A2FbA1C269AF764601e8d3F09521cDC'

account1 = web3.toChecksumAddress(account1);
account2 = web3.toChecksumAddress(account2);

const pk = 'ec5a9e5872693ae3baf9f0dfebd740e20e9569daaeda0721e3cc9549ebd507e7';
const pk1 = new Buffer.from(pk, 'hex')

module.exports = {
    async sendEther() {
        var txCount = await web3.eth.getTransactionCount(account1);
        var balance1 = await web3.eth.getBalance(account1);
        var balance2 = await web3.eth.getBalance(account2);
        console.log('balance 1 :  ',balance1.toNumber());
        console.log('balance 2 :  ',balance2.toNumber());
        console.log("Txcount", txCount);
        if (txCount) {
            // create transaction object
            const txObject = {
                nonce: web3.toHex(txCount),
                value: web3.toHex(web3.toWei('0.2', 'ether')),
                gasLimit: web3.toHex(100000),
                gasPrice: web3.toHex(web3.toWei('4', 'gwei')),
                to: web3.toChecksumAddress(account2),
                from: web3.toChecksumAddress(account1)
            }
            // sign the transaction
            const tx = new Tx(txObject)
            tx.sign(pk1);
            console.log("Tx ", tx);

            const serializedTx = tx.serialize();
            const raw = '0x' + serializedTx.toString('hex')
            console.log("Raw ", raw);
            // broadcast the transaction
            web3.eth.sendRawTransaction(raw, (err, txHash) => {
                console.log('err: ', err, 'txHash', txHash)
            })
        }

    }
}