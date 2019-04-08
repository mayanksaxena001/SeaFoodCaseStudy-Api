import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BinanceService {

    constructor(private http: HttpClient) { }

    authenticate(cred: any) {
        localStorage.setItem('isTradeUrl', JSON.stringify(true));

        return this.http.post<any>('binance/feed/credentials', cred);
    }
}
