// TODO: Confirm
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthButtonComponent } from './auth.component';
import { AuthService } from '@auth0/auth0-angular';

jest.mock('@auth0/auth0-angular');

describe('AuthButtonComponent', () => {
    let component: AuthButtonComponent;
    let fixture: ComponentFixture<AuthButtonComponent>;
    let mockAuthService: any; // Mocked is good for ts typing

    beforeEach(async () => {
        // Create mock AuthService
        mockAuthService = {
            loginWithRedirect: jest.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [AuthButtonComponent],
            providers: [
                { provide: AuthService, useValue: mockAuthService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AuthButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should inject AuthService', () => {
        expect(component.auth).toBeDefined();
        expect(component.auth).toBe(mockAuthService);
    });

    it('should render login button', () => {
        const button = fixture.nativeElement.querySelector('button');
        expect(button).toBeTruthy();
    });

    it('should call loginWithRedirect when login button is clicked', () => {
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(mockAuthService.loginWithRedirect).toHaveBeenCalledTimes(1);
    });

    it('should not call loginWithRedirect on component initialization', () => {
        expect(mockAuthService.loginWithRedirect).not.toHaveBeenCalled();
    });
});
