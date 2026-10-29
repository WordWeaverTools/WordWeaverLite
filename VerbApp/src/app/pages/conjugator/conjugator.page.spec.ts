// TODO: Double check

import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
import { ConjugatorPage } from './conjugator.page';
import { DataService } from '../../services/data/data.service';

// Mock node class
class MockNode {
  constructor(private id: string, private children: MockNode[] = []) { }
  getId() { return this.id; }
  getChild(id: string) { return this.children.find(c => c.getId() === id) || new MockNode(id); }
  getChildren() { return this.children; }
}

describe('ConjugatorPage (Angular 16 migration)', () => {
  let component: ConjugatorPage;
  let fixture: ComponentFixture<ConjugatorPage>;
  let modalCtrlSpy: jest.Mocked<ModalController>;
  let dataServiceMock: any;

  const mockInformation = [
    { name: 'verb', cat: [{ id: 'v1', translation: 'to run', base: 'run' }], disabled: false },
    { name: 'tense', cat: [{ id: 't1', translation: 'past', base: 'ran' }], disabled: true },
    { name: 'person', cat: [{ id: 'p1', translation: 'I', base: 'I' }], disabled: true },
  ];


  beforeEach(waitForAsync(() => {
    modalCtrlSpy = {
      create: jest.fn().mockResolvedValue({
        present: jest.fn().mockResolvedValue(undefined),
        onWillDismiss: jest.fn().mockResolvedValue({ data: { id: '', translation: '', base: '' } }),
      }),
    } as any;

    dataServiceMock = {
      setinformation: mockInformation,
      tree: { getRoot: () => new MockNode('root', [new MockNode('v1')]) },
      conjugate: jest.fn().mockReturnValue([{ morphemes: [], translation: 'ran' }]),
    };

    TestBed.configureTestingModule({
      declarations: [ConjugatorPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: DataService, useValue: dataServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConjugatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const mockScrollToTop = jest.fn().mockResolvedValue(true);
    jest.spyOn(component, 'getContent').mockReturnValue({
      scrollToTop: mockScrollToTop
    } as any);
  }));

  // --- Lifecycle ---
  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize information from DataService', () => {
      expect(component.information.length).toBe(mockInformation.length);
    });

    it('should initialize selectedOptions keys for each category', () => {
      mockInformation.forEach(item => {
        expect(component.selectedOptions[item.name]).toEqual({ translation: '', id: '', base: '' });
      });
    });

    it('should expose BehaviorSubject stream', () => {
      expect(component.myFunInformation$).toBeInstanceOf(BehaviorSubject);
    });

    it('should default currentIndex to 0', () => {
      expect(component.currentIndex).toBe(0);
    });
  });

  // --- Reset ---
  describe('reset()', () => {
    beforeEach(() => {
      component.selectedOptions['verb'] = { translation: 'to run', id: 'v1', base: 'run' };
      component.show_result = true;
      component.currentIndex = 2;
      component.reset();
    });

    it('should clear all selectedOptions', () => {
      Object.values(component.selectedOptions).forEach(opt => {
        expect(opt).toEqual({ translation: '', id: '', base: '' });
      });
    });

    it('should reset currentIndex to 0', () => {
      expect(component.currentIndex).toBe(0);
    });

    it('should enable first category only', () => {
      expect(component.information[0].disabled).toBe(false);
      expect(component.information[1].disabled).toBe(true);
    });

    it('should hide result', () => {
      expect(component.show_result).toBe(false);
    });
  });

  // --- Category enable/disable ---
  describe('ableCat / disableLowerCat', () => {
    it('should enable category at valid index', () => {
      component.information[1].disabled = true;
      component.ableCat(1);
      expect(component.information[1].disabled).toBe(false);
    });

    it('should not throw on out-of-bounds index', () => {
      expect(() => component.ableCat(999)).not.toThrow();
    });

    it('should disable all categories at and after given index', () => {
      component.information.forEach(i => (i.disabled = false));
      component.disableLowerCat(1);
      expect(component.information[0].disabled).toBe(false);
      expect(component.information[1].disabled).toBe(true);
      expect(component.information[2].disabled).toBe(true);
    });
  });

  // --- setSelected ---
  describe('setSelected()', () => {
    it('should assign translation/id/base', () => {
      component.setSelected('verb', { translation: 'to eat', id: 'v2', base: 'eat' });
      expect(component.selectedOptions['verb']).toEqual({ translation: 'to eat', id: 'v2', base: 'eat' });
    });
  });

  // --- updatePath ---
  describe('updatePath()', () => {
    it('should set root child at index 0', () => {
      component.updatePath('verb', 0, { id: 'v1', translation: 'to run', base: 'run' });
      expect(component.selectedPath['verb']).toBeDefined();
      expect(component.currentIndex).toBe(1);
    });

    it('should call Conjugate when last category reached', () => {
      const spy = jest.spyOn(component, 'Conjugate');
      component.selectedPath['tense'] = new MockNode('t1', [new MockNode('p1')]) as any;
      component.updatePath('person', mockInformation.length - 1, { id: 'p1', translation: 'I', base: 'I' });
      expect(spy).toHaveBeenCalled();
    });
  });

  // --- skipSingleItemCat ---
  describe('skipSingleItemCat()', () => {
    it('should auto-select when category has single option', () => {
      const result = component.skipSingleItemCat(0);
      expect(result).toBeTruthy();
      expect(component.selectedOptions['verb'].id).toBe('v1');
    });

    it('should return false when multiple options exist', () => {
      component.information[0].cat = [{ id: 'a' } as any, { id: 'b' } as any];
      expect(component.skipSingleItemCat(0)).toBe(false);
    });
  });

  // --- Conjugate ---
  describe('Conjugate()', () => {
    it('should show error when options are incomplete', () => {
      component.Conjugate();
      expect(component.show_error).toBe(true);
      expect(component.error).toContain('choose an option');
    });

    it('should call service.conjugate when valid', () => {
      Object.keys(component.selectedOptions).forEach(k => {
        component.selectedOptions[k] = { translation: 't', id: 'x', base: 'b' };
      });
      component.Conjugate();
      expect(dataServiceMock.conjugate).toHaveBeenCalled();
      expect(component.show_result).toBe(true);
    });
  });

  // --- Modals ---
  describe('openModalSearch()', () => {
    it('should create modal with hasAudio=true for verb', async () => {
      await component.openModalSearch('verb', 0);
      expect(modalCtrlSpy.create).toHaveBeenCalledWith(
        expect.objectContaining({
          componentProps: expect.objectContaining({ hasAudio: true, conj_type: 'verb' }),
        }),
      );
    });

    it('should create modal with hasAudio=false for non-verb', async () => {
      await component.openModalSearch('tense', 1);
      expect(modalCtrlSpy.create).toHaveBeenCalledWith(
        expect.objectContaining({
          componentProps: expect.objectContaining({ hasAudio: false }),
        }),
      );
    });
  });

  describe('openModalToolTip()', () => {
    it('should create tooltip modal', async () => {
      await component.openModalToolTip('verb');
      expect(modalCtrlSpy.create).toHaveBeenCalled();
    });
  });

  // --- Audio ---
  describe('playSound()', () => {
    it('should instantiate and play audio', () => {
      const playSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
      const loadSpy = jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation();
      component.playSound();
      expect(loadSpy).toHaveBeenCalled();
      expect(playSpy).toHaveBeenCalled();
    });
  });
});
