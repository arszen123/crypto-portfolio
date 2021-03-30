import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CurrencyConverterService } from './currency-converter.service';

type Exchange = { id: string, key: string, assets: { [key: string]: string } }
type ExchangesResponse = [Exchange];
type AvailableExchange = { key: string, name: string, www: string, logo: string, requiredCredentials: string[] }
type Asset = { key: string, value: number, price: number };
type GeneralResponse = { success: boolean, message?: string };

@Injectable({
  providedIn: 'root'
})
export class ExchangesService {

  private assets$: ReplaySubject<Asset[]>;
  private availableExchanges$: Observable<AvailableExchange[]>;
  private exchanges$: ReplaySubject<ExchangesResponse>;

  constructor(
    private http: HttpClient,
    private currencyConverterService: CurrencyConverterService,
  ) {
  }

  /**
   * Get supported exchanges
   */
  getAvailableExchanges() {
    if (!this.availableExchanges$) {
      this.availableExchanges$ = this.http.get<AvailableExchange[]>(environment.api + '/exchanges').pipe(shareReplay({ refCount: true, bufferSize: 1 }));
    }
    return this.availableExchanges$;
  }

  /**
   * Get user available assets on exchanges
   */
  getAssets(): Observable<Asset[]> {
    if (!this.assets$) {
      this.assets$ = new ReplaySubject(1);
      this._updateAssets();
    }

    return this.assets$;
  }

  /**
   * Get user saved exchanges
   */
  getExchanges(): Observable<ExchangesResponse> {
    if (!this.exchanges$) {
      this.exchanges$ = new ReplaySubject(1);
      this._updateExchanges();
    }
    return this.exchanges$;
  }

  createExchange(exchangeData) {
    return this.http.post<GeneralResponse>(environment.api + '/profile/exchanges', exchangeData).pipe(tap(() => {
      this.syncBalances().subscribe();
      this._updateExchanges();
    }));
  }

  updateExchange(exchangeId, exchangeData) {
    return this.http.put<GeneralResponse>(environment.api + `/profile/exchanges/${exchangeId}`, exchangeData).pipe(tap(() => {
      this.syncBalances().subscribe();
      this._updateExchanges();
    }));
  }

  deleteExchange(exchangeId) {
    return this.http.delete<GeneralResponse>(environment.api + `/profile/exchanges/${exchangeId}`).pipe(tap(() => {
      this.syncBalances().subscribe();
      this._updateExchanges();
    }));
  }

  /**
   * Synchronize user assets balances, and refressh assets.
   */
  syncBalances() {
    return this.http.get<GeneralResponse>(environment.api + '/profile/exchanges/sync-balances').pipe(tap(() => {
      this._updateAssets();
    }));
  }

  /**
   * Refresh assets
   */
  private _updateAssets() {
    (this.http.get(environment.api + '/profile/exchanges').pipe(
      map(this._sumAssetsFromExchanges),
      mergeMap(assets => forkJoin(this._setAssetsPrice(assets)))
    ) as Observable<Asset[]>).subscribe(res => this.assets$.next(res));
  }

  /**
   * Refresh user saved exchanges.
   */
  private _updateExchanges() {
    this.http.get<ExchangesResponse>(environment.api + '/profile/exchanges').subscribe(res => this.exchanges$.next(res));
  }

  private _sumAssetsFromExchanges(exchanges: ExchangesResponse) {
    const res = {};
    for (const exchange of exchanges) {
      const assets = exchange.assets;
      for (const assetKey in assets) {
        res[assetKey] = (res[assetKey] || 0) + assets[assetKey];
      }
    }
    return res;
  }

  private _setAssetsPrice(assets: any) {
    const res = [];
    for (const symbol in assets) {
      const assetWithPrice = this.currencyConverterService.converToUsd(symbol).pipe(map(symbolPrice => {
        return { key: symbol, value: assets[symbol], price: symbolPrice }
      }));
      res.push(assetWithPrice);
    }
    return res;
  }
}
