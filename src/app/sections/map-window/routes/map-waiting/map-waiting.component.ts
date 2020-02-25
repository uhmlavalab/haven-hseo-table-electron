import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-waiting',
  templateUrl: './map-waiting.component.html',
  styleUrls: ['./map-waiting.component.css']
})
export class MapWaitingComponent implements OnInit {

  text = 'Waiting';
  
  constructor() { }

  ngOnInit(): void {
  }

}
