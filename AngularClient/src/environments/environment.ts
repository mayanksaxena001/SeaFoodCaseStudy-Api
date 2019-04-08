// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let value = 'http://localhost';
// value = 'http://ec2-13-234-34-69.ap-south-1.compute.amazonaws.com';
// value = 'http://172.19.0.3';
export const environment = {
  production: false,
  blockchainServiceUrl: value + ':8080/api/auth',
  blockchainContractServiceUrl: value + ':8080/contract',
  blockchainSensorUrl: value + ':8080/sensor',
  blockchainWalletUrl: value + ':8080/wallet',
  blockchainTokenUrl: value + ':8080/token',
  blockchainTradeUrl: value + ':8080/binance'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
