// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import { EveryVoiceConfig } from "@everyvoice/every-voice";

export const everyVoiceConfig: EveryVoiceConfig = {
  enableTTS: true,
  requiresAuth: true,
  apiUrl: "",
  availableSpeakers: [{ display: "", slug: "" }], // Optional: Available Speaker IDs for TTS
  defaultSpeaker: { display: "", slug: "" }, // Optional: Speaker ID for TTS
  diffusionSteps: 3, // Optional: Number of steps for TTS
  domain: "", // Optional: Auth0 Domain
  clientId: "", // Optional: Auth0 ClientId
  middlewareEndpoint: "", // Optional: Middleware endpoint
  audience: "", // Optional: Auth0 audience
}


export const environment = {
  production: false,
  ttsConfig: everyVoiceConfig,
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
