// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let value = 'http://localhost:8080/api';
// value = 'http://13.234.108.12:8080';
// value = 'https://bitcoincash.org.in/api';
// value = 'http://ec2-13-234-34-69.ap-south-1.compute.amazonaws.com';
// value = 'http://192.168.2.11:8080/api';
export const environment = {
  production: false,
  blockchainServiceUrl: value + '/auth',
  blockchainContractServiceUrl: value + '/contract',
  blockchainSensorUrl: value + '/sensor',
  blockchainWalletUrl: value + '/wallet',
  blockchainTokenUrl: value + '/token',
  blockchainTradeUrl: value + '/binance'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
