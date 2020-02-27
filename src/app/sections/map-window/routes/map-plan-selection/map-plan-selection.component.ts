import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-plan-selection',
  templateUrl: './map-plan-selection.component.html',
  styleUrls: ['./map-plan-selection.component.css']
})
export class MapPlanSelectionComponent implements OnInit {

  availablePlans = [
    {
      name: 'Oahu'
    },
    {
      name : 'Maui'
    },
    {
      name: 'Big Island'
    },
    {
      name: 'Puerto Rico'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
