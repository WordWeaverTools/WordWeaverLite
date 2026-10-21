import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { VerbTooltipPage } from './verb-tooltip.page';

describe('VerbtooltipPage', () => {
  let component: VerbTooltipPage;
  let fixture: ComponentFixture<VerbTooltipPage>;
  let modalController: jest.Mocked<ModalController>;

  // Mock tooltip data
  const mockTips = [
    { type: 'tense', tip: '<p>tense tip</p>' },
    { type: 'subject', tip: '<p>subject tip</p>' },
    { type: 'verb', tip: '<p>verb tip</p>' }
  ];

  beforeEach(waitForAsync(() => {
    // Mock ModalController
    const modalControllerMock = {
      dismiss: jest.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      declarations: [VerbTooltipPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerbTooltipPage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController) as jest.Mocked<ModalController>;

    component.tips = mockTips;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTip()', () => {
    it('should return correct tip for matching conj_type', () => {
      component.conj_type = 'tense';
      const result = component.getTip();
      expect(result).toBe('<p>tense tip</p>');
    });

    it('should return empty string when no matching tip found', () => {
      component.conj_type = 'nonexistent';
      const result = component.getTip();
      expect(result).toBe('');
    });
  });

  describe('closeModal()', () => {
    it('should call modalController.dismiss', async () => {
      await component.closeModal();
      expect(modalController.dismiss).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {

    it('should render tip content via innerHTML', () => {
      component.conj_type = 'verb';
      fixture.detectChanges();
      const description = fixture.nativeElement.querySelector('.description');
      expect(description.innerHTML).toBe('<p>verb tip</p>');
    });


    it('should call closeModal when OK button clicked', () => {
      const closeModalSpy = jest.spyOn(component, 'closeModal');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('ion-button.cancel');
      button.click();
      expect(closeModalSpy).toHaveBeenCalled();
    });
  });
});
