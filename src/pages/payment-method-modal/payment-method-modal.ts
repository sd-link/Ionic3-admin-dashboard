import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as dropin from 'braintree-web-drop-in';
import { UserService } from '../../services/user.service';



/**
 * Generated class for the PaymentMethodModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-payment-method-modal',
	templateUrl: 'payment-method-modal.html',
})
export class PaymentMethodModalPage {
	public braintreeLoaded: boolean = false;
	public isValid:boolean = false;
	public submitButton:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService) {
	}

	ionViewDidLoad() {
		this.submitButton = document.getElementById("submit");
		this.userService.getBraintreeToken().subscribe((res) => {
			const authorizationToken = res.token;
			dropin.create({
				authorization: authorizationToken,
				selector: '#dropin-container',
				paypal: {
					flow: 'vault'
				}
			}, (err, dropinInstance) => {
				if (err) {
					// handle error here
					console.error(err);
					return;
				}
				else {
					dropinInstance.on('paymentMethodRequestable',(event) => {
						this.isValid = true;
					})
					this.braintreeLoaded = true;
					this.submitButton.addEventListener("click",() => {
						dropinInstance.requestPaymentMethod((requestPaymentMethodErr,payload) => {
                            this.registerSubscription(payload);
						})
					})
					// data collector not released yet
					// braintree.dataCollector.create({
					// 	client:dropinInstance,
					// 	paypal : true,
					// 	kount  : false
					// },(err,dataCollectorInstance) => {
					// 	if(err){
					// 		console.error(err);
					// 		return;
					// 	}
					// 	var deviceData = dataCollectorInstance.deviceData;
					// 	console.log(deviceData);
					// })
					
				}
			});
		})

	}

	registerSubscription(payload){
		console.log(payload.nonce);
	}

}
