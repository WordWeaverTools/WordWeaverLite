import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TabsPage } from './tabs.page';
import { of } from 'rxjs';

// Mock ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn()
    }
  },
  queryParams: of({}),
  params: of({})
};

// Mock Ionic Config
const mockConfig = {
  get: jest.fn(),
  getBoolean: jest.fn().mockReturnValue(false),
  getNumber: jest.fn()
};

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(waitForAsync(() => {
    // Mock environment with requiresAuth: true
    jest.mock('../../../environments/environment', () => ({
      environment: {
        ttsConfig: {
          requiresAuth: true
        }
      }
    }));

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Config, useValue: mockConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // Basic component tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read requiresAuth value from environment', () => {
    expect(typeof component.requiresAuth).toBe('boolean');
  });

});


