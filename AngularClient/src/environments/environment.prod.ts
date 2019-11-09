let value = 'http://localhost:8080/api';
export const environment = {
  production: true,
  blockchainServiceUrl: value + '/auth',
  blockchainContractServiceUrl: value + '/contract',
  blockchainSensorUrl: value + '/sensor',
  blockchainWalletUrl: value + '/wallet',
  blockchainTokenUrl: value + '/token',
  blockchainTradeUrl: value + '/binance'
};
