
export interface IBase {
    primarykey: number,
    code: string,
    name: string,
    tag:string,
    errormessage:string,
    status:string,
    clientid?: string,
    referenceid?:string
}
export class Base {
    private primarykey: number;
    private code: string;
    private name: string;
    private tag: string;
    private errormessage: string;
    private status: string;
    private clientid: string;
    private referenceid: string;
    constructor(base: IBase) {
        if (base != null) {
            this.primarykey = base.primarykey;
            this.code = base.code;
            this.name = base.name;
            this.status = base.status;
            this.tag = base.tag;
            this.errormessage = base.errormessage;
            this.clientid = base.clientid;
            this.referenceid = base.referenceid
        }
    }
    public getPrimaryKey(): number {
        return this.primarykey;
    }
    public setPrimaryKey(primarykey: number) {
        this.primarykey = primarykey;
    }
    public getCode(): string {
        return this.code;
    }
    public setCode(code: string) {
        this.code = code;
    }
    public getName(): string {
        return this.name;
    }
    public setName(name: string) {
        this.name = name;
    }
    public getTag(): string {
        return this.tag;
    }
    public setTag(value: string) {
        this.tag = value;
    }
    public getErrormessage(): string {
        return this.errormessage;
    }
    public setErrormessage(value: string) {
        this.errormessage = value;
    }
    public getStatus(): string {
        return this.status;
    }
    public setStatus(value: string) {
        this.status = value;
    }
    public getClientid(): string {
        return this.clientid;
    }
    public setClientid(value: string) {
        this.clientid = value;
    }
    public getReferenceid(): string {
        return this.referenceid;
    }
    public setReferenceid(value: string) {
        this.referenceid = value;
    }
}