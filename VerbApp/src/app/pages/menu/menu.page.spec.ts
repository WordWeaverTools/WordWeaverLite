import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { MenuPage } from './menu.page';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// Mock Ionic Config
const mockConfig = {
  get: jest.fn(),
  getBoolean: jest.fn().mockReturnValue(false),
  getNumber: jest.fn()
};

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MenuPage],
      imports: [IonicModule.forRoot(), FormsModule, RouterModule, RouterTestingModule],
      providers: [
        { provide: Config, useValue: mockConfig }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
