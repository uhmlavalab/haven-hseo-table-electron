import { Component, OnInit } from '@angular/core';

export interface LegendItem  {
  name: string;
  color: string;
}

@Component({
  selector: 'app-layer-info',
  templateUrl: './layer-info.component.html',
  styleUrls: ['./layer-info.component.css']
})
export class LayerInfoComponent implements OnInit {

  legendItems: LegendItem[] = 
  [
    {
      name: 'Level 4',
      color: 'darkgreen'
    },
    {
      name: 'Level 3',
      color: 'green'
    },
    {
      name: 'Level 2',
      color: 'lightgreen'
    },
    {
      name: 'Level 1',
      color: 'lime'
    }
  ]

  layerName = 'Agriculture';

  constructor() { }

  ngOnInit(): void {
  }

}
