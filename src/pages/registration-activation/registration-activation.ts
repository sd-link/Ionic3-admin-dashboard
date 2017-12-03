import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { UserService } from '../../services/user.service';
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-registration-activation',
    templateUrl: 'registration-activation.html',
    providers: [UserService]
})
export class RegistrationActivationPage {

    hasSuccess: boolean;
    hasError: boolean;

    constructor(
        private loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private platform: Platform,
        private _userService: UserService, ) {
        this.activateAccount();
    }



    ionViewDidLoad() {
    }

    toLogin() {
        this.navCtrl.push('LoginPage', { token: null });
    }

    private activateAccount() {
        let token = {
            token: this.platform.getQueryParam('token')
        };
        const loading = this.loadingCtrl.create({
            content: 'Confirming token...'
        });
        this._userService.activateAccount(token).subscribe(res => {
            loading.dismiss();
            this.hasSuccess = true;
        }, error => {
            loading.dismiss();
            this.hasError = true;
        })
    }


}
