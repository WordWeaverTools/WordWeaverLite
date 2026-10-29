// Example partially followed: https://github.com/jestjs/jest/blob/main/examples/angular/app.component.spec.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular'; // The Platform service can be used to get information about your current device. - https://ionicframework.com/docs/angular/platform
import { AuthService } from '@auth0/auth0-angular';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { EveryVoiceService } from '@everyvoice/every-voice';


// Mocked Cordova plugins [using manual mock - https://jestjs.io/docs/manual-mocks]
// Module-level mocking
jest.mock('@awesome-cordova-plugins/splash-screen/ngx', () => ({
  SplashScreen: jest.fn() // Returns a new, unused mock function. Optionally takes a mock implementation. (https://jestjs.io/docs/jest-object#jestfnimplementation)
}));

jest.mock('@awesome-cordova-plugins/status-bar/ngx', () => ({
  StatusBar: jest.fn()
}));

jest.mock('@everyvoice/every-voice', () => ({
  EveryVoiceService: jest.fn()
}));

describe('AppComponent', () => { // describe creates a block that groups together several related tests
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>; //https://v17.angular.io/api/core/testing/ComponentFixture
  let mockPlatform: any;
  let mockSplashScreen: any;
  let mockStatusBar: any;
  let mockAuthService: any;
  let mockTts: any;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isAuthenticatedSubject = new BehaviorSubject<boolean>(true);

    mockPlatform = {
      ready: jest.fn().mockResolvedValue('cordova')
    };

    mockSplashScreen = {
      hide: jest.fn()
    };

    mockStatusBar = {
      styleDefault: jest.fn()
    };

    mockAuthService = {
      isAuthenticated$: isAuthenticatedSubject.asObservable()
    };

    mockTts = {
      ttsEnabledAndAuthenticated$: { next: jest.fn() }
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useValue: mockPlatform },
        { provide: SplashScreen, useValue: mockSplashScreen },
        { provide: StatusBar, useValue: mockStatusBar },
        { provide: AuthService, useValue: mockAuthService },
        { provide: EveryVoiceService, useValue: mockTts }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });



  describe('Authentication', () => {

    it('should initialize requiresAuth from environment config', () => {
      expect(app.requiresAuth).toBe(environment.ttsConfig.requiresAuth);
    });

    it('should set up auth subscription when when requiresAuth is true', () => {
      app.requiresAuth = true;
      isAuthenticatedSubject.next(true);
      app.initializeApp();

      expect(mockTts.ttsEnabledAndAuthenticated$.next).toHaveBeenCalledWith(true);
    });

    it('should not set up auth subscription when requiresAuth is false', () => {
      app.requiresAuth = false;

      jest.clearAllMocks();
      app.initializeApp();

      expect(mockTts.ttsEnabledAndAuthenticated$.next).not.toHaveBeenCalled();
    });

    it('should emit false when user is not authenticated', () => {
      app.requiresAuth = true;
      isAuthenticatedSubject.next(false);
      app.initializeApp();

      expect(mockTts.ttsEnabledAndAuthenticated$.next).toHaveBeenCalledWith(false);
    });
  });
});
