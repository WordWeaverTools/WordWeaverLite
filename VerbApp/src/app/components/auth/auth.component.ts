import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "ww-app-auth-button",
  template: '<button (click)="auth.loginWithRedirect()">Log in</button>',
})
export class AuthButtonComponent {
  // Inject the authentication service into component through the constructor
  constructor(public auth: AuthService) { }
}
