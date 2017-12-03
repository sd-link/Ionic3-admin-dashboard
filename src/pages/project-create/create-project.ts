import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Project } from '../../models/Project'

import { ProjectService } from '../../services/kubernetes/project.service'

/**
 * Generated class for the CreateProjectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-project',
  templateUrl: 'create-project.html',
  providers: [Project, ProjectService]
})
export class CreateProjectPage {

  projectRequest: any = {};

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private project: Project,
    private _projectService: ProjectService
  ) {
  }

  ionViewDidLoad() {
  }

  proceedRequest() {
    const loading = this.loadingCtrl.create({
      content: 'Creating project...'
    });
    loading.present();
    const name = this.projectRequest.name ? this.projectRequest.name.split(' ').join('').toLowerCase() : null;
    const body = {
      ...this.project.default,
      metadata: { ...this.project.default.metadata, name },
      displayName: this.projectRequest.name,
    }

    this._projectService.createProject(body).subscribe(res => this.successCreate(loading), err => this.failedAlert(err, loading))
  }

  successCreate(loading) {
    loading.dismiss();
    this.navCtrl.push('ProjectListPage')
  }

  failedAlert(err, loading) {
    loading.dismiss();
    this.alertCtrl.create({
      title: 'Failed!',
      subTitle: err.message,
      buttons: ['OK']
    }).present();
  }
}
