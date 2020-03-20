import { Component, OnInit, Input } from '@angular/core';
import { MapLayer } from '@app/core';

@Component({
  selector: 'app-battery-info',
  templateUrl: './battery-info.component.html',
  styleUrls: ['./battery-info.component.css']
})
export class BatteryInfoComponent implements OnInit {

  @Input() mapLayer: MapLayer;
  constructor() { }

  ngOnInit(): void {
  }

}
