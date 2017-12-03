import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalWorkersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-workers',
  templateUrl: 'modal-workers.html',
})
export class ModalWorkersPage {
  worker: any = {}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    const command = this.navParams.data.command ? this.navParams.data.command : [];
    this.worker = {
      command: command.join("\n"),
      replicas: this.navParams.data.replicas
    }
  }

  dismiss() {
    const workersSetting = {
      ...this.worker,
      replicas: parseInt(this.worker.replicas),
      command: (this.worker.command).split('\n')
    }
    this.viewCtrl.dismiss(workersSetting);
  }

}
