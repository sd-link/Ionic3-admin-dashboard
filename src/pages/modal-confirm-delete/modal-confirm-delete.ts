import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalConfirmDeletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-confirm-delete',
  templateUrl: 'modal-confirm-delete.html',
})
export class ModalConfirmDeletePage {
  project: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private _app: App
  ) {
  }

  ionViewDidLoad() {
    this.project = this.navParams.data;
  }
  
  ionViewDidEnter() {
    this._app.setTitle("AusNimbus Dashboard");
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Incorrect, please try again.',
      buttons: ['Ok']
    });
    alert.present();
  }

  submitForm() {
    if (this.project.id == this.project.confirm) {
      this.viewCtrl.dismiss({
        ...this.project,
        delete: true
      })
    }
  }

}
