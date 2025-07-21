import { Injectable } from '@angular/core';
export interface IPerson {
    primarykey: number;
    personalnumber: string;
    firstname: string;
    prefix: string;
    lastname: string;
    picture: string;
    address: string;
    department: string;
    phonenumber: string;
    emailaddress: string;
    deviceid:string;
}

export class Person {
    private primarykey: number;

    private personalnumber: string;
    private firstname: string;
    private prefix: string;
    private lastname: string;
    private picture: string;
    private address: string;
    private department: string;
    private phonenumber: string;
    private emailaddress: string;
    private deviceid:string;

    constructor(person: IPerson) {
        if (person) {
            this.primarykey = person.primarykey;
            this.personalnumber = person.personalnumber;
            this.firstname = person.firstname;
            this.prefix = person.prefix;
            this.lastname = person.lastname;
            if (person.picture) {
                this.picture = (person.picture.indexOf(';base64,') >= 0) ? person.picture : 'data:image/jpeg;base64,' + person.picture;
            }
            this.address = person.address;
            this.department = person.department;
            this.phonenumber = person.phonenumber;
            this.emailaddress = person.emailaddress;
            this.deviceid = person.deviceid;
        }
    }

    public getPhonenumber(): string {
        return this.phonenumber;
    }
    public setPhonenumber(value: string) {
        this.phonenumber = value;
    }
    public getEmailaddress(): string {
        return this.emailaddress;
    }
    public setEmailaddress(value: string) {
        this.emailaddress = value;
    }
    public getPersonalnumber(): string {
        return this.personalnumber;
    }
    public setPersonalnumber(value: string) {
        this.personalnumber = value;
    }
    public getDepartment(): string {
        return this.department;
    }
    public setDepartment(value: string) {
        this.department = value;
    }

    public getPrefix(): string {
        return this.prefix;
    }
    public setPrefix(value: string) {
        this.prefix = value;
    }

    public getFirstname(): string {
        return this.firstname;
    }
    public setFirstname(value: string) {
        this.firstname = value;
    }
    public getPicture(): string {
        return this.picture;
    }
    public setPicture(value: string) {
        this.picture = value;
    }

    public getLastname(): string {
        return this.lastname;
    }
    public setLastname(value: string) {
        this.lastname = value;
    }

    public getAddress(): string {
        return this.address;
    }
    public setAddress(value: string) {
        this.address = value;
    }
    public getPrimaryKey(): number {
        return this.primarykey;
    }
    public setPrimaryKey(value: number) {
        this.primarykey = value;
    }
    public getDeviceid(): string {
        return this.deviceid;
    }
    public setDeviceid(value: string) {
        this.deviceid = value;
    }

    
}