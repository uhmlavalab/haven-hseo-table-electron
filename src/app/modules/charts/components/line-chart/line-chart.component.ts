import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface LineData {
  datasets: {
    name: string,
    color: string,
    data: { year: number, value: number }[]
  }[],
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements AfterViewInit, OnChanges {

  @ViewChild('lineDiv', { static: true }) chartDiv: ElementRef;
  @Input() data: LineData;
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
        x.data.push({ x: el.year, y: el.value })
        this.currentData.labels.push(el.year);
      });
      this.currentData.datasets.push(x);
    });
    this.currentData.labels = [...new Set(this.currentData.labels)];
    console.log(this.currentData);
  }

  private updateYear(year: number) {
    const newData = [];
    this.data.datasets.forEach(trace => {
      const slice = trace.data.find(slice => slice.year == year);
      if (slice) {
        newData.push(slice.value);
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
    this.updateYear(year);
    this.updateChart();
  }

  public changeData(data: LineData, year: number) {
    this.data = data;
    this.initialDataSetup();
    this.updateYear(year)
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

