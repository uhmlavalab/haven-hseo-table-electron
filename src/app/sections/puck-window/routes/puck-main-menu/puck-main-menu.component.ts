import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-puck-main-menu',
  templateUrl: './puck-main-menu.component.html',
  styleUrls: ['./puck-main-menu.component.css']
})
export class PuckMainMenuComponent implements OnInit {

  planText = "Select Plan"
  planColor = "green";
  planActive = true;

  calText = "Puck Calibration"
  calColor = "green";
  calActive = false;

  restartText = "Restart";
  restartColor = "yellow";
  restartActive = false;

  exitText = "Exit";
  exitColor = "red"
  exitActive = false;

  constructor() { }

  ngOnInit(): void {
  }

}
