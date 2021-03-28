import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ExchangesService } from '../../services/exchanges.service';

@Component({
  selector: 'app-edit-exchange',
  templateUrl: './edit-exchange.component.html',
  styleUrls: ['./edit-exchange.component.scss']
})
export class EditExchangeComponent implements OnInit {

  public form = new FormGroup({
    key: new FormControl('', [Validators.required]),
  })
  public $availableExchanges;
  private selectedExchange;

  constructor(
    private exchangesService: ExchangesService,
    private dialogRef: MatDialogRef<EditExchangeComponent>
  ) { }

  ngOnInit(): void {
    this.$availableExchanges = this.exchangesService.getAvailableExchanges();
  }

  get selectedExchangeCredentials() {
    return (this.selectedExchange || {}).requiredCredentials;
  }

  selectExchange(key) {
    this.$availableExchanges.pipe(map((exchanges: []) => exchanges.filter((e: any) => e.key === key)[0])).subscribe(v => {
      this.selectedExchange = v;
      for (const key in this.form.controls) {
        key !== 'key' && this.form.removeControl(key);
      }
      for (const credential of this.selectedExchangeCredentials) {
        this.form.addControl(credential, new FormControl('', [Validators.required]));
      }
    });
  }

  saveExchange() {
    if (this.form.valid) {
      this.exchangesService.createExchange(this.form.value).subscribe(res => {
        this.dialogRef.close({saved: true});
      })
    }
  }
}
