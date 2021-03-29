import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {

  constructor(private http: HttpClient) { }

  converToUsd(symbol) {
    if (symbol.indexOf('USD') !== -1) {
      return of(1);
    }
    return this.http.get(environment.api + '/prices', {
      params: {symbol: `${symbol}USDT`},
    }).pipe(map((res: any) => {
      if (typeof res.price !== 'undefined') {
        return Number.parseFloat(res.price);
      }
      return 0;
    }));
  }
}
