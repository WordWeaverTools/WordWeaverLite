import { EveryVoiceConfig } from "@everyvoice/every-voice";

export const everyVoiceConfig: EveryVoiceConfig = {

  enableTTS: true,
  requiresAuth: true,
  apiUrl: "https://unbq-sgile-text-to-speech.hf.space",
  availableSpeakers: [{ display: "Tina", slug: "tina" }, {display: "Wayne", slug: "wayne"}], // Optional: Available Speaker IDs for TTS
  defaultSpeaker: { display: "Tina", slug: "tina" }, // Optional: Speaker ID for TTS
  diffusionSteps: 3, // Optional: Number of steps for TTS
  domain: "unbq-everyvoice.ca.auth0.com", // Optional: Auth0 Domain
  clientId: "7jLB2de2XqEGsAbXLEnUjB49P35r8gQH", // Optional: Auth0 ClientId
  middlewareEndpoint: "https://unbq-crk-tts-middleware-ee6d73382adb.herokuapp.com/tts", // Optional: Middleware endpoint
  audience: "https://unbq.everyvoice.middleware.ca", // Optional: Auth0 audience
  // domain: "dev-qioor1nubb5vu3uw.ca.auth0.com", // Optional: Auth0 Domain
  // clientId: "6jhqRWJ6YM9zKsmwzq55y64zv4N13Jfe", // Optional: Auth0 ClientId
  // audience: "test-middleware"
}


export const environment = {
  production: true,
  ttsConfig: everyVoiceConfig,
};
