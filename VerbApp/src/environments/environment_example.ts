import { EveryVoiceConfig } from "@everyvoice/every-voice";

export const everyVoiceConfig: EveryVoiceConfig= {
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


