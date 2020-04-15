import { Component, OnInit } from '@angular/core';
import { BinanceService } from './binance.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { log } from 'util';
import { BinanceCred, AccountBalance, MyTrade } from './binance';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit, AfterViewInit {
  constructor(private binanceService: BinanceService) { }
  @ViewChild('credForm') credForm: any;

  cred: BinanceCred;
  waiting = false;
  isFirstTimeLogin: Boolean = true;
  baseCurrencies = ['USDT', 'ETH', 'BTC', 'XRP'];
  markets = [];
  balances: AccountBalance[];
  hasBalance: Boolean = false;
  totalBalances = {};
  myTrades: MyTrade[];
  SweetAlertType = { SUCCESS: 'success', ERROR: 'error', WARNING: 'warning', INFO: 'info', QUESTION: 'question' };

  ngAfterViewInit(): void {
    this.fetchCredentials();
    this.waiting = false;
  }

  ngOnInit(): void {
    console.log('Inside init');
    this.cred = {
      api_key: '',
      api_secret: '',
      pairs: '',
      base_currency: '',
      canTrade: false,
      use_server_time: false,
      authenticated: false
    };
  }


  saveCredentials() {
    this.waiting = true;
    if (this.isFirstTimeLogin) this.feedCredentials(this.cred);
    else this.updateCred(this.cred);
    // this.credForm.hide();
  }

  updateCred(cred: BinanceCred) {
    console.log('updating credentials');
    this.binanceService.updateCredentials(cred).subscribe((data) => {
      if (data) {
        this.popUp('', 'Successfully saved', this.SweetAlertType.SUCCESS);
        this.waiting = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('An error occurred: ', err.error.message); // client
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
      }
      console.log(err);
      this.popUp(err.message, 'Something went wrong. Please try again.', this.SweetAlertType.ERROR);
    }, () => {
      this.refresh();
    });
  }

  feedCredentials(cred: BinanceCred) {
    console.log('Feeding credentials');
    this.binanceService.feedCredentials(cred).subscribe((data) => {
      if (data) {
        this.cred = data;
        this.waiting = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('An error occurred: ', err.error.message); // client
      } else {
        console.log(`Backend returned code ${err.status}, body was: ${err}`); // server
      }
      console.log(err);
      this.popUp(err.message, 'Something went wrong. Please try again.', this.SweetAlertType.ERROR);
    }, () => {
      this.refresh();
    });
  }

  fetchCredentials() {
    console.log('Fetching credentials');
    this.binanceService.getCredentials().subscribe(data => {
      if (data) {
        this.cred = data;
        this.isFirstTimeLogin = false;
        this.waiting = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
      }
      this.waiting = false;
      console.log(err);
    }, () => {
      this.refresh();
    });
  }

  setupData() {
    this.refresh();
  }

  check(ev, value) {
    if (ev.target.checked) {
      console.log("Clicked true ", value);
    } else {
      console.log("Clicked false ", value);
    }
  }

  fetchMyTrades() {
    this.waiting = true;
    console.log('Fetching trades');
    this.binanceService.getMyTrades().subscribe(data => {
      if (data) {
        this.myTrades = data;
        this.waiting = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
      }
      this.waiting = false;
      console.log(err);
    });

  }

  refresh() {
    this.waiting = true;
    console.log('refresh clicked');
    if (this.cred && this.cred.authenticated) {
      console.log('Fetching account details..');
      this.binanceService.fetchMarkets().subscribe(data => {
        if (data) {
          this.markets = data;
          this.waiting = false;
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.waiting = false;
      });
      this.binanceService.fetchAccountBalance().subscribe(data => {
        if (data) {
          this.balances = data;
          this.hasBalance = true;
        }
        this.waiting = false;

      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.waiting = false;
      });
    }
    this.waiting = false;
  }

  async buyAllFavCoins() {
    this.waiting = false;
    var result = await swal('Are you sure?', 'Please check and confirm', 'question');
    if (result.value) {
      this.waiting = true;
      this.binanceService.buyAll().subscribe(data => {
        if (data) {
          this.popUp('Success', 'Bought some coins.Check out the trades', this.SweetAlertType.SUCCESS)
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.popUp('Something went wrong. Please try again.', err.error, this.SweetAlertType.ERROR);
      }, () => {
        this.refresh();
      });
    }
  }

  async sellAllCoins() {
    this.waiting = false;
    var result = await swal('Are you sure?', 'Please check and confirm', 'question');
    if (result.value) {
      this.waiting = true;
      this.binanceService.sellAll().subscribe(data => {
        if (data) {
          this.popUp('Success', 'Sold all coins.Check out the trades', this.SweetAlertType.SUCCESS);
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.popUp('Something went wrong. Please try again.', err.error, this.SweetAlertType.ERROR);
      }, () => {
        this.refresh();
      });
    }
  }

  popUp(title, message, type) {
    this.waiting = false;
    return swal(title, message, type);
  }

  selectCoin(asset) {
    console.log('Selected asset ', asset);
  }


}
