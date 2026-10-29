// TODO: confirm

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ResultComponent } from './result.component';
import { EveryVoiceService, EveryVoiceComponent } from '@everyvoice/every-voice';
import { Result, ResultMorphemeNameIndex, Tier } from '../../models/result.model';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';



@Component({
  selector: 'lib-every-voice',
  template: '',
  standalone: false
})
class MockEveryVoiceComponent {
  @Input() textToGenerate!: string;
}



describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let mockEveryVoiceService: jest.Mocked<EveryVoiceService>;


  const mockTierNoSep: Tier = {
    name: 'display',
    key: ResultMorphemeNameIndex.value,
    position: 0,
    separator: ''
  };

  const mockTierWithSep: Tier = {
    name: "breakdown",
    key: ResultMorphemeNameIndex.value,
    position: 1,
    separator: "-",
  };

  const mockData: Result = [
    ['see', 'verb'],
    ['ing', 'tense']
  ];

  beforeEach(async () => {
    mockEveryVoiceService = {
      // todo: is this fine empty?
    } as jest.Mocked<EveryVoiceService>;


    await TestBed.configureTestingModule({
      declarations: [ResultComponent, MockEveryVoiceComponent],
      providers: [
        { provide: EveryVoiceService, useValue: mockEveryVoiceService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the result component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.data = mockData;
      component.tier = mockTierNoSep;
      jest.spyOn(console, 'log').mockImplementation();
    });

    describe('empty sepatory', () => {
      it('should create rawText by joining morphemes together', () => {
        component.ngOnInit();
        expect(component.rawText).toBe('seeing');
      });

      it('should handle empty data array', () => {
        component.data = [];
        component.ngOnInit();
        expect(component.output).toEqual([]);
        expect(component.rawText).toBe('');
      });

      it('should handle single morpheme', () => {
        component.data = [['see', 'verb']];
        component.ngOnInit();
        expect(component.rawText).toBe('see');
      });
    });
    // TODO: Implement morpheme separation first then test
    /*
    describe('dash sepatory', () => {
      it('should create rawText by joining morphemes together', () => {
        component.tier = mockTierWithSep;
        component.ngOnInit();
        // todo: pick up back here
        expect(component.rawText).toBe('see-ing');
      });
    });

    it('should render separators between morphemes (except last)', () => {
      component.tier = mockTierWithSep;
      component.ngOnInit();
      fixture.detectChanges();

      const separators = fixture.nativeElement.querySelectorAll('.separator');
      expect(separators.length).toBe(1);
    });


    it('should not render separator after last morpheme', () => {
      const lastSeparator = fixture.nativeElement.querySelectorAll('.separator');
      const allSpans = fixture.nativeElement.querySelectorAll('span');
      expect(lastSeparator.length).toBe(mockData.length - 1);
    });
    */
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.data = mockData;
      component.tier = mockTierNoSep;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render all morphemes', () => {
      const spans = fixture.nativeElement.querySelectorAll('span:not(.separator)');
      expect(spans.length).toBe(2);
    });

    it('should apply dynamic class based on morpheme breakdown', () => {
      const firstSpan = fixture.nativeElement.querySelector('span');
      expect(firstSpan.className).toContain('verb');
    });

    it('should display morpheme value based on tier key', () => {
      const ionTexts = fixture.nativeElement.querySelectorAll('ion-text');
      expect(ionTexts[0].textContent.trim()).toBe('see');
      expect(ionTexts[1].textContent.trim()).toBe('ing');
    });

  });


  describe('Audio Functionality', () => {
    beforeEach(() => {
      component.data = mockData;
      component.tier = mockTierNoSep;
      component.ngOnInit();
    });

    it('should render lib-every-voice when hasAudio is true', () => {
      component.hasAudio = true;
      fixture.detectChanges();
      const everyVoice = fixture.nativeElement.querySelector('lib-every-voice');
      expect(everyVoice).toBeTruthy();
    });

    it('should not render lib-every-voice when hasAudio is false', () => {
      component.hasAudio = false;
      fixture.detectChanges();
      const everyVoice = fixture.nativeElement.querySelector('lib-every-voice');
      expect(everyVoice).toBeFalsy();
    });

    it('should pass rawText to lib-every-voice textToGenerate input', () => {
      component.hasAudio = true;
      component.rawText = 'seeing';
      fixture.detectChanges();
      const mockComponentDebugEl = fixture.debugElement.query(
        By.directive(MockEveryVoiceComponent)
      );
      const mockComponentInstance = mockComponentDebugEl.componentInstance as MockEveryVoiceComponent;
      expect(mockComponentInstance.textToGenerate).toBe('seeing');

    });
  });


  describe('Edge Cases', () => {
    it('should handle special characters in morpheme values', () => {
      component.data = [['see%', 'verb'], ['ing!', 'person']];
      component.tier = mockTierNoSep;
      component.ngOnInit();

      expect(component.rawText).toBe('see%ing!');
    });

    it('should handle morphemes with empty strings', () => {
      component.data = [['see', 'verb'], ['', 'person']];
      component.tier = mockTierNoSep;
      component.ngOnInit();

      expect(component.rawText).toBe('see');
    });

    it('should handle unicode characters', () => {
      component.data = [['ᐊᐱ', 'verb'], ['ᐘᐠ', 'person']];
      component.tier = mockTierNoSep;
      component.ngOnInit();

      expect(component.rawText).toBe('ᐊᐱᐘᐠ');
    });
  });
});
