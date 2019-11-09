import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService } from '../login.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../login.component.css']
})
export class SignUpComponent implements OnInit {

  categoryType;
  categoryTypes;
  selectedCategory;
  signup: Signup;
  waiting = false;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

    localStorage.clear();

    this.initializeSignUp();

    this.categoryTypes = [
      {
        id: 0, type: 'PRODUCER'
      },
      {
        id: 1, type: 'SUPPLIER'
      },
      {
        id: 2, type: 'CONSUMER'
      }
    ]
  }

  initializeSignUp() {
    this.signup = {
      name: '',
      email: '',
      password: '',
      username: '',
      type: ''
    }
  }

  getSelectedCategory(selectedCategory) {

    this.selectedCategory = this.categoryTypes[selectedCategory].type;

    this.signup.type = this.selectedCategory;
  }

  signUp() {

    if (!this.signup.type) {
      swal("Error", "Please select category", "error");
      return;
    }

    this.waiting = true;

    this.loginService.signUp(this.signup).subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('loginPassword', this.signup.password);

          this.router.navigate(['/dashboard']);

        } else {
          swal('Error!', 'Authentication failed', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.status === 500) {
          swal('Error!', 'User Already Exists!', 'error');

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

}
