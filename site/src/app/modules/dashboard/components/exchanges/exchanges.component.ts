import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ExchangesService } from '../../services/exchanges.service';
import { EditExchangeComponent } from '../edit-exchange/edit-exchange.component';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit {

  public exchenges$: Observable<any>;
  public availableExchanges$;

  constructor(
    private exchangesService: ExchangesService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.exchenges$ = this.exchangesService.getExchanges()
      .pipe(
        mergeMap(exchanges => forkJoin(this._addExchangeInfo(exchanges)))
      );
  }

  editExchange(exchange) {
    const dialogRef = this.dialog.open(EditExchangeComponent, {
      data: {...exchange},
      width: '25%',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res.saved) {
        this._snackBar.open('Exchange saved!', 'Cool', {
          duration: 2000,
        })
      }
    })
  }

  deleteExchange(id) {
    this.exchangesService.deleteExchange(id).subscribe(res => {
      if (res && res.success) {
        this._snackBar.open('Exchange deleted!', 'Ok', {
          duration: 2000,
        })
      }
    });
  }

  private _addExchangeInfo(exchanges) {
    const res = [];
    for (const exchange of exchanges) {
      const info = this.exchangesService.getAvailableExchanges()
        .pipe(
          map(exchangesInfo => exchangesInfo.filter(e => e.key === exchange.key)[0]),
          map(info => { return { ...exchange, www: info.www, logo: info.logo, name: info.name } })
        );
      res.push(info);
    }
    return res;
  }

}
