import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppConstants } from '../models/app.constants';
import { User } from '../models/user';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../services/account.service';
import { CryptoService } from '../services/crypto.service';
import { Account } from '../models/account';
import { Base } from '../models/base';
import { OAuthAuthenticationService } from '../services/oauth.authenticate.service';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  constructor(private http: HttpClient,
    private accountService: AccountService,
    private cyptoService: CryptoService,
    private storage: Storage,
    private translateService: TranslateService,
    private oAuthAuthenticationService: OAuthAuthenticationService) {

  }

  authenticate(accountname: string, isreload: boolean, isreloadSession: boolean): Promise<User> {
    return new Promise((resolve, reject: any) => {
      // Get login URL from middleware.
        this.accountService.getAccountDetails(accountname, isreload).then((account: Account) => {
          if (account == null || account.getCode() == null || account.getLoginurl() == null) {
            reject({ status: 500, message: 'No account or invalid configuration' });
          }
          //Switch to oAuth Authentication.
          if (account.getLoginurl().includes('auth/realms')) {
            const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
            const promise = isreloadSession
              ? this.oAuthAuthenticationService.refreshAccessToken(account, currentUser)
              : this.oAuthAuthenticationService.login(accountname, isreload);
            promise.then((user: User) => {
              resolve(user);
            }).catch((error: any) => {
              reject(error);
            });

            return; // important to stop further execution
          } 
        }, error => {
          reject({ status: 500, message: error });
        });

    });
  }



  readSession(account: Account, html: string, accountname: string, forceNull?: boolean) {
    const base: Base = new Base(JSON.parse(html));
    return this.readSessionBase(account, base, accountname, forceNull);
  }
  readSessionBase(account: Account, base: Base, accountname: string, forceNull?: boolean) {
    //const base: Base = new Base(JSON.parse(html));
    console.log(base.getCode());
    if (forceNull) {
      base.setCode(null);
    }
    
    this.storage.get(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER).then((user: User) => {
      console.log(user);
    })
    const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
    // currentUser.setSession(this.cyptoService.decrypt(base.getCode()));
    currentUser.setSession(base.getCode());
    currentUser.setAccount(accountname);
    currentUser.setLoggedin(true);
    currentUser.setUsername(base.getName());
    localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
    return currentUser;
  }

  logout() {
    return new Promise((resolve, reject: any) => {
      // Get login URL from middleware.
        const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
        this.accountService.getAccountDetails(currentUser.getAccount(), false).then((account: Account) => {
          if (account.getLoginurl().includes('auth/realms')) {
            this.oAuthAuthenticationService.logout().then(() => {
              resolve(true);
            })
          } else {
            resolve(true);
          }
        });
    });
  }

  // authenticate(): Promise<any> {
  //   return new Promise((resolve, reject: any) => {
  //     if (this.networkService.isOnline()) {
  //       let currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
  //       let canonicalUri = AppConstants.GATEWAY_URL_LOGIN.replace('{username}', currentUser.getUsername());
  //       this.http.get<any>(environment.AWS_URL + canonicalUri).subscribe((data) => {
  //         if (data && data.message && data.message){
  //           reject({"status":500,"message": data.message});
  //         } else {
  //           this.masterDataService.getAppConfiguration(currentUser.getAccount()).then(configuartion => {
  //             this.masterDataService.getMasetData().then((masterdata) => {
  //               resolve(data);
  //             },(error)=>{
  //               reject(error);
  //             })
  //           },(error)=>{
  //             reject(error);
  //           })
  //         }
  //       }, (error) => {
  //         reject(error);
  //       })
  //     } else {
  //       reject({"status":502,"message": this.translateService.instant(AppConstants.ERROR_NETWORK_OFFLINE_TRANSLATION_KEY)});
  //     }
  //   });

  // }
}
