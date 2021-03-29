import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditExchangeComponent } from './components/edit-exchange/edit-exchange.component';
import { ExchangesService } from './services/exchanges.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private exchangesService: ExchangesService,
  ) { }

  ngOnInit(): void {
  }

  createExchange() {
    const dialogRef = this.dialog.open(EditExchangeComponent, {
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

  syncBalances() {
    const snackBarRef = this._snackBar.open('Syncing balances!')
    this.exchangesService.syncBalances().subscribe(res => {
      snackBarRef.dismiss();
    })
  }

}
