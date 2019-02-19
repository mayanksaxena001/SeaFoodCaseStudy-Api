import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';

/**
 * https://stackoverflow.com/questions/45735655/how-to-setup-baseurl-for-angular-httpclient
 */

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let blockchainServiceUrl = environment.blockchainServiceUrl;
        let blockchainContractServiceUrl = environment.blockchainContractServiceUrl;
        let blockchainSensorUrl = environment.blockchainSensorUrl;

        let blockchainWalletUrl = environment.blockchainWalletUrl;
        let blockchainTokenUrl = environment.blockchainTokenUrl;

        let serviceUrl;

        if (JSON.parse(localStorage.getItem('isAppServiceUrl')) === true) {
            serviceUrl = blockchainServiceUrl;

        } else if (JSON.parse(localStorage.getItem('isContractUrl')) === true) {
            serviceUrl = blockchainContractServiceUrl;

        } else if (JSON.parse(localStorage.getItem('isSensorUrl')) === true) {
            serviceUrl = blockchainSensorUrl;
        }
        else if (JSON.parse(localStorage.getItem('isWalletUrl')) === true) {
            serviceUrl = blockchainWalletUrl;
        }
        else if (JSON.parse(localStorage.getItem('isTokenUrl')) === true) {
            serviceUrl = blockchainTokenUrl;
        }

        const apiReq = req.clone({
            url: `${serviceUrl}/${req.url}`,
            headers: req.headers.set('x-access-token', `${this.auth.getToken()}`)
        });

        localStorage.removeItem('isAppServiceUrl');
        localStorage.removeItem('isContractUrl');
        localStorage.removeItem('isSensorUrl');
        localStorage.removeItem('isWalletUrl');
        localStorage.removeItem('isTokenUrl');

        return next.handle(apiReq);
    }
}
