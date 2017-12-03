import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { UserService } from './../../services/user.service'
import { User } from '../../models/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../components/validation-message/validation.service';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
    providers: [User, UserService]
})
export class RegisterPage {

    user: User;
    error: String;
    registerForm: FormGroup;
    isFormSubmitted: boolean;
    coutries: string[];

    constructor(
        private _userService: UserService,
        private loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams, private formBuilder: FormBuilder) {
        this.createForm();
        this.getCountry();
    }

    private getCountry() {
        this.coutries = ['Australia', 'Austria', 'India', 'USA', 'Canada'];
    }

    private createForm() {
        this.registerForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, ValidationService.emailValidator]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            company: [''],
            country: ['']
        });
    }


    ionViewDidLoad() {
    }

    onSubmit() {
        this.isFormSubmitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        this.error = null;
        this.user = this.registerForm.value;
        const loading = this.loadingCtrl.create({
            content: 'Signing up...'
        });
        loading.present();
        this._userService.register(this.user).subscribe(res => {
            if (res) {
                loading.dismiss();
                this.navCtrl.push('RegisterSuccessPage');
            }
        }, error => {
            loading.dismiss();
            this.error = error;
        })
    }

    toLogin() {
        this.navCtrl.push('LoginPage');
    }

}
