import { Component, OnInit } from '@angular/core';
import { WindowService, PlanStateService, AppRoutes } from '@app/core';

@Component({
  selector: 'app-secondscreen-main-menu',
  templateUrl: './secondscreen-main-menu.component.html',
  styleUrls: ['./secondscreen-main-menu.component.css']
})
export class SecondscreenMainMenuComponent implements OnInit {

  text = 'Main Menu';

  constructor() { }

  ngOnInit(): void {

  }

}
