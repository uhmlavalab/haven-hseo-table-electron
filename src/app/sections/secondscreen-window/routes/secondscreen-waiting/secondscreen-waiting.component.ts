import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-secondscreen-waiting',
  templateUrl: './secondscreen-waiting.component.html',
  styleUrls: ['./secondscreen-waiting.component.css']
})
export class SecondscreenWaitingComponent implements OnInit {

  text = 'Waiting';
  
  constructor() { }

  ngOnInit(): void {
  }

}
