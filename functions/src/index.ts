// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
'use-strict';
import './firebase-init';
export { initExcuse } from './callers/init-excuse.function';
export { generateExcuse } from './callers/generate-excuse.function';
