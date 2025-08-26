import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { firstValueFrom } from 'rxjs';
import { Account, IAccount } from '../models/account';
import { AppConstants } from '../models/app.constants';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { AccountService } from '../services/account.service';
import { generateCodeChallenge, generateCodeVerifier } from '../services/proof.key.code';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class OAuthAuthenticationService {
    private clientId = 'AddOnn-Mobile-Client';
    private realm = 'planon';
    private redirectUri = 'https://aiassistant.add-onn.com/login';
    private codeVerifier = '';
    accountName: string = null;
    isreload = false;

    constructor(
        private readonly accountService: AccountService,
        private http: HttpClient,
        private storage: Storage
    ) { }

    async login(accountname: string, isreload: boolean): Promise<User> {
        const account: Account = await this.accountService.getAccountDetails(accountname, isreload);
        if (!account || account.getCode() == null || account.getLoginurl() == null) {
            throw new Error('No account or invalid configuration');
        }

        const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
        currentUser.setAccount(accountname);
        localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
        this.accountName = accountname;
        this.isreload = isreload;

        return new Promise(async (resolve, reject) => {
            if (currentUser?.getSession() == null || isreload) {
                this.codeVerifier = generateCodeVerifier();
                const codeChallenge = await generateCodeChallenge(this.codeVerifier);
                account.setCodeVerifier(this.codeVerifier);
                let key = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', accountname);
                this.storage.set(key, account);
                const authUrl = account.getLoginurl() + this.realm +
                    `/protocol/openid-connect/auth?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid offline_access`;

                const handler = await App.addListener('appUrlOpen', async (event: any) => {
                    try {
                        if (event.url && event.url.includes('code=')) {
                            const url = new URL(event.url);
                            const code = url.searchParams.get('code');

                            if (code) {
                                const user = await this.exchangeCodeForToken(code, account);
                                resolve(user);
                                // Browser.close();
                                window.close();
                                handler.remove();
                            }
                        }
                    } catch (err) {
                        reject(err);
                        window.close();
                        // Browser.close();
                        handler.remove();
                    }
                });

                // await Browser.open({ url: authUrl,  } );
                window.open(authUrl, '_self');


                setTimeout(() => {
                    reject(new Error('Login timed out'));
                    // Browser.close();
                    window.close();
                    handler.remove();
                }, 120000); // Optional timeout
            } else if (currentUser?.getRefreshtoken() != null) {
                try {
                    const user = await this.refreshAccessToken(account, currentUser);
                    resolve(user);
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    async getUserDetails(currentUser: User) {
        if (currentUser.getSession() != null) {
            const canonicalUri = AppConstants.GATEWAY_URL_LOGIN.replace('{username}', "AUTH");
            this.http.get(environment.AWS_URL + canonicalUri).subscribe((response: any) => {
                console.log(response);
                console.log(response);
                currentUser.setUsername(response.data.username);
            });

            // const response: any = await this.http.get(environment.AWS_URL + canonicalUri).subscribe();
            await this.isOAuthEnabled(currentUser);
            localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
        }
    }

    async exchangeCodeForToken(code: string, acc: Account): Promise<User> {
        let account = new Account(acc as unknown as IAccount);
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            code_verifier: account.getCodeVerifier(),
        });

        try {
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            const result = await firstValueFrom(
                this.http.post<any>(
                    account.getLoginurl() + `${this.realm}/protocol/openid-connect/token`,
                    body.toString(),
                    { headers }
                )
            );

            console.log('Access Token:', result.access_token);

            const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
            currentUser.setSession(result.access_token);
            currentUser.setAccount(account.getCode());
            currentUser.setLoggedin(true);
            currentUser.setRefreshtoken(result.refresh_token);
            currentUser.setIdtoken(result.id_token);
            await this.isOAuthEnabled(currentUser);
            localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
            await this.getUserDetails(currentUser);
            return currentUser;
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            throw error;
        }
    }

    async refreshAccessToken(account: Account, currentUser: User): Promise<User> {
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: currentUser.getRefreshtoken(),
            client_id: this.clientId,
        });
        try {
            const response = await fetch(account.getLoginurl() + `${this.realm}/protocol/openid-connect/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });

            if (!response.ok) {
                console.warn('Refresh token expired or invalid. Attempting re-login...');
                return this.login(currentUser.getAccount(), true);
            }

            const result = await response.json();
            console.log('Access Token:', result.access_token);

            currentUser.setSession(result.access_token);
            currentUser.setLoggedin(true);
            currentUser.setRefreshtoken(result.refresh_token);
            currentUser.setIdtoken(result.id_token);
            await this.isOAuthEnabled(currentUser);
            localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
            return currentUser;
        } catch (error) {
            console.error('Token refresh failed due to network or server error:', error);
            return this.login(currentUser.getAccount(), true);
        }
    }

    async isOAuthEnabled(currentUser: User) {
        const key: string = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', currentUser.getAccount());
        const res = await this.storage.get(key);
        let value = res && res.loginurl ? res.loginurl.includes('auth/realms') : false;
        currentUser.setOAuth(value);
    }

    async logout() {
        return new Promise(async (resolve, reject) => {
            const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
            let account: Account = await this.accountService.getAccountDetails(currentUser.getAccount(), false);
            const authUrl = account.getLoginurl() + this.realm +
                `/protocol/openid-connect/logout?id_token_hint=${currentUser.getIdtoken()}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;

            const handler = await Browser.addListener('browserPageLoaded', () => {
                //const handler = await App.addListener('appUrlOpen', async (event: any) => {
                try {
                    console.log('Browser closed');
                    Browser.close();
                    handler.remove();
                    resolve(true);
                } catch (err) {
                    Browser.close();
                    handler.remove();
                    reject(err);
                }
            });

            await Browser.open({ url: authUrl });

            setTimeout(() => {
                Browser.close();
                handler.remove();
                reject(new Error('Logout timed out'));
            }, 120000); // Optional timeout
        });
    }
}
