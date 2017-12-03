import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { UserService } from './../../services/user.service'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService]
})
export class LoginPage {

  email: String;
  password: String;
  error: String;

  constructor(
    private _userService: UserService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  isAuthenticated() {
    return this._userService.authenticated()
  }

  ionViewDidLoad() {
    this.isAuthenticated()
      .subscribe(authenticated => {
        if (authenticated) {
          this.checkTokenIsValid();
        }
      }, () => {
        console.log('Must logged in')
      });
  }

  checkTokenIsValid() {
    this._userService.getUserProfile()
      .subscribe(res => {
        this.navCtrl.popToRoot()
      }, () => {
        console.log('Must logged in')
      })
  }

  onSubmit() {
    this.error = null;
    const loading = this.loadingCtrl.create({
      content: 'Signing in...'
    });
    loading.present();
    const user = {
      email: this.email,
      password: this.password
    }
    this._userService.login(user).subscribe(res => {
      if (res) {
        this._userService.setAuth(res);
        loading.dismiss();
        this.navCtrl.push('Home')
      }
    }, error => {
      loading.dismiss();
      this.error = error;
    })
  }

  toForgotPassword() {
    this.navCtrl.push('UserForgetPasswordPage');
  }

  toRegister() {
    this.navCtrl.push('RegisterPage');
  }

}
