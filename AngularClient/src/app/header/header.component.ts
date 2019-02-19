import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { LoginService } from '../login/login.service';
import { DashboardService } from '../dashboard/dashboard.service';

import swal from 'sweetalert2';

declare let $: any;
declare function escape(s: string): string;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../dashboard/dashboard.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  showGetPrivateKeyForm = true;
  waiting = false;
  user: User;
  profileDetailsVisible = false;
  navBarVisible: boolean;
  subscription: Subscription;
  tokenValue: number;

  userAddress: string;
  userAddresses: Account[];
  amountToTransfer: number;
  walletPath;
  walletMnemonic;
  loginPassword;
  wallet: WalletModal;

  @ViewChild('requestTokenForm') requestTokenForm: any;
  @ViewChild('transferTokenForm') transferTokenForm: any;
  @ViewChild('getPrivateKeyForm') getPrivateKeyForm: any;

  constructor(private loginService: LoginService, private router: Router,
    private dashboardService: DashboardService) {

    this.subscription = dashboardService.navBar.subscribe(
      navBar => {

        this.navBarVisible = navBar;

        if (this.navBarVisible) {

          this.user = JSON.parse(localStorage.getItem('UserDetails'));
          this.getAllUsers();

        }
      }
    );
  }

  ngOnInit() {

    this.profileDetailsVisible = false;

    if (this.navBarVisible) {
      this.user = JSON.parse(localStorage.getItem('UserDetails'));
      // this.getAllUsers();
    }

    this.initialiseData();
  }

  initialiseData() {
    this.wallet = {
      address:'',
      privateKey: '',
      publicKey: '',
      mnemonic: '',
      hdWalletPath: '',
      jsonFileData: ''
    }
  }

  getAllUsers() {
    this.waiting = true;

    this.dashboardService.getAccounts().subscribe(
      (data) => {
        this.waiting = false;
        if (data && data.length > 0) {
          this.userAddresses = data;
        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Oops you missed it this time! Try again...!!!', 'error');
      }
    );
  }

  ngAfterViewInit() {
    // let _self = this;

    // $('html').click(function () {
    //   if (_self.profileDetailsVisible) {
    //     _self.profileDetailsVisible = false;
    //   }

    // });

    // $('.profile').click(function (e) {
    //   e.stopPropagation();

    // });

    // $('.adminlabel').click(function (e) {
    //   _self.profileDetailsVisible = !_self.profileDetailsVisible;
    // });

  }

  showProfileDetails() {

    this.profileDetailsVisible = !this.profileDetailsVisible;
  }

  logout() {

    this.profileDetailsVisible = false;

    this.waiting = true;

    this.loginService.logout().subscribe(
      (data) => {
        this.waiting = false;
        this.dashboardService.showNavbar(false);

        localStorage.removeItem('authToken');
        this.router.navigateByUrl('/login');
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error while logout', 'error');
      }
    );
  }

  showRequestTokensForm() {
    this.profileDetailsVisible = false;

    this.requestTokenForm.reset();

    this.getPrivateKeyForm.reset();

    this.showGetPrivateKeyForm = true;

    this.userAddress = undefined;
    this.amountToTransfer = 0;
  }

  requestTokens() {

    this.waiting = true;

    this.dashboardService.requestTokens(this.tokenValue).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'You got ' + this.tokenValue + ' XFT tokens!!', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
            }
          }
        );
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Oops you missed it this time! Try again...!!!', 'error');
      }
    );
  }


  transferTokens() {

    this.waiting = true;

    let transferToken: TransferTokenModal = {
      to: this.userAddress,
      value: this.amountToTransfer
    };

    this.dashboardService.transferTokens(transferToken).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'You have transfered ' + this.amountToTransfer + ' XFT tokens!!', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
            }
          }
        );
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Oops you missed it this time! Try again...!!!', 'error');
      }
    );
  }

  getPrivateKey() {

    if (this.loginPassword !== localStorage.getItem('loginPassword')) {
      swal('Error!', 'Oops Password does not match with the login password!!!', 'error');

    } else {
      this.waiting = true;
      if (this.walletPath && this.walletMnemonic) {
        this.dashboardService.getWalletDetails(this.walletMnemonic, this.walletPath, this.loginPassword).subscribe(
          (data) => {
            this.waiting = false;
            console.log(data);
            if (data) {
              this.showGetPrivateKeyForm = false;

              this.wallet.privateKey = data.privateKey;
              this.wallet.publicKey = `${data.publicKey}`;
              this.wallet.hdWalletPath = data.hdWalletPath;
              this.wallet.mnemonic = data.mnemonic;

              this.wallet.jsonFileData = JSON.stringify(data);
            } else {

              swal('Error!', 'Something went wrong...!!!', 'error');
            }

          },
          (err: HttpErrorResponse) => {
            this.waiting = false;

            if (err.error instanceof Error) {
              console.log('An error occurred: ', err.error.message); // client
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
            }

            swal('Error!', 'Oops you missed it this time! Try again...!!!', 'error');
          }
        );
      }
      else {
        this.dashboardService.getPrivateKey(this.loginPassword).subscribe(
          (data) => {
            this.waiting = false;
            if (data) {
              this.showGetPrivateKeyForm = false;

              this.wallet.privateKey = data.privateKey;
              this.wallet.publicKey = `${data.publicKey}`;
              this.wallet.hdWalletPath = data.hdWalletPath;
              this.wallet.mnemonic = data.mnemonic;
              this.wallet.address = data.address;
              this.wallet.jsonFileData = JSON.stringify(data);
            } else {

              swal('Error!', 'Something went wrong...!!!', 'error');
            }

          },
          (err: HttpErrorResponse) => {
            this.waiting = false;

            if (err.error instanceof Error) {
              console.log('An error occurred: ', err.error.message); // client
            } else {
              console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
            }

            swal('Error!', 'Oops you missed it this time! Try again...!!!', 'error');
          }
        );
      }
    }
  }

  downloadJSONFile() {

    let data = JSON.parse(this.wallet.jsonFileData);

    let uri = 'data:text/json;charset=utf-8,' + escape(JSON.stringify(data.fileContents));
    let link = document.createElement("a");
    let fileName = data.fileName + '.json';

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(new Blob([(JSON.stringify(data.fileContents))], { type: 'text/json;charset=utf-8' }), fileName);
    } else {
      link.href = uri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';

    if (val === 'private key') {
      selBox.value = this.wallet.privateKey;
    } else if (val === 'public key') {
      selBox.value = this.wallet.publicKey;
    } else if (val === 'wallet path') {
      selBox.value = this.wallet.hdWalletPath;
    } else if (val === 'mnemonic') {
      selBox.value = this.wallet.mnemonic;
    }else if (val === 'address') {
      selBox.value = this.wallet.address;
    }

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
