import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.css']
})
export class MenuButtonComponent implements OnInit {

  @ViewChild('background', { static: true }) backgroundDiv: ElementRef;
  @Input() text: string;
  @Input() color: string;
  @Input() active: boolean;

  constructor() {
    this.backgroundDiv.nativeElement.style.backgroundColor = this.color;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.active) {
      this.active = changes.active.currentValue;
      (this.active) ? this.backgroundDiv.nativeElement.style.backgroundColor = 'white' : this.backgroundDiv.nativeElement.style.backgroundColor = this.color
    }
  }

}
