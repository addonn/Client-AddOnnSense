import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AwsSignature } from './interceptors/aws-signature';
import { NetworkStatusService } from './services/networkstatus.service';
import { ErrorDialogService } from './services/error-dialog.service';
import { httpRequestInterceptor } from './interceptors/http-request-interceptor';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';

// Initialize storage
export function initializeStorage(storageService: StorageService) {
  return () => storageService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    // Register services needed by the interceptor
    AwsSignature,
    NetworkStatusService,
    ErrorDialogService,
    Storage,
    StorageService,

    // Initialize storage before app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeStorage,
      deps: [StorageService],
      multi: true
    },

    // Configure HttpClient with interceptors
    provideHttpClient(
      withInterceptors([httpRequestInterceptor]),
      withFetch()
    ),

    // Modules go in importProvidersFrom
    importProvidersFrom(
      FormsModule,
      CommonModule,
      IonicStorageModule.forRoot({
        name: 'addonn_db'
      }),
      TranslateModule.forRoot()
    )
  ]
};

console.log('Routes in app.config:', routes);
