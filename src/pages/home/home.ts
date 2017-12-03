import { UserService } from '../../services/user.service';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {

  isLoggedIn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this._userService.authenticated().subscribe(authenticated => {
      if (authenticated) {
        this.navCtrl.setRoot('ProjectListPage')
      }
    }, () => {})
  }

}
