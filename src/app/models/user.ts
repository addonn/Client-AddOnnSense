import { IPerson, Person } from './person';
export interface IUser extends IPerson {
    username: string;
    password: string;
    loggedin: boolean;
    account: string;
    session: string;
    startupAppLanguage: string;
    role: string;
    refreshtoken: string;
    idtoken: string;
    isoauth: boolean;
}

export class User extends Person {
    private username: string;
    private password: string;
    private loggedin: boolean;
    public account: string;
    private session: string;
    private startupAppLanguage: string;
    private role: string;
    private refreshtoken: string;
    private idtoken: string;
    private isoauth: boolean;

    constructor(user: IUser) {
        super(user);
        if (user) {
            this.username = user.username;
            this.password = user.password;
            this.loggedin = user.loggedin;
            this.account = user.account;
            this.startupAppLanguage = user.startupAppLanguage;
            this.session = user.session;
            this.role = user.role;
            this.refreshtoken = user.refreshtoken;
            this.idtoken = user.idtoken;
            this.isoauth = user.isoauth;
        }
    }

    public getUsername(): string {
        return this.username;
    }
    public setUsername(value: string) {
        this.username = value;
    }
    public getPassword(): string {
        return this.password;
    }
    public setPassword(value: string) {
        this.password = value;
    }

    public isLoggedin(): boolean {
        return this.loggedin;
    }
    public setLoggedin(value: boolean) {
        this.loggedin = value;
    }
    public getAccount(): string {
        return this.account;
    }
    public setAccount(value: string) {
        this.account = value;
    }
    public getStartupAppLanguage(): string {
        return this.startupAppLanguage;
    }
    public setStartupAppLanguage(value: string) {
        this.startupAppLanguage = value;
    }
    public getSession(): string {
        return this.session;
    }
    public setSession(value: string) {
        this.session = value;
    }
    public getRole(): string {
        return this.role;
    }
    public setRole(value: string) {
        this.role = value;
    }
    public getRefreshtoken(): string {
        return this.refreshtoken;
    }
    public setRefreshtoken(value: string) {
        this.refreshtoken = value;
    }

    public getIdtoken(): string {
        return this.idtoken;
    }
    public setIdtoken(value: string) {
        this.idtoken = value;
    }
    public isOAuth(): boolean {
        return this.isoauth;
    }
    public setOAuth(value: boolean) {
        this.isoauth = value;
    }
}
