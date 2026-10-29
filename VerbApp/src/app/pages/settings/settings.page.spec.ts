import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { EveryVoiceService, Speaker } from '@everyvoice/every-voice';
import { of, throwError } from 'rxjs';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockTtsService: jest.Mocked<EveryVoiceService>;
  let mockDocument: Document;

  const mockSpeakers: Speaker[] = [
    { display: 'Speaker 1', slug: "slug1" } as Speaker,
    { display: 'Speaker 2', slug: "slug2" } as Speaker
  ];

  beforeEach((() => {
    mockAuthService = {
      loginWithRedirect: jest.fn().mockReturnValue(of(void 0)), // of() converts the arguments to an observable sequence. Like making a mock observable value
      logout: jest.fn().mockReturnValue(of(void 0)),
      isAuthenticated$: of(false),
      user$: of(null)
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockTtsService = {
      speakers$: of(mockSpeakers),
      speakerID: mockSpeakers[0]
    } as any;

    mockDocument = document; // window document

    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: EveryVoiceService, useValue: mockTtsService },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;

    jest.useFakeTimers();
  }));
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('PWA Install Prompt', () => {

    describe('beforeinstallprompt NOT firing', () => {

      it('should keep install button hidden when event never fires', () => {
        fixture.detectChanges(); // Trigger ngOnInit

        // Fast-forward past the timeout
        jest.advanceTimersByTime(3000);
        jest.runOnlyPendingTimers();

        expect(component.deferredPrompt).toBeNull();
        expect(component.showInstallButton).toBeFalsy();
      });
    });

    describe('beforeinstallprompt DOES fire', () => {

      it('should capture event and show install button', () => {
        const mockEvent = {
          preventDefault: jest.fn(),
          prompt: jest.fn()
        };

        // Dispatch event before timeout
        window.dispatchEvent(new CustomEvent('beforeinstallprompt', { detail: mockEvent }));

        // Need to manually trigger the handler since CustomEvent won't match type
        component['boundBeforeInstallPrompt'](mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(component.deferredPrompt).toBe(mockEvent);
        expect(component.showInstallButton).toBeTruthy();
      });
    });
    describe('Detecting Browser', () => {

      it('should detect Chrome browser', () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 Chrome/91.0',
          configurable: true
        });
        component.ngOnInit();
        expect(component.browser).toBe('Chrome');
      });

      it('should detect Firefox browser', () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 Firefox/89.0',
          configurable: true
        });
        component.ngOnInit();
        expect(component.browser).toBe('Firefox');
      });

      it('should detect Safari browser', () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
          configurable: true
        });

        component.ngOnInit();
        expect(component.browser).toBe('Safari');
      });
    });
  });





  describe('login', () => {
    it('should call loginWithRedirect with correct appState', () => {
      component.login();
      expect(mockAuthService.loginWithRedirect).toHaveBeenCalledWith({
        appState: { target: '/tabs/settings' }
      });
    });

    it('should handle login errors', () => {
      mockAuthService.loginWithRedirect = jest.fn().mockReturnValue(
        throwError(() => ({ message: 'Login failed' }))
      );
      component.login();
      // Error handling is in subscribe callback
    });
  });

  describe('logout', () => {
    it('should call logout with correct returnTo URL', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalledWith({
        logoutParams: { returnTo: expect.stringContaining('/auth-callback') }
      });
    });
  });

  describe('ttsSpeakerChange', () => {
    it('should update TTS speaker', () => {
      const mockEvent = {
        detail: { value: mockSpeakers[1] }
      };
      component.ttsSpeakerChange(mockEvent);
      expect(mockTtsService.speakerID).toBe(mockSpeakers[1]);
    });
  });

  describe('addToHomeScreen', () => {
    it('should return early if no deferredPrompt', () => {
      component.deferredPrompt = null;
      const result = component.addToHomeScreen();
      expect(result).toBeUndefined();
    });

    it('should prompt and handle acceptance', async () => {
      const mockPrompt = jest.fn();
      const mockUserChoice = Promise.resolve({ outcome: 'accepted' });
      component.deferredPrompt = {
        prompt: mockPrompt,
        userChoice: mockUserChoice
      };

      component.addToHomeScreen();
      expect(mockPrompt).toHaveBeenCalled();
      await mockUserChoice;
      expect(component.deferredPrompt).toBeNull();
    });

    it('should handle user dismissal', async () => {
      const mockPrompt = jest.fn();
      const mockUserChoice = Promise.resolve({ outcome: 'dismissed' });
      component.deferredPrompt = {
        prompt: mockPrompt,
        userChoice: mockUserChoice
      };

      component.addToHomeScreen();
      await mockUserChoice;
      expect(component.deferredPrompt).toBeNull();
    });
  });
});
