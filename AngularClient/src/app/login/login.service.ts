import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    login(loginCredentials: Login) {
        localStorage.setItem('isAppServiceUrl', JSON.stringify(true));

        return this.http.post<Token>('login', loginCredentials);
    }

    logout() {
        localStorage.setItem('isAppServiceUrl', JSON.stringify(true));

        return this.http.put<Token>('logout', {});

    }

    signUp(signUpDetails: Signup) {
        localStorage.setItem('isAppServiceUrl', JSON.stringify(true));

        return this.http.post<Token>('signup', signUpDetails);

    }

    getUserDetails() {
        localStorage.setItem('isAppServiceUrl', JSON.stringify(true));

        return this.http.get<User>('user');
    }
}
