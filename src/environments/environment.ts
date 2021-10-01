// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true,
  NODE_NO_WARNINGS:1,
  authTokenKey: '', // You have to switch this, when your real back-end is done
//  baseUrl: 'http://10.3.150.58/BeINMaximusApi',
 baseUrl: 'http://localhost:58386',
 baseAdminServiceUrl: 'https://10.3.150.58/beinCCServices/',
 baseChartServiceUrl: 'https://10.3.150.58/beINCCChartServices/'
  // baseUrl: 'http://localhost:53733'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
