import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,ModalController } from 'ionic-angular';
import * as braintree from 'braintree-web';
import { UserService } from '../../services/user.service';
import {PaymentMethodModalPage} from '../payment-method-modal/payment-method-modal';

/**
 * Generated class for the UserSubscriptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-user-subscription',
	templateUrl: 'user-subscription.html',
})
export class UserSubscriptionPage {
	paymentOption: any = 'default';
	braintreeLoaded: boolean = false;
	clientInstance: braintree.Client;
	deviceData: any;
	hostedFieldsInstance: any;
	payloadNonce: any;
	subscriptionMessage = {
		error: ''
	}


	constructor(public navCtrl: NavController, public navParams: NavParams, public _userService: UserService, public loadingCtrl: LoadingController, public chRef: ChangeDetectorRef, public alertCtrl: AlertController,public modalCtrl:ModalController) {
	}

	ionViewDidLoad() {
		/*Custom form braintree setup*/
		// this._userService.getBraintreeToken().subscribe(res => {
		// 	const authorizationToken: string = res.token
		// 	braintree.client.create({
		// 		authorization: authorizationToken
		// 	}, (err, clientInstance: braintree.Client) => {
		// 		this.clientInstance = clientInstance;
		// 		braintree.dataCollector.create({
		// 			client: this.clientInstance,
		// 			paypal: true,
		// 			kount: false
		// 		}, (err, dataCollectorInstance) => {
		// 			if (err) {
		// 				return;
		// 			}
		// 			this.deviceData = dataCollectorInstance.deviceData;
		// 		});
		// 		braintree.hostedFields.create({
		// 			client: this.clientInstance,
		// 			styles: {
		// 				'input': {
		// 					'font-size': '14px',
		// 					'font-family': 'Open Sans, helvetica, tahoma, calibri, sans-serif',
		// 					'color': '#3a3a3a'
		// 				},
		// 				':focus': {
		// 					'color': 'black'
		// 				}
		// 			},
		// 			fields: {
		// 				number: {
		// 					selector: '#card-number',
		// 					placeholder: '4111 1111 1111 1111'
		// 				},
		// 				cvv: {
		// 					selector: '#cvv',
		// 					placeholder: '123'
		// 				},
		// 				expirationMonth: {
		// 					selector: '#expiration-month',
		// 					placeholder: 'MM'
		// 				},
		// 				expirationYear: {
		// 					selector: '#expiration-year',
		// 					placeholder: 'YY'
		// 				},
		// 				postalCode: {
		// 					selector: '#postal-code',
		// 					placeholder: '3000'
		// 				}
		// 			}
		// 		}, (err, hostedFieldsInstance) => {
		// 			this.braintreeLoaded = true;
		// 			this.hostedFieldsInstance = hostedFieldsInstance;
		// 			let self = this;
		// 			hostedFieldsInstance.on('validityChange', function(event) {
		// 				var field = event.fields[event.emittedBy];
		// 				if (field.isValid) {
		// 					if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
		// 						if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
		// 							return;
		// 						}
		// 					} else if (event.emittedBy === 'number') {
		// 						/*Change this with empty model*/
		// 						// $('#card-number').next('span').text('');
		// 						self.subscriptionMessage.error = '';
		// 						self.chRef.detectChanges();

		// 					}
		// 					var elem = document.getElementById(field.container.id);
		// 					/*can be changed with succes class for form*/
		// 					elem.classList.add('has-success');
		// 				}
		// 				else if (field.isPotentiallyValid) {
		// 					// Remove styling  from potentially valid fields
		// 					var elem = document.getElementById(field.container.id);
		// 					elem.classList.remove('has-warning');
		// 					elem.classList.add('has-success');
		// 					if (event.emittedBy === 'number') {
		// 						/*Change this with empty model*/
		// 						// $('#card-number').next('span').text('');
		// 						self.subscriptionMessage.error = '';
		// 						self.chRef.detectChanges();
		// 					}
		// 				} else {
		// 					// Add styling to invalid fields
		// 					var elem = document.getElementById(field.container.id);
		// 					elem.classList.add('has-warning');
		// 					// Add helper text for an invalid card number
		// 					if (event.emittedBy === 'number') {
		// 						self.subscriptionMessage.error = 'Looks like this card number has an error.';
		// 						self.chRef.detectChanges();
		// 						// $('#card-number').next('span').text('Looks like this card number has an error.');
		// 					}
		// 				}
		// 			});
		// 		})
		// 	});
		// this.onLoading = false;
		// }, err => {
		// 	this.onLoading = false;
		// 	console.error(err);
		// })
	}

	onChangeOption(e) {
		if (this.paymentOption == 'paypal') {
			braintree.paypal.create({
				client: this.clientInstance
			}, (paypalErr, paypalInstance) => {
				paypalInstance.tokenize({
					flow: 'vault',
					billingAgreementDescription: 'AusNimbus',
					locale: 'en_au',
					enableShippingAddress: false
				}, function(err, payload) {
					return true;
				});
			});

		}
	}

	showPaymentModal(){
        const paymentModal = this.modalCtrl.create(PaymentMethodModalPage);
        paymentModal.present();
	}

	submitCard() {
		const loading = this.loadingCtrl.create({
			content: 'Verifying Card...'
		});
		loading.present();
		this.hostedFieldsInstance.tokenize((err, payload) => {
			if (err) {
				console.error(err);
				this.alertCtrl.create({
					title: 'Failed!',
					message: err.message,
					buttons: ['OK']
				}).present();
				loading.dismiss();
				return false;
			}
			else {
				this.payloadNonce = payload.nonce;
				const requestBody = {
					payment_method_nonce : this.payloadNonce,
					device_data : this.deviceData
				}
				this._userService.registerSubscription(requestBody).subscribe((res) => {
					loading.dismiss();
					this.alertCtrl.create({
					title: 'Success',
					message: 'Succesfully Subscribe',
					buttons: ['OK']
				}).present();

				},(err) => {
					loading.dismiss();
					this.alertCtrl.create({
					title: 'Failed!',
					message: err.error,
					buttons: ['OK']
				}).present();

				})
			}
		})

	}

}
