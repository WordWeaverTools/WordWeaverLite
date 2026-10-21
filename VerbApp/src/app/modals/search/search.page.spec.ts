import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { SearchPage } from './search.page';
import { EveryVoiceService } from '@everyvoice/every-voice';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let modalController: jest.Mocked<ModalController>;
  let ttsService: jest.Mocked<EveryVoiceService>;

  const mockOptions = [
    { id: 'mêtawêVAI', base: 'mêtawê', translation: 'play1', type_color: 'verb' },
    { id: 'jouer1', base: 'jouer', translation: 'play2', type_color: '' },
  ];

  beforeEach(async () => {
    const modalControllerMock = {
      dismiss: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockResolvedValue({
        present: jest.fn().mockResolvedValue(true),
        onWillDismiss: jest.fn().mockReturnValue(Promise.resolve({})),
      }),
    };

    const ttsServiceMock = {};

    await TestBed.configureTestingModule({
      declarations: [SearchPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerMock },
        { provide: EveryVoiceService, useValue: ttsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController) as jest.Mocked<ModalController>;
    ttsService = TestBed.inject(EveryVoiceService) as jest.Mocked<EveryVoiceService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize matches with options', () => {
      component.options = mockOptions;
      component.ngOnInit();
      expect(component.matches).toEqual(mockOptions);
    });

    it('should not override existing type_color', () => {
      component.options = mockOptions;
      component.conj_type = 'noun';
      component.ngOnInit();
      expect(component.matches[0].type_color).toBe('verb');
      expect(component.matches[1].type_color).toBe('noun');
    });
  });

  describe('selectItem', () => {
    it('should set selectedItem and selectedItemID', () => {
      const item = mockOptions[0];
      component.selectItem(item);
      expect(component.selectedItem).toEqual(item);
      expect(component.selectedItemID).toBe('mêtawêVAI');
    });


    it('should call selectAbled and closeModalWithData', () => {
      jest.spyOn(component, 'selectAbled');
      jest.spyOn(component, 'closeModalWithData');
      component.selectItem(mockOptions[0]);
      expect(component.selectAbled).toHaveBeenCalled();
      expect(component.closeModalWithData).toHaveBeenCalled();
    });
  });

  describe('selectAbled', () => {
    it('should set isDisabled to true when no item selected', () => {
      component.selectedItem = '';
      component.selectAbled();
      expect(component.isDisabled).toBe(true);
    });

    it('should set isDisabled to false when item selected', () => {
      component.selectedItem = mockOptions[0] as any;
      component.selectAbled();
      expect(component.isDisabled).toBe(false);
    });
  });

  describe('closeModalWithData', () => {
    it('should dismiss modal with selectedItem', async () => {
      component.selectedItem = mockOptions[0] as any;
      await component.closeModalWithData();
      expect(modalController.dismiss).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  describe('closeModal', () => {
    it('should dismiss modal without data', async () => {
      await component.closeModal();
      expect(modalController.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('matchTranslation', () => {
    beforeEach(() => {
      component.options = mockOptions;
    });

    it('should return items matching translation query', () => {
      component.query = 'play1';
      const results = component.matchTranslation();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('mêtawêVAI');
    });

    it('should be case insensitive', () => {
      component.query = 'PLAY';
      const results = component.matchTranslation();
      expect(results).toHaveLength(2);
    });

    // TODO: Tests for search matching once more functionality is written
  });

  describe('matchBase', () => {
    beforeEach(() => {
      component.options = mockOptions;
    });

    it('should return items matching base query', () => {
      component.query = 'mêtawê';
      const results = component.matchBase();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('mêtawêVAI');
    });

    it('should return empty array when no matches', () => {
      component.query = 'nomatch';
      const results = component.matchBase();
      expect(results).toEqual([]);
    });
  });

  describe('getResults', () => {
    beforeEach(() => {
      component.options = mockOptions;
    });

    it('should update matches with search results', () => {
      const event = { target: { value: 'mêtawê' } };
      component.getResults(event);
      expect(component.matches.length).toBeGreaterThan(0);
    });

    it('should show all options when query is empty', () => {
      const event = { target: { value: '' } };
      component.getResults(event);
      expect(component.matches).toEqual(mockOptions);
    });

    it('should combine base and translation matches', () => {
      jest.spyOn(component, 'matchBase').mockReturnValue([mockOptions[0]]);
      jest.spyOn(component, 'matchTranslation').mockReturnValue([mockOptions[1]]);
      const event = { target: { value: 'play' } };
      component.getResults(event);
      expect(component.matchBase).toHaveBeenCalled();
      expect(component.matchTranslation).toHaveBeenCalled();
    });
  });

  describe('openModalToolTip', () => {
    it('should create and present modal', async () => {
      await component.openModalToolTip('verb');
      expect(modalController.create).toHaveBeenCalled();
    });
  });

  describe('playSound', () => {
    it('should set rawText', () => {
      const text = 'test audio';
      component.playSound(text);
      expect(component.rawText).toBe(text);
    });
  });
});
