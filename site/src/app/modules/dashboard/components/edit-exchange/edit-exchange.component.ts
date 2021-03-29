import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ExchangesService } from '../../services/exchanges.service';

type ExchangeData = { key: string, [key: string]: string };

@Component({
  selector: 'app-edit-exchange',
  templateUrl: './edit-exchange.component.html',
  styleUrls: ['./edit-exchange.component.scss']
})
export class EditExchangeComponent implements OnInit {

  public form = new FormGroup({
    key: new FormControl('', [Validators.required]),
  })
  public availableExchanges$;
  private selectedExchange;

  get isNew() {
    return this.data === null;
  }

  get exchangeId() {
    if (this.isNew) {
      return null;
    }
    return this.data.id;
  }

  get isExchangeSelected() {
    return typeof this.selectedExchange !== 'undefined';
  }

  get selectedExchangeCredentials() {
    if (this.isExchangeSelected) {
      return this.selectedExchange.requiredCredentials;
    }
    return [];
  }

  constructor(
    private exchangesService: ExchangesService,
    private dialogRef: MatDialogRef<EditExchangeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ExchangeData,
  ) { }

  ngOnInit(): void {
    this.availableExchanges$ = this.exchangesService.getAvailableExchanges();
    if (!this.isNew) {
      this.selectExchange(this.data.key);
      this.form.patchValue(this.data);
    }
  }

  selectExchange(key) {
    this.availableExchanges$.pipe(map((exchanges: []) => exchanges.filter((e: any) => e.key === key)[0])).subscribe(v => {
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
      this._saveOrUpdate(this.form.value).subscribe(res => {
        this.dialogRef.close({saved: true});
      })
    }
  }

  private _saveOrUpdate(values) {
    if (this.isNew) {
      return this.exchangesService.createExchange(values);
    }
    return this.exchangesService.updateExchange(this.exchangeId, values);
  }
}
