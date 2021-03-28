import { Component, OnInit } from '@angular/core';
import { ExchangesService } from '../../services/exchanges.service';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public chartType: ChartType = 'doughnut';
  public data = [];
  public labels = [];
  public chartLegend = true;
  public chartColors = [
    {
      backgroundColor: [],
    },
  ];
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: 'white',
      },
    }
  };

  constructor(
    private exchangesService: ExchangesService,
  ) { }

  ngOnInit(): void {
    const _getNextColor = (() => { let i = 0; return () => ['green', 'orange', 'cyan', 'red', 'blue'][i++ % 5] })();
    this.exchangesService.getAssets().subscribe((assets: any) => {
      for (const asset of assets) {
        this.labels.push(asset.key);
        this.data.push(asset.value * asset.price);
        this.chartColors[0].backgroundColor.push('dark' + _getNextColor());
      }
    })
  }

}
