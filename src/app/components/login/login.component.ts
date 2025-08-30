import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { AppConstants } from '../../models/app.constants';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticateService } from '../../services/authenticate.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthAuthenticationService } from '../../services/oauth.authenticate.service';
import { Account } from '../../models/account';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  startUpLangauage: string;
  loginInPrgress: boolean = false;
  private isBrowser: boolean;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticateService: AuthenticateService,
    private oauthService: OAuthAuthenticationService,
    private userService: UserService,
    private translate: TranslateService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeForm();
    console.log('Environment Redirect ULR ' + environment.REDIRECTURL)
  }

  private async initializeForm() {
    this.form = this.fb.group({
      customer: ['']
    });

    if (this.isBrowser) {
      try {
        const userData = localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER);
        if (userData) {
          const currentUser = new User(JSON.parse(userData));
          if (currentUser?.getAccount()) {
            this.form.patchValue({
              customer: currentUser.getAccount()
            });
          }
        }
      } catch (e) {
        console.error('Error initializing form:', e);
      }
    }
  }

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      try {
        const userData = localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER);
        if (userData) {
          const currentUser = new User(JSON.parse(userData));
          const customer = currentUser.getAccount();
          if (customer) {
            const key = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', customer);
            const account = await this.storageService.get(key);
            if (account) {
              console.log('Exchanging code for token...');
              await this.oauthService.exchangeCodeForToken(code, account);
              console.log('Token exchange successful');
              await this.router.navigate(['/main-window']);
            }
          }
        }
      } catch (error) {
        console.error('Error during OAuth code exchange:', error);
      }
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted', this.form.value);

    if (!this.isBrowser) {
      return;
    }

    const customerValue = this.form.get('customer')?.value;
    if (!customerValue) {
      console.log('No customer value');
      return;
    }

    this.loginInPrgress = true;
    console.log('Starting login process...', customerValue);

    try {
      const user = this.createLoggedInUser(customerValue.trim());
      localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_STARTUP_SLIDES, 'true');
      
      await this.storageService.set(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, user);
      console.log('User stored in storage');

      const loggedInUser = await this.authenticateService.authenticate(
        customerValue.trim(),
        true,
        false
      );
      
      console.log('User authenticated:', loggedInUser);
      
      if (loggedInUser) {
        const userDetails = await this.userService.getLoggedInUserDetails(loggedInUser);
        console.log('User details:', userDetails);
        if (userDetails) {
          await this.router.navigateByUrl('/main-window');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      this.loginInPrgress = false;
    }
  }

  private createLoggedInUser(customer: string): User {
    return new User({
      primarykey: 0,
      username: '',
      password: '',
      account: customer,
      loggedin: false,
      firstname: '',
      lastname: '',
      address: '',
      department: '',
      emailaddress: '',
      personalnumber: '',
      prefix: 'L',
      picture: '',
      phonenumber: '',
      deviceid: '',
      session: '',
      startupAppLanguage: '',
      role: '',
      refreshtoken: '',
      idtoken: '',
      isoauth: false
    });
  }
}
