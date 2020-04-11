/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": ["javascripts/app.js"],
    "app.css": ["stylesheets/app.css"],
    "images/": "images/"
  },
  networks: {
    development: {
      host: '0.0.0.0',
      port: 8503,
      network_id: '2134',
      gas: 9000000000000000
    },
    ganache_cloud: {
      host: 'ec2-13-126-235-71.ap-south-1.compute.amazonaws.com',
      port: 80,
      //  from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      network_id: '2100',
      // gas: 9000000000000000,
      // gasPrice: 1
    },
 ganache: {
      host: 'localhost',
      port: 8545,
      //  from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      network_id: '2100',
      // gas: 9000000000000000,
      // gasPrice: 1
    },
    blockchain2: {
      host: 'localhost',
      port: 8501,
      // from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      network_id: '2134',
      gas: 9000000000000000
    },
    office: {
      host: 'localhost',
      port: 8551,
      // from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      network_id: '1114',
      gas: 9000000000000000
    }
},
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
  }
},
compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
}

