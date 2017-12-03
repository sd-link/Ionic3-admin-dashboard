import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-register-success',
    templateUrl: 'register-success.html',
    providers: []
})
export class RegisterSuccessPage {

    constructor(
        private loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }


    ionViewDidLoad() {
    }

    toLogin() {
        this.navCtrl.push('LoginPage');
    }

}
