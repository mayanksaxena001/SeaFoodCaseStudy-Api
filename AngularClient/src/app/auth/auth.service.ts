import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    getToken(): string {
        // console.log('getToken called , Token : ', localStorage.getItem('authToken'));
        return localStorage.getItem('authToken');
    }
    //TODO :  need a isAuthenticatedMethod() method

}