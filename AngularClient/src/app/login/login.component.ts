import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService } from './login.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  waiting = false;
  loginCredentials: Login;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

    localStorage.clear();

    this.loginCredentials = {
      username: '',
      password: ''
    }
  }

  login() {

    this.waiting = true;

    this.loginService.login(this.loginCredentials).subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('loginPassword', this.loginCredentials.password);

          this.router.navigate(['/dashboard']);

        } else {
          swal('Error!', 'Authentication failed', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.status === 404) {
          swal('Error!', 'User does not exist!', 'error');

        } else {
          if (err.error instanceof Error) {
            console.log('An error occurred: ', err.error.message); // client
          } else {
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
          }

          swal('Error!', 'Something went wrong. Please try again.', 'error');
        }

      }
    );
  }

  signUp() {
    this.router.navigate(['/signup']);

  }

}
