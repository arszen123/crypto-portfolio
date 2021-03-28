import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { ExchangesService } from '../../services/exchanges.service';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit {

  public $exchenges;

  constructor(
    private exchangesService: ExchangesService,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.$exchenges = this.exchangesService.getExchanges();
  }

  editExchange(exchange) {
    this._snackBar.open('TODO', 'Ok', {
      duration: 2000,
    })
  }
 
}
