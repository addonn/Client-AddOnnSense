export interface IAccount {
    code: string;
    name: string;
    loginurl: string;
    logouturl: string;
    issso: boolean;
    email: string;
    isAccessKey: boolean;
    license: string;
    codeVerifier: string;
}

export class Account {
    private code: string;
    private name: string;
    private loginurl: string;
    private logouturl: string;
    private session: string;
    private issso: boolean;
    private email: string;
    private isAccessKey: boolean;
    public license: string;
    public codeVerifier: string;


    constructor(account: IAccount) {
        if (account) {
            this.code = account.code;
            this.name = account.name;
            this.loginurl = account.loginurl;
            this.logouturl = account.logouturl;
            this.issso = account.issso;
            this.email = account.email;
            this.isAccessKey = account.isAccessKey;
            this.license = account.license;
            this.codeVerifier = account.codeVerifier;
        }
    }
    public getLoginurl(): string {
        return this.loginurl;
    }
    public setLoginurl(value: string) {
        this.loginurl = value;
    }
    public getName(): string {
        return this.name;
    }
    public setName(value: string) {
        this.name = value;
    }
    public getLogouturl(): string {
        return this.logouturl;
    }
    public setLogouturl(value: string) {
        this.logouturl = value;
    }
    public getIssso(): boolean {
        return this.issso;
    }
    public setIssso(value: boolean) {
        this.issso = value;
    }
    public getCode(): string {
        return this.code;
    }
    public setCode(value: string) {
        this.code = value;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(value: string) {
        this.email = value;
    }
    public getIsAccessKey(): boolean {
        return this.isAccessKey;
    }
    public setIsAccessKey(value: boolean) {
        this.isAccessKey = value;
    }
    public getCodeVerifier(): string {
        return this.codeVerifier;
    }
    public setCodeVerifier(value: string) {
        this.codeVerifier = value;
    }
}
