import { UserService } from '../../services/user.service';

import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

interface UserDetail {
  "name": "string",
  "address": "string",
  "email": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zip": "string",
  "phone": "string",
  "company": "string",
  "tax_details": "string",
  "billing_email": "string"
}

/**
 * Generated class for the EditProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userDetail: UserDetail = {
    "name": null,
    "address": null,
    "email": null,
    "city": null,
    "state": null,
    "country": null,
    "zip": null,
    "phone": null,
    "company": null,
    "tax_details": null,
    "billing_email": null
  };

  constructor(
    public _userService: UserService,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadProfile();
  }

  loadProfile() {
    this._userService.getUserProfile()
      .subscribe(res => {
        this.userDetail = res;
      });
  }

  goBack() {
    this.navCtrl.popToRoot();
  }

  proceedRequest() {
    this._userService.patchUserProfile(this.userDetail)
      .subscribe(res => {
        this._userService.cache.clearGroup('userProfile');
        this.successAlert();
        this.loadProfile();
      }, err => {
        this.failedAlert(err);
      })
  }

  successAlert() {
    this.alertCtrl.create({
      title: 'Success!',
      subTitle: 'Profile successfully edited!',
      buttons: ['OK']
    }).present();
  }

  failedAlert(err) {
    this.alertCtrl.create({
      title: 'Failed!',
      subTitle: err.message,
      buttons: ['OK']
    }).present();
  }

}
