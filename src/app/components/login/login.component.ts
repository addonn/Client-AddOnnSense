import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../../models/app.constants';
import { UntypedFormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { startOfDay } from 'date-fns';
import { AuthenticateService } from '../../services/authenticate.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthAuthenticationService } from '../../services/oauth.authenticate.service';
import { Account } from '../../models/account';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  startUpLangauage: string;
  loginInPrgress: boolean;
  constructor(
    private storage: Storage,
    private router: Router,
    private route: ActivatedRoute,
    private authenticateService: AuthenticateService,
    private oauthService: OAuthAuthenticationService,
    private userService: UserService,
    private translate: TranslateService,
  ) {
    const currentUser = new User(JSON.parse(localStorage.getItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER)!));
    if (currentUser != null && currentUser.getAccount() != null && currentUser.getUsername() != null && currentUser.getSession() != null) {
      this.form = new UntypedFormGroup({
        customer: new UntypedFormControl(currentUser.getAccount(), [Validators.required])
      });
      
      // this.startUpLangauage = currentUser.getStartupAppLanguage();
      // if (this.startUpLangauage && this.startUpLangauage !== 'en') {
      //   this.translate.resetLang(this.startUpLangauage);
      //   this.translate.currentLang = '';
      //   this.translate.use(this.startUpLangauage).toPromise().then(() => { });
      // }
      // let fromDate: Date = startOfDay(new Date());
      //}
    } else {
      this.form = new UntypedFormGroup({
        customer: new UntypedFormControl('', [Validators.required])
      });
    }
    
    localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_STARTUP_SLIDES, 'true');
  }

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.storage.get(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER).then((user: User) => {
        let key = AppConstants.STORAGE_ACCOUNT.replace('{ACCOUNT}', user.account as string);
        this.storage.get(key).then(async (account: Account) => {
          await this.oauthService.exchangeCodeForToken(code, account /* account */);
          this.router.navigate(['/main-window']); // 👈 Navigate after login
        })
      })
      // const currentUser = new Account(JSON.parse(localStorage.getItem(AppConstants.STORAGE_ACCOUNT)!));
    }
  }

  async onSubmit(event?: any) {
    this.loginInPrgress = true;
    if (this.form.valid) {

      let user = this.createLoggedInUser(this.form.value.customer.trim(), this.form.value.username, this.form.value.password, this.startUpLangauage);
      localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_STARTUP_SLIDES, 'true');
      console.log(this.storage.keys.length);
      this.storage.set(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, user);
      // localStorage.setItem(AppConstants.LOCALSTORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
      try {
        let loggedInUser: User = await this.authenticateService.authenticate(this.form.value.customer.trim(), true, false);
        console.log(loggedInUser);
        if (loggedInUser != null) {
          this.userService.getLoggedInUserDetails(loggedInUser).then((user: User) => {
            console.log(this.storage.keys.length);
            if (user) {
              this.router.navigateByUrl('/main-window');
            }
          }, error => {
            this.loginInPrgress = false;
          });
        } else {
          this.loginInPrgress = false;
        }
      } catch (error) {
        this.loginInPrgress = false;
        console.log(error.message);
      }
    }
    return false;
  }


  createLoggedInUser(customer: string, username: string, password: string, startupAppLanguage: string): User {
    return new User({
      primarykey: 0,
      username,
      password,
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
      startupAppLanguage,
      role: '',
      refreshtoken: '',
      idtoken: '',
      isoauth: false
    });
  }
}
