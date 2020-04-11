import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AccountBalance, BinanceCred, MyTrade } from './binance';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    constructor(private http: HttpClient) { }

    updateCredentials(cred: BinanceCred) {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.put('modify/credentials', cred, { responseType: 'text' });
    }

    feedCredentials(cred: BinanceCred) {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.post<BinanceCred>('feed/credentials', cred);
    }

    getCredentials(): any {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.get<BinanceCred>('fetch/credentials');
    }

    getMyTrades(): any {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.get<MyTrade>('fetch/account/trades/');
    }

    buyAll(): any {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.post<any>('all/order/buy', {});
    }

    sellAll(): any {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.post<any>('all/order/sell', {});
    }

    fetchMarkets(): any {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.get<any>('fetch/markets');
    }

    fetchAccountBalance(): Observable<AccountBalance[]> {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.get<AccountBalance[]>('fetch/account/balances');
    }
}
