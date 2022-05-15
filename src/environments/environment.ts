// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST : 'http://localhost:8090',
  TOKEN_AUTH_USERNAME : 'proteusapp',
  TOKEN_AUTH_PASSWORD : 'jhsmao5182proteus',
  TOKEN_NAME : 'access_token',
  PERMISOS_NAME : 'permisos',
  COMPLETE_NAME : 'nombre_completo',
  REINTENTOS : 2
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
