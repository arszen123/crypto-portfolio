import { Component, OnInit } from '@angular/core';
import { ExchangesService } from '../../services/exchanges.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public chartType: ChartType = 'doughnut';
  public data = [];
  public labels = [];
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


  public chartLegend$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => !result.matches),
      shareReplay()
    );

  constructor(
    private exchangesService: ExchangesService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    const _getNextColor = (() => { let i = 0; return () => ['green', 'orange', 'cyan', 'red', 'blue'][i++ % 5] })();
    this.exchangesService.getAssets().subscribe((assets: any) => {
      this.labels = [];
      this.data = [];
      for (const asset of assets) {
        this.labels.push(asset.key);
        this.data.push(asset.value * asset.price);
        this.chartColors[0].backgroundColor.push('dark' + _getNextColor());
      }
    })
  }

}
