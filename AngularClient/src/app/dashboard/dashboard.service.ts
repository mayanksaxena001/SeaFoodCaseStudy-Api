import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Entity, Supplier } from './entity';
import { Transaction, TransferTokenModal,Account } from './transaction';
import { Transact } from './transact';
import { Telemetry, Sensor } from './sensor';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    // Observable string sources
    private allEntitiesSource = new Subject<boolean>();
    private navBarSource = new Subject<boolean>();

    // Observable string streams
    allEntities = this.allEntitiesSource.asObservable();
    navBar = this.navBarSource.asObservable();

    constructor(private http: HttpClient) { }

    updateAllEntities(update: boolean) {
        this.allEntitiesSource.next(update);
    }

    showNavbar(show: boolean) {
        this.navBarSource.next(show);
    }

    //Asset Transfer Contract API
    addEntity(data): Observable<Entity> {
        return this.http.post<Entity>('contract/asset', data);
    }

    getUserEntities(): Observable<Entity[]> {
        return this.http.get<Entity[]>('contract/assets');
    }

    updateEntity(data): Observable<any> {
        return this.http.put<any>('contract/asset', data);
    }

    getEntityById(id: String): Observable<any> {
        return this.http.get<any>('contract/asset/' + id);
    }

    getTrasferableAssets() {
        return this.http.get<Entity[]>('contract/assets/transfer');
    }

    requestTokens(amount): Observable<any> {
        return this.http.post<any>('contract/token/request', { value: amount });
    }

    transferTokens(transferModal: TransferTokenModal): Observable<any> {
        return this.http.post<any>('contract/token/transfer', transferModal);
    }

    getAccounts() {
        return this.http.get<Account[]>('contract/accounts');
    }

    getPrivateKey(_password) {
        return this.http.post<any>('wallet/key', { password: _password });
    }

    getWalletDetails(_mnemonic, _path, _password) {
        return this.http.post<any>('wallet/details', { mnemonic: _mnemonic, path: _path, password: _password });
    }

    getTransactions() {
        return this.http.get<Transaction[]>('contract/transactions');
    }

    transactEntity(transact: Transact): Observable<any> {
        return this.http.post<any>('contract/asset/transfer', transact);
    }

    getTransactionById(id: String): Observable<Transaction> {
        return this.http.get<Transaction>('contract/transaction/' + id);
    }

    getSuppliers() {
        return this.http.get<Supplier[]>('contract/suppliers');
    }
    //TODO : Update data type
    updateTransactionSensorId(data: any): Observable<any> {
        return this.http.put<any>('contract/transaction/accept', data);
    }

    updateTransactionPickUp(data): Observable<any> {
        return this.http.put<any>('contract/transaction/picked', data);
    }

    updateTransactionCompleted(data): Observable<any> {
        return this.http.put<any>('contract/transaction/complete', data);
    }

    cancelTransaction(data): Observable<any> {
        return this.http.put<any>('contract/transaction/cancel', data);
    }

    //Telemetry Contract API
    getSensors(): Observable<Sensor[]> {
        return this.http.get<Sensor[]>('sensor');
    }

    getSensorById(id: String): Observable<Sensor> {
        return this.http.get<Sensor>('sensor/' + id);
    }

    addSensor(data): Observable<Sensor> {
        return this.http.post<Sensor>('sensor', data);
    }

    getTelemetryById(id: String): Observable<Telemetry> {
        return this.http.get<Telemetry>('sensor/telemetry/' + id);
    }

    getSensorTelemetries(id: String): Observable<Telemetry[]> {
        return this.http.get<Telemetry[]>('sensor/telemetries/' + id);
    }

    getTransactionTelemetries(id: String): Observable<Telemetry[]> {
        return this.http.get<Telemetry[]>('sensor/transaction/telemetries/' + id);
    }

}
