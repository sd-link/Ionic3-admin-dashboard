import { DownloadService } from '../../services/download.service';
import { FormatterService } from '../../services/formatter.service';
import { UserService } from '../../services/user.service';
import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the UserInvoicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-invoices',
  templateUrl: 'user-invoices.html',
  providers: [DownloadService, FormatterService]
})
export class UserInvoicesPage {
  invoices: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _userService: UserService,
    private _formatterService: FormatterService,
    private _downloadService: DownloadService
  ) {
  }

  ionViewDidLoad() {
    this.loadInvoices();
  }

  loadInvoices() {
    const loading = this.loadingCtrl.create({
      content: 'Loading invoices...'
    });
    loading.present();
    this._userService.getUserInvoices().subscribe(res => {
      this.invoices = res.map(invoice => {
        return { ...invoice, date: this._formatterService.getFormatedDate(invoice.created_at) }
      });
      loading.dismiss();
    }, err => {
      loading.dismiss();

      this.alertCtrl.create({
        title: 'Failed!',
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  downloadInvoices(invoice) {
    const loading = this.loadingCtrl.create({
      content: 'Downloading...'
    });
    loading.present();
    this._userService.getInvoicesFile(invoice.id).subscribe(res => {
      const date = moment();
      const fileName = `${invoice.id} - ${date}.pdf`;
      this._downloadService.downloadBlob(res, fileName);
      loading.dismiss();
    }, err => {
      loading.dismiss();
    });
  }
}
