import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../models/app.constants';
import { Storage } from '@ionic/storage';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient,
        private storage: Storage,) {

    }


    createLoggedInUser(customer: string, username: string, password: string, startupAppLanguage: string): User {
        return new User({
            primarykey: null,
            username,
            password,
            account: customer,
            loggedin: false,
            firstname: '',
            lastname: '',
            address: '',
            department: '',
            emailaddress: '',
            personalnumber: '',
            prefix: 'L',
            picture: null,
            phonenumber: '',
            deviceid: null,
            session: null,
            startupAppLanguage,
            role: null,
            refreshtoken: null,
            idtoken: null,
            isoauth: false
        });
    }


   

    getLoggedInUserDetails(currentUser: User): Promise<any> {
        return new Promise((resolve, reject: any) => {
                // localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
                const canonicalUri = AppConstants.GATEWAY_URL_LOGIN.replace('{username}', currentUser.getUsername());
                this.http.get<any>(environment.AWS_URL + canonicalUri).subscribe(async (result) => {
                    if (result.message && result.message) {
                        reject({ status: 500, message: result.message });
                    } else {
                        const user: User = new User(result.data);
                        user.setAccount(currentUser.getAccount());
                        user.setSession(currentUser.getSession());
                        user.setRefreshtoken(currentUser.getRefreshtoken());
                        user.setIdtoken(currentUser.getIdtoken());
                        const key: string = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', currentUser.getAccount());
                        const res = await this.storage.get(key);
                        let value = res && res.loginurl ? res.loginurl.includes('auth/realms') : false;
                        user.setOAuth(value);
                        localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
                        resolve(user);
                    }
                }, (error) => {
                    reject(error);
                });
        });

    }

}
