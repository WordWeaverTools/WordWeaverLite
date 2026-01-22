import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import { EveryVoiceService } from "@everyvoice/every-voice";
import { Speaker } from "@everyvoice/every-voice";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  defaultSpeaker: Speaker = environment.ttsConfig.defaultSpeaker;

  deferredPrompt: any;
  showInstallButton: Boolean = false;
  browser: String = "";

  constructor(
    public auth: AuthService,
    private router: Router,
    public tts: EveryVoiceService,
    @Inject(DOCUMENT) public document: Document,
  ) {}

  ngOnInit() {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      console.log("beforeinstallprompt event fired", e);
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
    });

    setTimeout(() => {
      if (!this.deferredPrompt) {
        console.log("beforeinstallprompt event did NOT fire");
      }
    }, 3000); // 3 seconds after init

    const userAgent = navigator.userAgent;
    console.log(userAgent);
    if (userAgent.includes("Chrome")) {
      this.browser = "Chrome";
    } else if (userAgent.includes("Firefox")) {
      this.browser = "Firefox";
    } else if (userAgent.includes("Safari")) {
      this.browser = "Safari";
    } else if (userAgent.includes("Edge")) {
      this.browser = "Edge";
    } else {
      this.browser = "unknown";
    }
  }

  login() {
    this.auth.loginWithRedirect();
  }

  ttsSpeakerChange(event: any) {
    const speaker: Speaker = event.detail.value;
    this.tts.speakerID = speaker;
  }

  addToHomeScreen() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt(); // show prompt

    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      this.deferredPrompt = null;
    });
  }
}
