import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from '../../interfaces/ChartData';


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
  @Input() size: number;

  currentData: any;

  canvas: HTMLCanvasElement; // your canvas element
  myChart: any;


  constructor() { }

  ngAfterViewInit() {
    this.initialDataSetup();
    this.createLineChart(this.currentData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.size && this.canvas) {
      this.canvas.style.width = changes.size.currentValue + 'px';
      this.canvas.style.height = changes.size.currentValue + 'px';
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
        this.currentData.labels.push(el.y);
      });
      this.currentData.datasets.push(x);
    });
    this.currentData.labels = [...new Set(this.currentData.labels)];
    console.log(this.currentData);
  }

  private updateXAxis(x: number) {
    const newData = [];
    this.data.datasets.forEach(trace => {
      const slice = trace.data.find(slice => slice.x == x);
      if (slice) {
        newData.push(slice.y);
      }
    });
    this.currentData.datasets[0].data = newData;
  }

  private createLineChart(data: any) {
    if (this.canvas) {
      this.chartDiv.nativeElement.removeChild(this.canvas);
    }
    this.canvas = document.createElement('canvas')
    this.chartDiv.nativeElement.appendChild(this.canvas);
    this.canvas.style.width = this.size + 'px';
    this.canvas.style.height = this.size + 'px';
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
              value: 2020,
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
            fontSize: 14
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
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: 'white',
            },
            scaleLabel: {
              display: true,
              fontSize: 18,
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
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: 'white',
              // max: this.chartMax
            },
            scaleLabel: {
              display: true,
              fontSize: 18,
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
    this.updateXAxis(year);
    this.updateChart();
  }

  public changeData(data: ChartData, x: number) {
    this.data = data;
    this.initialDataSetup();
    this.updateXAxis(x)
    this.myChart.destroy();
    this.createLineChart(this.currentData);
  }

  private updateChart() {
    if (this.data) {
      try {
        this.myChart.update();
      } catch (error) {
        console.log('Error. Failed to update Year for Line Chart.');
      }
    }

  }

}

