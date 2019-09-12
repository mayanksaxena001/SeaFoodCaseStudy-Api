import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

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
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.post<Entity>('asset', data);
    }

    getUserEntities(): Observable<Entity[]> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Entity[]>('assets');
    }

    updateEntity(data): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.put<any>('asset', data);
    }

    getEntityById(id): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<any>('asset/' + id);
    }

    getTrasferableAssets() {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Entity[]>('assets/transfer');
    }

    requestTokens(amount): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.post<any>('token/request', { value: amount });
    }

    transferTokens(transferModal: TransferTokenModal): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.post<any>('token/transfer', transferModal);
    }

    getAccounts() {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Account[]>('accounts');
    }

    getPrivateKey(_password) {
        localStorage.setItem('isWalletUrl', JSON.stringify(true));

        return this.http.post<any>('key',{password:_password});
    }

    getWalletDetails(_mnemonic,_path,_password) {
        localStorage.setItem('isWalletUrl', JSON.stringify(true));

        return this.http.post<any>('details',{mnemonic:_mnemonic,path:_path,password:_password});
    }

    getTransactions() {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Transaction[]>('transactions');
    }

    transactEntity(transact: Transact): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.post<any>('asset/transfer', transact);
    }

    getTransactionById(id): Observable<Transaction> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Transaction>('transaction/' + id);
    }

    getSuppliers() {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.get<Supplier[]>('suppliers');
    }

    updateTransactionSensorId(data): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.put<any>('transaction/accept', data);
    }

    updateTransactionPickUp(data): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.put<any>('transaction/picked', data);
    }

    updateTransactionCompleted(data): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.put<any>('transaction/complete', data);
    }

    cancelTransaction(data): Observable<any> {
        localStorage.setItem('isContractUrl', JSON.stringify(true));

        return this.http.put<any>('transaction/cancel', data);
    }

    //Telemetry Contract API
    getSensors(): Observable<Sensor[]> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.get<Sensor[]>('');
    }

    getSensorById(id): Observable<Sensor> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.get<Sensor>('' + id);
    }

    addSensor(data): Observable<Sensor> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.post<Sensor>('', data);
    }

    getTelemetryById(id): Observable<Telemetry> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.get<Telemetry>('telemetry/' + id);
    }

    getSensorTelemetries(id): Observable<Telemetry[]> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.get<Telemetry[]>('telemetries/' + id);
    }

    getTransactionTelemetries(id): Observable<Telemetry[]> {
        localStorage.setItem('isSensorUrl', JSON.stringify(true));

        return this.http.get<Telemetry[]>('transaction/telemetries/' + id);
    }

}
