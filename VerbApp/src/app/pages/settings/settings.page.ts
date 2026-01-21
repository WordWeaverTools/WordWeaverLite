
import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";
import { Router } from '@angular/router';
 import { EveryVoiceService } from "@everyvoice/every-voice";
 import { Speaker } from "@everyvoice/every-voice";
 import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  defaultSpeaker: Speaker = environment.ttsConfig.defaultSpeaker;

  constructor(public auth: AuthService,
    private router: Router,
    private tts: EveryVoiceService,
    @Inject(DOCUMENT) public document: Document) { }

  ngOnInit() {}

  login() {
    this.auth.loginWithRedirect();
  }

  ttsSpeakerChange(event: any) {
    console.log("b4 this.tts.speakerID",this.tts.speakerID);
    const speaker: Speaker = event.detail.value;
    this.tts.speakerID = speaker;
    console.log("after this.tts.speakerID",this.tts.speakerID);
  }

}


