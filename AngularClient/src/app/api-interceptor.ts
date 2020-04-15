import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth/auth.service';

/**
 * https://stackoverflow.com/questions/45735655/how-to-setup-baseurl-for-angular-httpclient
 */

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(@Inject('BASE_API_URL') private baseUrl: string, private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiReq = req.clone({
            setHeaders: { 'x-access-token': `${this.auth.getToken()}` },
            url: `${this.baseUrl}/${req.url}`,
        });
        return next.handle(apiReq);
    }
}
