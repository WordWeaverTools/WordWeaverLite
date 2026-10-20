import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";
import { AuthService } from "@auth0/auth0-angular";
import { EveryVoiceService } from "@everyvoice/every-voice";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  requiresAuth: boolean = environment.ttsConfig.requiresAuth;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private tts: EveryVoiceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Authentication
    if (this.requiresAuth) {
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        this.tts.ttsEnabledAndAuthenticated$.next(isAuthenticated);
      });
    }
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
