import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy,
  Input
 } from '@angular/core';

 import{
  Result, 
  ResultMorphemeNameIndex,
  Tier,
 } from "../../models/result.model";

 import { EveryVoiceService } from "@everyvoice/every-voice";

//  import { AudioService } from '../../services/audio/audio.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent implements OnInit {

  @Input() data: Result;
  @Input() tier: Tier;
  @Input() hasAudio = false;

  output: Result;
  morphType: number;
  rawText: string;
  constructor(public tts: EveryVoiceService) { }

  ngOnInit(): void {
    // Filter empty values and sort on position
    this.morphType = ResultMorphemeNameIndex.breakdown;
    this.output = this.data;
    console.log("this.output", this.output);
    this.rawText = this.output.map((m) => m[ResultMorphemeNameIndex.value]).join("");
    console.log("this.rawText",this.rawText);
    }



}
