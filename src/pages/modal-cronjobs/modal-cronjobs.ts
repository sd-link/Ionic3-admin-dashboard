import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalCronjobsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-cronjobs',
  templateUrl: 'modal-cronjobs.html',
})
export class ModalCronjobsPage {
  cronjobs: any = {}
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    this.cronjobs = {
      command: this.navParams.data.command ? this.navParams.data.command.join("\n") : [],
      schedule: this.navParams.data.schedule
    }
  }

  dismiss() {
    const cronJobsSetting = {
      ...this.cronjobs,
      command: (this.cronjobs.command).split("\n"),
    }
    this.viewCtrl.dismiss(cronJobsSetting);
  }
}
