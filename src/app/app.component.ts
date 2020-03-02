import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '@app/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: ['']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private electronService: ElectronService) {}

  ngOnInit() {
    this.router.navigate(['landing'])
  }
 }