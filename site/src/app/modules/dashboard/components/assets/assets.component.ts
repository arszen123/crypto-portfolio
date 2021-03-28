import { Component, OnInit } from '@angular/core';
import { ExchangesService } from '../../services/exchanges.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  public $assets;

  constructor(
    private exchangesService: ExchangesService
  ) { }

  ngOnInit(): void {
    this.$assets = this.exchangesService.getAssets();
  }

}
