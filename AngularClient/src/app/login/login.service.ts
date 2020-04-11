import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, Token, Signup, User } from './login';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    login(loginCredentials: Login) {
        return this.http.post<Token>('auth/login', loginCredentials);
    }

    logout() {
        return this.http.put<Token>('auth/logout', {});
    }

    signUp(signUpDetails: Signup) {
        return this.http.post<Token>('auth/signup', signUpDetails);
    }

    getUserDetails() {
        return this.http.get<User>('auth/user');
    }
}
