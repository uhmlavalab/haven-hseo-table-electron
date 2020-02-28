import { Component, OnInit } from '@angular/core';

import { mapLayerColors } from '../../../../../assets/plans/defaultColors';
export interface LayerItem {
  name: string;
  active: boolean;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.css']
})
export class LayerListComponent implements OnInit {

  layers: LayerItem[] = [
    {
      name: 'DOD',
      active: true,
      color: mapLayerColors.Dod.fill + '32',
      icon: 'assets/plans/oahu/images/icons/dod-icon.png'
    },
    {
      name: 'Agriculture',
      active: false,
      color: mapLayerColors.Agriculture.fill + '32',
      icon: 'assets/plans/oahu/images/icons/agriculture-icon.png'

    },
    {
      name: 'Existing RE',
      active: true,
      color: mapLayerColors.Existing_RE.fill + '32',
      icon: 'assets/plans/oahu/images/icons/existing_re-icon.png'

    },
    {
      name: 'Solar',
      active: true,
      color: mapLayerColors.Solar.fill + '32',
      icon: 'assets/plans/oahu/images/icons/solar-icon.png'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
