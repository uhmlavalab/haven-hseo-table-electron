import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from '../../interfaces/ChartData';
import { ElementSize } from '@app/core';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit, OnChanges  {


  @ViewChild('pieDiv', { static: true }) chartDiv: ElementRef;
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
    this.createPieChart(this.currentData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.size && this.canvas) {
      this.canvas.style.width = changes.size.currentValue.width + 'px';
      this.canvas.style.height = changes.size.currentValue.height + 'px';
    }
  }


  private initialDataSetup() {
    const year = this.data.datasets[0].data[0].x;
    this.currentData = {
      labels: [],
      datasets: [{
        year: year,
        data: [],
        backgroundColor: [],
        borderColor: ['white'],
        borderWidth: 4
      }]
    };
    this.data.datasets.forEach(trace => {
      const slice = trace.data.find(slice => slice.x == year);
      if (slice) {
        this.currentData.labels.push(trace.name);
        this.currentData.datasets[0].data.push(slice.y);
        this.currentData.datasets[0].backgroundColor.push(trace.color);
        this.currentData.datasets[0].borderColor.push('white');
      }
    });
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

  private createPieChart(data: any) {
    if (this.canvas) {
      this.chartDiv.nativeElement.removeChild(this.canvas);
    }
    this.canvas = document.createElement('canvas')
    this.chartDiv.nativeElement.appendChild(this.canvas);
    this.canvas.style.width = this.size.width + 'px';
    this.canvas.style.height = this.size.height + 'px';
    const canvasContext = this.canvas.getContext('2d');
    this.myChart = new Chart(canvasContext, {
      type: 'pie',
      options: {
        title: {
          display: true,
          text: this.title,
          position: 'top',
          fontColor: 'white', 
          fontSize: this.fontSize ,

        },
        legend: {
          display: this.legend,
          labels: {
            fontColor: 'white',
            fontStyle: 'bold',
            fontSize: this.fontSize - 4 ,
          }
        },
        responsive: false,
        plugins: {
          labels: [{
            render: 'label',
            position: 'border',
            fontSize: this.fontSize - 8 ,
            overlap: false,
            fontStyle: 'bold',
            fontColor: 'white',
          },
          {
            render: 'percentage',
            fontColor: 'white',
            fontSize: this.fontSize - 10 ,
            fontStyle: 'bold',
            overlap: false,
          }]
        },
      },
      data
    });
  }

  public changeXAxis(x: number) {
    this.updateXAxis(x);
    this.updateChart();
  }

  public changeData(data: ChartData, x: number) {
    this.data = data;
    this.initialDataSetup();
    this.updateXAxis(x)
    this.myChart.destroy();
    this.createPieChart(this.currentData);
  }

  private updateChart() {
    if (this.data) {
      try {
        this.myChart.update();
      } catch (error) {
        console.log('Error. Failed to update Year for Pie Chart.');
      }
    }

  }

}

