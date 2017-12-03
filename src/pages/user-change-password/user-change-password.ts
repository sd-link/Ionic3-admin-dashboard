import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
/**
 * Generated class for the UserChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-change-password',
  templateUrl: 'user-change-password.html',
  providers: [UserService]
})
export class UserChangePasswordPage {

  user: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _userService: UserService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserChangePasswordPage');
  }

  changePassword() {
    const loading = this.loadingCtrl.create({
      content: 'Change password...'
    });
    loading.present();

    this._userService.patchUserPassword(this.user)
      .subscribe(res => this.successCreate(loading), err => this.failedAlert(err, loading));
  }

  successCreate(loading) {
    loading.dismiss();
    this.navCtrl.push('ProjectListPage')
  }
  
  failedAlert(err, loading) {
    loading.dismiss();
    this.alertCtrl.create({
      title: 'Failed!',
      message: 'Whoops! there\'s error form validations',
      buttons: ['OK']
    }).present();
  }
}
