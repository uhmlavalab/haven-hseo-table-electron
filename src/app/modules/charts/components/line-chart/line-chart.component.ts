import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from '../../interfaces/ChartData';
import { ElementSize } from '@app/core';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit, OnChanges {

  @ViewChild('lineDiv', { static: true }) chartDiv: ElementRef;
  @Input() data: ChartData;
  @Input() title: string;
  @Input() legend: boolean;
  @Input() fontSize: number;
  @Input() size: ElementSize;

  currentData: any;

  canvas: HTMLCanvasElement; // your canvas element
  myChart: any;


  constructor() { }

  ngAfterViewInit() {
    this.initialDataSetup();
    this.createLineChart(this.currentData, 2016);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.size && this.canvas) {
      this.canvas.style.height = changes.size.currentValue.height + 'px';
      this.canvas.style.width = changes.size.currentValue.width + 'px';
    }
  }

  private initialDataSetup() {
    this.currentData = {
      labels: [],
      datasets: []
    };
    this.data.datasets.forEach(trace => {

      const x = {
        label: trace.name,
        backgroundColor: trace.color,
        borderColor: trace.color,
        pointRadius: 0,
        fill: false,
        data: [],
      };
      trace.data.forEach(el => {
        x.data.push({ x: el.x, y: el.y })
        this.currentData.labels.push(el.x);
      });
      this.currentData.datasets.push(x);
    });
    this.currentData.labels = [...new Set(this.currentData.labels)];
  }

  private createLineChart(data: any, x: number) {
    if (this.canvas) {
      this.chartDiv.nativeElement.removeChild(this.canvas);
    }
    this.canvas = document.createElement('canvas')
    this.chartDiv.nativeElement.appendChild(this.canvas);
    this.canvas.style.width = this.size.width + 'px';
    this.canvas.style.height = this.size.height + 'px';
    const canvasContext = this.canvas.getContext('2d');
    this.myChart = new Chart(canvasContext, {
      type: 'line',
      options: {
        responsive: false,
        annotation: {
          annotations: [
            {
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: x,
              borderWidth: 3,
              borderColor: 'white',
              borderDash: [5, 5],
              label: {
                content: 2020,
                enabled: true,
                position: 'top'
              }
            }
          ]
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontStyle: 'bold',
            fontSize: this.fontSize - 4
          }
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: this.fontSize - 4,
              fontStyle: 'bold',
              fontColor: 'white',
            },
            scaleLabel: {
              display: true,
              fontSize: this.fontSize,
              fontStyle: 'bold',
              fontColor: '#FFFFFF',
              labelString: 'Year'
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: this.fontSize - 4,
              fontStyle: 'bold',
              fontColor: 'white',
              // max: this.chartMax
            },
            scaleLabel: {
              display: true,
              fontSize: this.fontSize,
              fontStyle: 'bold',
              fontColor: '#FFFFFF',
              labelString: 'Capacity (MW)'
            }
          }]
        }
      },
      data
    });
  }

  public changeYear(year: number) {
    this.updateChart(year);
  }

  public changeData(data: ChartData, x: number) {
    this.data = data;
    this.initialDataSetup();
    this.myChart.destroy();
    this.createLineChart(this.currentData, x);
  }

  private updateChart(year: number) {
    if (this.data) {
      try {
        this.myChart.options.annotation.annotations[0].value = year;
        this.myChart.options.annotation.annotations[0].label.content = year;
        this.myChart.update();
      } catch (error) {
        console.log('Error. Failed to update Year for Line Chart.');
      }
    }

  }

}

