import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
// import { HttpRequestInterceptor } from './interceptors/http-request-interceptor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    // ✅ Correct way to register interceptor in Standalone app
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptor,
    //   multi: true
    // },
    // ✅ Modules go in importProvidersFrom
    importProvidersFrom(
      FormsModule,
      CommonModule,
      IonicStorageModule.forRoot(),
      TranslateModule.forRoot()
    )
  ]
};
