import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CurrencyConverterService } from './currency-converter.service';

type Exchange = { id: string, key: string, assets: { [key: string]: string } }

type ExchangesResponse = [Exchange];

@Injectable({
  providedIn: 'root'
})
export class ExchangesService {

  constructor(
    private http: HttpClient,
    private currencyConverterService: CurrencyConverterService,
  ) {
  }

  getAvailableExchanges() {
    return this.http.get(environment.api + '/exchanges');
  }

  getAssets() {
    return this.http.get(environment.api + '/profile/exchanges').pipe(map((exchanges: ExchangesResponse) => {
      const res = {};
      for (const exchange of exchanges) {
        const assets = exchange.assets;
        for (const assetKey in assets) {
          res[assetKey] = (res[assetKey] || 0) + assets[assetKey];
        }
      }
      return res;
    }))
    .pipe(concatMap(async assets => {
      const res = [];
      for (const symbol in assets) {
        const symbolPrice = await this.currencyConverterService.conver(symbol).toPromise();
        res.push({key: symbol, value: assets[symbol], price: symbolPrice});
      }
      return res;
    }));
  }

  getExchanges() {
    return this.http.get<ExchangesResponse>(environment.api + '/profile/exchanges');
  }

  createExchange(exchangeData) {
    return this.http.post(environment.api + '/profile/exchanges', exchangeData);
  }

  syncBalances() {
    return this.http.get(environment.api + '/profile/exchanges/sync-balances');
  }
}
