import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../models/app.constants';
import { IAccount, Account } from '../models/account';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private http: HttpClient,
        private storage: Storage, ) { }

    getAccountDetails(accountname: string, isreload: boolean): Promise<any> {
        return new Promise((resolve, reject: any) => {
            const key: string = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', accountname);
            this.storage.get(key).then((data: IAccount) => {
                if (!isreload && data != null) {
                    resolve(new Account(data));
                } else {
                    const canonicalUri = AppConstants.GATEWAY_URL_GET_ACCOUNT.replace('{accountname}', accountname);
                    this.http.get<any>(environment.AWS_URL + canonicalUri + '-' + environment.APPLICATION).subscribe((data) => {
                        if (data == null || data.data == null || data.data.loginurl == null || data.data.loginurl === '') {
                            reject('Account does not exists.');
                        }
                        const account: Account = new Account(data.data);
                        this.storage.set(key, account).then((res) => {
                            console.log(res);
                            resolve(account);
                        }, error => {
                            reject(error);
                        });
                    }, error => {
                        reject(error);
                    });
                }
            });
        });
    }
}
