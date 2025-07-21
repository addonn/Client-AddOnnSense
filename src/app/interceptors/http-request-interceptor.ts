// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { Injectable, Injector } from '@angular/core';
// import { AwsSignatureInputData } from '../models/aws-signature-input.model';
// import { AwsSignature } from './aws-signature';
// import { AwsSignatureOutputData } from '../models/aws-signature-output.model';
// import { environment } from '../../environments/environment';
// import { User } from '../models/user';
// import { AppConstants } from '../models/app.constants';
// import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
// import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
// import { NetworkStatusService } from '../services/networkstatus.service';
// import { v4 as uuidv4 } from 'uuid';
// import { AuthenticateService } from '../services/authenticate.service';
// import { ErrorDialogService } from '../services/error-dialog.service';
// import { timeout } from 'rxjs/operators';
// import { TranslateService } from '@ngx-translate/core';
// // let jwt = require('jsonwebtoken');
// import * as jwt from 'jsonwebtoken';
// @Injectable()
// export class HttpRequestInterceptor implements HttpInterceptor {
//     isRetrySessionOnProcess: boolean = false;
//     private refreshTokenSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
//     constructor(private injector: Injector,
//         private awsSignatureService: AwsSignature,
//         private translateService: TranslateService,
//         private networkStatusService: NetworkStatusService,
//         private errorDialogService: ErrorDialogService,
//         private authenticationService: AuthenticateService) { }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//         // if (!this.networkStatusService.isOnline()){
//         //     let errorMessage:any = {};
//         //     errorMessage.status = 502;
//         //     errorMessage.message = 'Offline, Please come to online to make a backend call.';
//         //     return throwError(errorMessage);
//         // }
//         const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
//         let authReq: HttpRequest<any> = this.addAWSHeadersToRequest(request);
//         return next.handle(authReq).pipe(timeout(40000),
//             tap((response: HttpResponse<any>) => {
//                 if (authReq.url.indexOf('assets/') > 0 || authReq.url.startsWith('assets/')) {
//                     return response;
//                 }
//                 if (!(response instanceof HttpResponse) || !response.url) {
//                     return response;
//                 }
//                 console.log(authReq);
//                 console.log(response);
//                 this.errorDialogService.logErrors({ log: JSON.stringify(response), type: 'success response' });
//             }),
//             catchError((error: HttpErrorResponse) => {
//                 const errorMessage: any = {};
//                 console.log(error);
//                 this.errorDialogService.logErrors({ log: JSON.stringify(error), type: 'error response' });
//                 if (error.message === "Timeout has occurred") {
//                     this.errorDialogService.openDialog(this.translateService.instant('error.timeout'), error.status);
//                     return throwError("Timeout has occurred");
//                 }
//                 if (error.error instanceof ErrorEvent) {
//                     // client-side error
//                     errorMessage.status = 0;
//                     errorMessage.message = (error.message) ? error.message : error.error.message;
//                     this.errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(error), error.status);
//                     console.log(errorMessage);
//                     return throwError(errorMessage);
//                 } else {
//                     // server-side error
//                     errorMessage.status = error.status;
//                     errorMessage.message = error.error.message;
//                     if (error.status === 401) {
//                         console.log('Request URL ' + request.url + ' ' + new Date().getTime());
//                         if (!this.isRetrySessionOnProcess) {
//                             this.isRetrySessionOnProcess = true;
//                             console.log('Getting Session ' + new Date().getTime());
//                             this.refreshTokenSubject.next(null); //
//                             let currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
//                             currentUser.setSession(null);
//                             localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));
//                             return from(this.authenticationService.authenticate(currentUser.getAccount(), false, true)).pipe(switchMap(((result: User) => {
//                                 this.isRetrySessionOnProcess = false;
//                                 this.refreshTokenSubject.next(result);
//                                 authReq = this.addAWSHeadersToRequest(request, result);
//                                 return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
//                                     errorMessage.status = err.status;
//                                     errorMessage.message = (err.message) ? err.message : err.error.message;
//                                     this.errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(err), err.status);
//                                     console.log(errorMessage);
//                                     return throwError(errorMessage);
//                                 })
//                                 );
//                             })));
//                         } else {
//                             console.log(new Date().getTime());
//                             return this.refreshTokenSubject.pipe(
//                                 filter(user => user != null), // Wait until a non-null user is emitted
//                                 take(1),
//                                 switchMap((user: User) => {
//                                     console.log('Intercepted request URL ' + request.url);
//                                     console.log('Intercepted request ' + user.getSession());
//                                     const retryReq = this.addAWSHeadersToRequest(request, user);
//                                     return next.handle(retryReq).pipe(catchError((err: HttpErrorResponse) => {
//                                         errorMessage.status = err.status;
//                                         errorMessage.message = (err.message) ? err.message : err.error.message;
//                                         this.errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(err), err.status);
//                                         console.log(errorMessage);
//                                         return throwError(errorMessage);
//                                     })
//                                     );
//                                 })
//                             );
//                         }
//                     } else {
//                         errorMessage.message = (error.message) ? error.message : error.error.message;
//                         this.errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(error), error.status);
//                         console.log(errorMessage);
//                         return throwError(errorMessage);
//                     }
//                 }
//             })
//         );
//     }
    

