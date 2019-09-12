/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { LoginService } from '../login/login.service';

import swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('editEntityForm') editEntityForm: any;
  @ViewChild('addEntityForm') addEntityForm: any;
  @ViewChild('addSensorForm') addSensorForm: any;
  @ViewChild('sensorMap') sensorMapElement: any;
  @ViewChild('transactionMap') transactionMapElement: any;

  sensorMap: google.maps.Map;
  transactionMap: google.maps.Map;
  waiting = false;

  entities: Entity[] = [];
  noEntityData = false;

  transferEntities: Entity[] = [];
  noTransferEntityData = false;

  user: User;
  transact: Transact;

  entity: Entity;
  addEntityModal: EntityModal;
  editEntityModal: EntityModal;

  subscription: Subscription;
  sensor: Sensor;
  sensors: Sensor[];
  noSensorData = false;

  availableSensors: Sensor[];
  addSensorModal: SensorModal;
  sensorName: string;
  selectedSensor: string;
  telemetry: Telemetry;
  sensorTelemetries: Telemetry[];
  noSensorTelemetryData = false;

  transactionTelemetries: Telemetry[];
  noTelemetryData = false;

  transactions: Transaction[];
  noTransactionData = false;
  transaction: Transaction;
  updateTransactionModal: UpdateTransactionModal;

  supplier: Supplier;
  suppliers: Supplier[];
  supplierName;
  selectedSupplier;

  constructor(private dashboardService: DashboardService,
    private loginService: LoginService, private router: Router) {

    this.subscription = dashboardService.allEntities.subscribe(
      allEntities => {

        this.getUserDetails();
      }
    );
  }

  ngOnInit() {
    this.initialiseData();

    this.getUserDetails();

  }
  ngAfterViewInit(): void {
    this.initGoogleMap();
  }
  initGoogleMap() {
    if (typeof google != 'undefined') {
      var mapProp = {
        center: new google.maps.LatLng(18.5166172, 73.7720714),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.sensorMap = new google.maps.Map(this.sensorMapElement.nativeElement, mapProp);
      this.transactionMap = new google.maps.Map(this.transactionMapElement.nativeElement, mapProp);
      //
    } else {
      console.error('Problem loading google map api');
      // throw new Error('google is not defined');
    }
  }

  getUserDetails() {
    this.waiting = true;

    this.loginService.getUserDetails().subscribe(
      (data) => {
        this.waiting = false;

        if (data) {
          this.user = data;
          localStorage.setItem('UserDetails', JSON.stringify(this.user));
          this.dashboardService.showNavbar(true);
        } else {
          swal('Error!', 'Error fetching user details', 'error');
        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching user details', 'error');
      },
      () => {
        this.displayAssets();//TODO : not getting called,CHeck
        this.getTransferableAssets();
        this.getTransactions();
        this.getSuppliers();
      }
    );
  }

  initialiseData() {

    this.addEntityModal = {
      name: '',
      value: '',
      quantity: ''
    };

    this.editEntityModal = {
      name: '',
      value: '',
      quantity: ''
    };

    this.user = {
      id: '',
      name: '',
      email: '',
      username: '',
      account: '',
      type: '',
      balance: 0,
      active: false
    };

    this.transact = {
      from: '',
      name: '',
      id: '',
      supplier: '',
      quantity: 0,
      value: 0,
      sensorId: '',
      weight: '',
      place: '',
      latitude: '',
      longitude: '',
      date: new Date(),
      type: '',
      trackId: '',
      owner: '',
      suppliers: null
    };

    this.sensor = {
      id: '',
      name: '',
      address: '',
      trackId: '',
      status: '',
      supplierName: '',
      updatedAt: null,
      createdAt: null
    }

    this.addSensorModal = {
      address: '',
      name: ''
    }

    this.telemetry = {
      id: '',
      sensorId: '',
      weight: 0,
      temperature: 0,
      latitude: '',
      longitude: '',
      place: '',
      updatedAt: null
    }

    this.transaction = {
      to: '',
      from: '',
      supplier: '',
      id: '',
      assetName: '',
      amount: 0,
      updatedAt: '',
      assetId: '',
      sensorId: '',
      status: '',
      fromUsername: '',
      toUsername: '',
      action: ''
    };

    this.updateTransactionModal = {
      address: '',
      transactionId: '',
      sensorId: '',
      action: ''
    }

    this.availableSensors = [];
  }

  getTransferableAssets() {

    this.waiting = true;

    this.dashboardService.getTrasferableAssets().subscribe(
      (data) => {
        this.waiting = false;

        if (data) {

          this.noTransferEntityData = false;
          this.transferEntities = data;

        } else {
          this.noTransferEntityData = true;

          swal('Error!', 'Error fetching assets', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;
        this.noTransferEntityData = true;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching assets', 'error');
      }
    );
  }

  displayEntities() {
    if (this.user.type === 'PRODUCER' || this.user.type === 'CONSUMER') {
      return true;
    }
    return false;
  }


  displayAssets() {
    if (this.user.type === 'PRODUCER' || this.user.type === 'CONSUMER') {
      this.getEntities();

    } else {
      this.getSensors();

    }
  }

  getTransactions() {
    this.waiting = true;

    this.dashboardService.getTransactions().subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.length > 0) {
          this.noTransactionData = false;
          this.transactions = data;

        } else if (data.length === 0) {
          this.noTransactionData = true;

        } else {
          this.noTransactionData = true;

          swal('Error!', 'Error fetching transactions', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;
        this.noTransactionData = true;


        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching transactions', 'error');
      }, () => {
        if (this.user.type === 'SUPPLIER') {
          var transaction;
          if (this.transactions && this.transactions.length > 0) {

            for (var i = 0; i < this.transactions.length; i++) {
              transaction = this.transactions[i];
              if (transaction.status === 'PENDING') {
                transaction.action = 'ACCEPT';
              }
              else if (transaction.status === 'DELIVERED') {
                transaction.action = 'DONE';
              }
              else if (transaction.status === 'IN_PROGRESS') {
                transaction.action = 'MARK PICKED';
              } else if (transaction.status === 'PICKED_UP') {
                transaction.action = 'MARK DELIVERED';
              }
            }
          }
        }

      }

    );
  }

  getEntities() {
    this.waiting = true;

    this.dashboardService.getUserEntities().subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.length > 0) {
          this.noEntityData = false;

          this.entities = data;

        } else if (data.length === 0) {
          this.noEntityData = true;

        } else {
          this.noEntityData = true;
          swal('Error!', 'Error fetching user entities', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;
        this.noEntityData = true;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching user entities ', 'error');
      }

    );
  }

  getSensors() {
    this.waiting = true;

    this.dashboardService.getSensors().subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.length > 0) {
          this.noSensorData = false;
          this.sensors = data;

        } else if (data.length === 0) {
          this.noSensorData = true;

        } else {
          this.noSensorData = true;

          swal('Error!', 'Error fetching Sensors', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;
        this.noSensorData = true;


        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching Sensors', 'error');
      }, () => {
        if (this.user.type === 'SUPPLIER') {
          if (this.sensors && this.sensors.length > 0) {

            for (var i = 0; i < this.sensors.length; i++) {
              var sensor = this.sensors[i];
              if (sensor.status === 'AVAILABLE') {
                this.availableSensors.push(sensor);
              }
            }
          }
        }
      }

    );
  }

  getSensorTelemetries(id) {
    this.waiting = true;
    var telemetries;
    this.dashboardService.getSensorTelemetries(id).subscribe(
      (data) => {
        this.waiting = false;
        console.log('Tele ',data);
        if (data && data.length > 0) {
          this.noSensorTelemetryData = false;
          this.sensorTelemetries = data;
          telemetries = data;
        } else if (data.length === 0) {
          this.noSensorTelemetryData = true;

        } else {
          this.noSensorTelemetryData = true;
          swal('Error!', 'Error fetching telemetries', 'error');

        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching transactions', 'error');
      }, () => {
        if (telemetries != null && telemetries.length > 0) {
          var locations = [], marker;
          for (var x = 0; x < telemetries.length; x++) {
            locations.push({ lat: Number(telemetries[x].latitude), lng: Number(telemetries[x].longitude) });
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(Number(telemetries[x].latitude), Number(telemetries[x].longitude)),
              map: this.sensorMap,
              title: telemetries[x].place,
              visible: true
            });
            // var marker = new MarkerWithLabel({
            //   position: homeLatLng,
            //   map: map,
            //   draggable: true,
            //   raiseOnDrag: true,
            //   labelContent: "ABCD",
            //   labelAnchor: new google.maps.Point(15, 65),
            //   labelClass: "labels", // the CSS class for the label
            //   labelInBackground: false,
            //   icon: pinSymbol('red')
            // });
            // var infowindow = new google.maps.InfoWindow({
            //   content: telemetries[x].place
            // });
            // google.maps.event.addListener(marker, "click", function(e) {
            //   infowindow.open(this.map, this);
            // });
          }
          var flightPath = new google.maps.Polyline({
            path: locations,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          flightPath.setMap(this.sensorMap);
        }
      }


    );
  }

  addEntity() {

    this.waiting = true;

    this.dashboardService.addEntity(this.addEntityModal).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Entity/Asset Added!', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
              this.addEntityForm.reset();

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

        swal('Error!', 'Backend Error while adding Entity/Asset', 'error');
      }
    );
  }

  addSensor() {

    this.waiting = true;

    this.dashboardService.addSensor(this.addSensorModal).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Sensor Added!', 'success').then(
          (result) => {
            if (result.value) {
              this.addSensorForm.reset();
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

        swal('Error!', 'Backend Error while adding sensor', 'error');
      }
    );
  }

  showUserDetails() {
    window.open("http://localhost:8000/#/address/" + this.user.account);

  }

  updateSensorModal() {
    this.addSensorModal.address = this.user.account;
  }

  editEntity(data) {
    this.editEntityModal = data;
  }

  updateEntity() {

    this.waiting = true;

    this.dashboardService.updateEntity(this.editEntityModal).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Entity Updated!', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
              this.router.navigateByUrl('/dashboard');
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

        swal('Error!', 'Backend error unable to update entity', 'error');
      }
    );
  }

  transactBtnClicked(data) {

    this.transact.weight = '100' //TODO
    this.transact.place = 'Bavdhan' //TODO;
    this.transact.latitude = '18.5156' //TODO;
    this.transact.longitude = '73.7819' //TODO;
    this.transact.date = new Date() //TODO;Removed!!!
    this.transact.from = data.address;
    this.transact.quantity = data.quantity;
    this.transact.value = data.value;
    this.transact.id = data.id;
    this.transact.owner = data.username;
    this.transact.type = data.type;
    this.transact.name = data.name;
    this.supplier = null;
  }

  getSuppliers() {

    this.waiting = true;

    this.dashboardService.getSuppliers().subscribe(
      (data) => {

        this.waiting = false;

        if (data && data.length > 0) {
          this.suppliers = data;
        }

      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Unable to get suppliers', 'error');
      }
    );
  }


  confirmTransaction() {

    this.waiting = true;

    this.transact.supplier = this.supplierName;

    this.dashboardService.transactEntity(this.transact).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Transaction Successful!', 'success').then(
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

        swal('Error!', 'Backend error while  confirming transaction', 'error');
      }
    );
  }

  transactionConfirmation() {

    if (!this.supplierName) {
      swal('Error!', 'Please select a supplier!', 'error');
      return;

    }

    if (this.user.balance < (this.transact.quantity * this.transact.value)) {
      swal('Error!', 'Insufficient Balance for transaction!', 'error');
      return;

    }

    $('#transactEntity').modal('hide');

    this.confirmTransaction();
  }

  sensorIdClicked(data) {
    this.sensor = data;
    this.getSensorTelemetries(data.id);
  }

  entityIdClicked(value) {

    this.waiting = true;

    this.dashboardService.getEntityById(value).subscribe(
      (data) => {

        this.waiting = false;
        this.entity = data;
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend error while getting entity ', 'error');
      }
    );
  }

  transactionIdClicked(data) {
    this.transaction = data;
    this.getTransactionTelemetries(data.id, data.sensorId);
  }

  getTransactionTelemetries(trackId, sensorId) {
    this.waiting = true;
    var telemetries;
    this.dashboardService.getTransactionTelemetries(trackId).subscribe(
      (data) => {
        this.waiting = false;

        if (data && data.length > 0) {
          this.noTelemetryData = false;
          this.transactionTelemetries = data;
          telemetries = data;

        } else if (data.length === 0) {
          this.noTelemetryData = true;

        } else {
          this.noTelemetryData = true;
          swal('Error!', 'Error fetching transactions', 'error');
        }
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error while fetching transactions', 'error');
      }, () => {
        if (sensorId !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          this.getSensorById(sensorId);
        }
        if (telemetries != null && telemetries.length > 0) {
          var locations = [], marker;
          for (var x = 0; x < telemetries.length; x++) {
            locations.push({ lat: Number(telemetries[x].latitude), lng: Number(telemetries[x].longitude) });
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(Number(telemetries[x].latitude), Number(telemetries[x].longitude)),
              map: this.transactionMap,
              title: telemetries[x].place,
              visible: true
            });
          }
          var flightPath = new google.maps.Polyline({
            path: locations,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          flightPath.setMap(this.transactionMap);
        }

      }

    );
  }

  getSensorById(id) {

    this.dashboardService.getSensorById(id).subscribe(
      (data) => {

        if (data) {
          this.sensor = data;
        } else {
          swal('Error!', 'Error fetching sensor details', 'error');

        }
      },
      (err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error fetching sensor details', 'error');
      }
    );
  }

  attachSensor(data) {
    this.updateTransactionModal.address = data.supplier;
    this.updateTransactionModal.transactionId = data.id;
    this.updateTransactionModal.action = data.action;
  }

  acceptSensor(action) {

    if (!this.sensorName && action === 'ACCEPT') {
      swal('Error!', 'Please select a sensor!', 'error');
      return;

    }
    $('#attachSensor').modal('hide');
    if (action === 'ACCEPT') {
      this.updateTransactionModal.sensorId = this.selectedSensor;
      this.updateTransactionSensorId(this.updateTransactionModal);
    } else if (action === 'MARK PICKED') {
      this.updateTransactionPickUp(this.updateTransactionModal);
    } else if (action === 'MARK DELIVERED') {
      this.updateTransactionCompleted(this.updateTransactionModal)
    }
  }

  getSelectedSensor(data) {
    this.selectedSensor = data;
  }

  updateTransactionSensorId(data) {
    this.waiting = true;
    this.dashboardService.updateTransactionSensorId(data).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Attached Sensor', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
              this.addEntityForm.reset();

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

        swal('Error!', 'Backend Error while adding sensor', 'error');
      }
    );
  }

  updateTransactionPickUp(data) {
    this.waiting = true;
    this.dashboardService.updateTransactionPickUp(data).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Transaction status changed', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
              this.addEntityForm.reset();

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

        swal('Error!', 'Backend Error while updating transaction', 'error');
      }
    );
  }

  updateTransactionCompleted(data) {
    this.waiting = true;
    this.dashboardService.updateTransactionCompleted(data).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Transaction Completed', 'success').then(
          (result) => {
            if (result.value) {
              this.dashboardService.updateAllEntities(true);
              this.addEntityForm.reset();
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

        swal('Error!', 'Backend Error while updating transaction', 'error');
      }
    );
  }

  cancelTransaction(data) {
    this.waiting = true;
    this.dashboardService.cancelTransaction(data).subscribe(
      (data) => {
        this.waiting = false;
        swal('Success!', 'Transaction Cancelled', 'success');
      },
      (err: HttpErrorResponse) => {
        this.waiting = false;
        if (err.error instanceof Error) {
          console.log('An error occurred: ', err.error.message); // client
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // server
        }

        swal('Error!', 'Backend Error while transaction cancellation', 'error');
      }
    );
  }

  closeEditModal() {
    this.editEntityForm.reset();

    this.dashboardService.updateAllEntities(true);
  }

  closeAddModal() {
    this.addEntityForm.reset();

  }

  closeAddSensorModal() {
    this.addSensorForm.reset();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSelectedSupplier(selectedSupplier) {
    this.selectedSupplier = selectedSupplier;
  }

  getStatusColor(status: string) {
    if (status === 'AVAILABLE' || status === 'DELIVERED'
      || status === 'COMPLETED' || status === 'SUCCESS') {

      return true;
    } else {
      return false;
    }
  }

}
