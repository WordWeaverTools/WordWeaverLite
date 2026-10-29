import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import {
  Result,
  ResultClass,
  ResultClassNameIndex,
  ResultMorphemeNameIndex,
  Tier,
} from "../../models/result.model";

import { EveryVoiceService } from "@everyvoice/every-voice";


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent implements OnInit {

  @Input() data!: Result;
  @Input() tier!: Tier;
  @Input() hasAudio = false;

  output: Result = [];
  morphType: number = ResultMorphemeNameIndex.breakdown;
  resultIndex: number = ResultClassNameIndex.result;
  nameIndex: number = ResultClassNameIndex.name;
  orderIndex: number = ResultClassNameIndex.order;

  rawText: string = "";
  constructor(public tts: EveryVoiceService) { }

  ngOnInit(): void {
    console.log("this.data", this.data);
    this.rawText = this.data.map((m) => m[ResultMorphemeNameIndex.value]).join("");
    console.log("this.rawText", this.rawText);
  }



}
