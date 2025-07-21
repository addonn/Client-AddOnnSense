import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AwsSignatureInputData } from '../models/aws-signature-input.model';
import { AwsSignature } from './aws-signature';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { AppConstants } from '../models/app.constants';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { NetworkStatusService } from '../services/networkstatus.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticateService } from '../services/authenticate.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import encode from 'jwt-encode';

// Shared state for token refresh
const isRetrySessionOnProcess = { value: false };
const refreshTokenSubject = new BehaviorSubject<User | null>(null);

export const httpRequestInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  console.log('Interceptor called for URL:', request.url);

  // Get required services
  const awsSignature = inject(AwsSignature);
  const translateService = inject(TranslateService);
  const networkStatusService = inject(NetworkStatusService);
  const errorDialogService = inject(ErrorDialogService);
  const authenticationService = inject(AuthenticateService);

  let authReq = addAWSHeadersToRequest(request, awsSignature);

  return next(authReq).pipe(
    timeout(40000),
    tap((response: any) => {
      if (authReq.url.indexOf('assets/') > 0 || authReq.url.startsWith('assets/')) {
        return response;
      }
      if (!(response instanceof HttpResponse) || !response.url) {
        return response;
      }
      console.log('Response intercepted:', response);
      errorDialogService.logErrors({ log: JSON.stringify(response), type: 'success response' });
    }),
    catchError((error: HttpErrorResponse) => {
      const errorMessage: any = {};
      console.log('Error intercepted:', error);
      errorDialogService.logErrors({ log: JSON.stringify(error), type: 'error response' });

      if (error.message === "Timeout has occurred") {
        errorDialogService.openDialog(translateService.instant('error.timeout'), error.status);
        return throwError(() => "Timeout has occurred");
      }

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage.status = 0;
        errorMessage.message = error.message || error.error.message;
        errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(error), error.status);
        return throwError(() => errorMessage);
      } else {
        // Server-side error
        errorMessage.status = error.status;
        errorMessage.message = error.error.message;

        if (error.status === 401) {
          return handle401Error(request, next, errorMessage, authenticationService, errorDialogService, awsSignature);
        } else {
          errorMessage.message = error.message || error.error.message;
          errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(error), error.status);
          return throwError(() => errorMessage);
        }
      }
    })
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  errorMessage: any,
  authenticationService: AuthenticateService,
  errorDialogService: ErrorDialogService,
  awsSignature: AwsSignature
): Observable<any> {
  if (!isRetrySessionOnProcess.value) {
    isRetrySessionOnProcess.value = true;
    console.log('Getting new session');
    refreshTokenSubject.next(null);

    const currentUser = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
    currentUser.setSession(null);
    localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(currentUser));

    return new Observable(observer => {
      authenticationService.authenticate(currentUser.getAccount(), false, true)
        .then(result => {
          isRetrySessionOnProcess.value = false;
          refreshTokenSubject.next(result);
          const authReq = addAWSHeadersToRequest(request, awsSignature);
          next(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
              errorMessage.status = err.status;
              errorMessage.message = err.message || err.error.message;
              errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(err), err.status);
              return throwError(() => errorMessage);
            })
          ).subscribe(observer);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  } else {
    return refreshTokenSubject.pipe(
      filter(user => user != null),
      take(1),
      switchMap((user: User) => {
        const retryReq = addAWSHeadersToRequest(request, awsSignature);
        return next(retryReq).pipe(
          catchError((err: HttpErrorResponse) => {
            errorMessage.status = err.status;
            errorMessage.message = err.message || err.error.message;
            errorDialogService.openDialog(errorMessage.message ?? JSON.stringify(err), err.status);
            return throwError(() => errorMessage);
          })
        );
      })
    );
  }
}

function addAWSHeadersToRequest(request: HttpRequest<unknown>, awsSignature: AwsSignature): HttpRequest<any> {
  let newHeaders = request.headers;

  // Check URL types
  const isAssetsUrl = request.url.indexOf('assets/') >= 0 || request.url.startsWith('assets/');
  const isAuthUrl = request.url.indexOf('auth/realms/') >= 0;

  if (!isAssetsUrl && !isAuthUrl) {
    // Add AWS headers for regular API requests
    console.log('Adding AWS headers to request:', request.url);

    const awsSignatureInputData = new AwsSignatureInputData();
    awsSignatureInputData.method = request.method;
    awsSignatureInputData.canonicalUri = request.url.replace('https://' + environment.AWS_HOST, '');
    awsSignatureInputData.host = environment.AWS_HOST;
    awsSignatureInputData.region = environment.AWS_REGION;
    awsSignatureInputData.service = environment.AWS_SERVICE;
    awsSignatureInputData.accessKey = environment.AWS_ACCESSKEY;
    awsSignatureInputData.secretKey = environment.AWS_SECRETKEY;
    awsSignatureInputData.contentType = 'application/json';
    awsSignatureInputData.endpoint = environment.AWS_HOST;
    awsSignatureInputData.requestParameters = '';

    // Handle query parameters
    const queryStringIndex = awsSignatureInputData.canonicalUri.indexOf('?');
    if (queryStringIndex > 0) {
      awsSignatureInputData.canonicalQuerystring = awsSignatureInputData.canonicalUri.substring(queryStringIndex + 1);
      awsSignatureInputData.canonicalUri = awsSignatureInputData.canonicalUri.substring(0, queryStringIndex);
    }

    const returnValue = awsSignature.generateSignature(awsSignatureInputData, new Date());

    newHeaders = newHeaders
      .set('Content-Type', returnValue.contentType)
      .set('X-Amz-Date', returnValue.xAmzDate)
      .set('Authorization', returnValue.authorization);

    // Add JWT token
    let txtuniquecode: string | undefined;
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      txtuniquecode = uuidv4();
    }

    const currentUser = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)));
    const payload = {
      applicationname: environment.APPLICATION,
      username: currentUser.getUsername(),
      password: currentUser.getPassword(),
      account: currentUser.getAccount(),
      txcode: txtuniquecode,
      session: currentUser.getAccount() ? currentUser.getSession() : null,
      isoauth: currentUser.isOAuth()
    };

    const token = encode(payload, environment.PRIVATE_KEY);
    newHeaders = newHeaders.set('X-SourceApp', token);
  } else if (isAssetsUrl) {
    // Only add CORS headers for asset requests
    newHeaders = newHeaders
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      .set('Access-Control-Allow-Methods', 'GET,OPTIONS')
      .set('Access-Control-Allow-Origin', '*');
  } else if (isAuthUrl) {
    // For auth URLs, set content-type to application/x-www-form-urlencoded
    newHeaders = newHeaders
      .set('Content-Type', 'application/x-www-form-urlencoded');
  }

  return request.clone({ headers: newHeaders });
}
