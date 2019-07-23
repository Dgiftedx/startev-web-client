// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  cloudinary: {
  	cloud_name : 'startev', 
    api_key: '257256259453978', 
    api_secret: '39Q7GNO2ZJTDqrtVcJaxIvdEC_A', 
    upload_preset: 'tvje9bug'
  },
  laddaConfig : {
    style: "expand-right",
    spinnerSize: 35,
    spinnerLines: 15
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
