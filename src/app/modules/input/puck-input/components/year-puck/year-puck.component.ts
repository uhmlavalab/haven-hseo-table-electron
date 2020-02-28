import { Component, HostListener, AfterViewInit, ViewChildren, ViewChild, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ProjectableMarker } from '../../classes/ProjectableMarker';

@Component({
  selector: 'app-year-puck',
  templateUrl: './year-puck.component.html',
  styleUrls: ['./year-puck.component.css']
})
export class YearPuckComponent extends ProjectableMarker implements AfterViewInit {

  @ViewChildren('yearBoxWrapper') yearBoxes;
  @ViewChild('yearBoxWrapper', {static: false}) yearBoxWrapper;

  @Input() minYear: number;
  @Input() maxYear: number;
  @Input() currentYear: number;

  private numberOfYears: number;
  private years: {year: number, filled: boolean}[] = [];

  private angle: number;
  private yearBoxElements: any[];
  private currentPosition: number;
  private YEAR_PUCK_COLOR: string = 'rgba(147, 93, 201)';

  constructor(private detectorRef: ChangeDetectorRef) {
    super();
   }

  ngAfterViewInit() {
    this.currentPosition = 0;
    this.numberOfYears = this.maxYear - this.minYear + 1;
    for (let i = 0; i < this.numberOfYears; i++) {
      this.years.push({year: i + this.minYear, filled: false});
    }
    this.detectorRef.detectChanges();
    this.yearBoxElements = this.yearBoxes.first.nativeElement.children;
    this.positionElements(this.yearBoxElements);
    this.colorNodes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentYear) {
      this.currentYear = changes.currentYear.currentValue;
      this.colorNodes();
    }
  }

  /** Colors each of the year nodes.
   * 
   */
  private colorNodes() {
    for (let i = 0; i < this.numberOfYears; i++) {
      if (i <= this.currentYear - this.minYear) {
        this.yearBoxElements[i].style.backgroundColor = this.YEAR_PUCK_COLOR;
      } else {
        this.yearBoxElements[i].style.backgroundColor = 'transparent';
      }
    }
  }

  /** Positions the nodes around the puck
   * @param elements the HTML elements to position.
   */
  private positionElements(elements) {
    this.angle = 360 / elements.length;
    this.currentPosition = 0;

    for (const e of elements) {
      e.style.transform = `rotate(${this.currentPosition}deg) translate(55px)`;
      this.currentPosition += this.angle;
    }

    this.yearBoxWrapper.nativeElement.style.transform = 'rotate(-90deg)';
  }



}
