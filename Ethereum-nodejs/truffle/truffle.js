// Allows us to use ES6 in our migrations and tests.

module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": ["javascripts/app.js"],
    "app.css": ["stylesheets/app.css"],
    "images/": "images/"
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8501,
      network_id: '2134', // Match any network id
      //gas: 94000000
    },
    test: {
      host: '127.0.0.1',
      port: 8502,
      network_id: '2134', // Match any network id
      // gas: 94000000
    },
    test1: {
      host: '127.0.0.1',
      port: 8503,
      network_id: '2134', // Match any network id
      // gas: 94000000
    },
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      // gas: 94000000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
}
