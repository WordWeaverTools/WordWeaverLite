import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ResultComponent } from "./result/result.component";
import { EveryVoiceModule } from "@everyvoice/every-voice";
import { AuthButtonComponent } from "./auth/auth.component";
import { provideAuth0 } from "@auth0/auth0-angular";
import { environment } from "src/environments/environment";
@NgModule({
  declarations: [AuthButtonComponent, ResultComponent],
  imports: [CommonModule, IonicModule, EveryVoiceModule.forChild()],
  exports: [ResultComponent],
  providers: [
    provideAuth0({
      domain: environment.ttsConfig.domain,
      clientId: environment.ttsConfig.clientId,
      authorizationParams: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: window.location.origin,
        audience: environment.ttsConfig.audience,
      },
    }),
  ],
})
export class SharedComponentsModule {}