//     addAWSHeadersToRequest(request: HttpRequest<any>, userS?: User) {
//         let newHeaders = null;
//         if (request.url.indexOf('assets/') < 0 || !request.url.startsWith('assets/')) {


//             console.log('Intercepted request' + request.url);
//             // const currentUser: User = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
//             const awsSignatureInputData: AwsSignatureInputData = new AwsSignatureInputData();
//             awsSignatureInputData.method = request.method;
//             const host = environment.AWS_HOST;
//             let canonicalUri: string = request.url.replace('https://' + host, '');
//             const queryStringIndex: number = canonicalUri.indexOf('?');
//             let queryString = '';
//             if (queryStringIndex > 0) {
//                 queryString = canonicalUri.substring(queryStringIndex + 1);
//                 canonicalUri = canonicalUri.substring(0, queryStringIndex);
//             }
//             awsSignatureInputData.canonicalUri = canonicalUri;
//             awsSignatureInputData.host = host;
//             awsSignatureInputData.region = environment.AWS_REGION;
//             awsSignatureInputData.service = environment.AWS_SERVICE;
//             awsSignatureInputData.accessKey = environment.AWS_ACCESSKEY;
//             awsSignatureInputData.secretKey = environment.AWS_SECRETKEY;
//             awsSignatureInputData.contentType = 'application/json';
//             // awsSignatureInputData.requestParameters = '{"username":"' + currentUser.getUsername() + '","password":"'  + currentUser.getPassword()+  '"}';
//             awsSignatureInputData.canonicalQuerystring = queryString;

//             const returnValue: AwsSignatureOutputData = this.awsSignatureService.generateSignature(awsSignatureInputData, new Date());
//             // console.log(returnValue);

//             newHeaders = request.headers;
//             newHeaders = newHeaders.append('Content-Type', returnValue.contentType);
//             newHeaders = newHeaders.append('X-Amz-Date', returnValue.xAmzDate);
//             newHeaders = newHeaders.append('Authorization', returnValue.authorization);
//             // sign with RSA SHA256
//             if (jwt) {
//                 let txtuniquecode: string;
//                 if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
//                     txtuniquecode = uuidv4();
//                 }
//                 const currentUser = userS ? userS : new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
//                 let isOAuth = currentUser.isOAuth();
//                 let token = jwt.sign({ applicationname: environment.APPLICATION, username: currentUser.getUsername(), password: currentUser.getPassword(), account: currentUser.getAccount(), txcode: txtuniquecode, session: (currentUser.getAccount() != null) ? currentUser.getSession() : null, isoauth: isOAuth }, environment.PRIVATE_KEY, { 'expiresIn': '10 days' });
//                 newHeaders = newHeaders.append('X-SourceApp', token);
//             }
//         } else {
//             newHeaders = request.headers;
//             newHeaders = newHeaders.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//             newHeaders = newHeaders.append('Access-Control-Allow-Methods', 'GET,OPTIONS');
//             newHeaders = newHeaders.append('Access-Control-Allow-Origin', '*');
//         }
//         return request.clone({ headers: newHeaders });
//     }
// }
