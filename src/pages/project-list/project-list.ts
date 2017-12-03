import { UserService } from '../../services/user.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs'
import { ProjectService } from '../../services/kubernetes/project.service';
import { FormatterService } from '../../services/formatter.service'
import * as _ from 'lodash';

/**
 * Generated class for the ProjectListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html',
  providers: [ProjectService, FormatterService]
})
export class ProjectListPage {

  projects: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private _projectService: ProjectService,
    private _formatterService: FormatterService,
    private _userService: UserService
  ) {
  }

  ionViewCanEnter() {
    this._userService.authenticated().subscribe(authenticated => {
      return authenticated
    }, error => {
      this.navCtrl.push('LoginPage')
    })
  }

  ionViewDidLoad() {
    // TODO this should be a loading animation on the page like metrics
    const loading = this.loadingCtrl.create({
      content: 'Loading project list...'
    });
    loading.present();

    const projectStream$ = this._projectService.listProjects();
    Observable.from(projectStream$).map(res => {
      return res.items.map(res => {
        const displayName = res.annotations['openshift.io/display-name'];
        const description = _.truncate(
          res.annotations['openshift.io/description'],
          {
            'length': 300,
            'separator': /,? +/
          });
        const name = res.name;
        const initial = this._formatterService.getInitial(displayName);
        return {
          displayName, name, initial, description, ...res
        }

      })
    }).subscribe(res => {
      this.projects = res.filter(item => item.status.phase != 'Terminating');
      loading.dismiss();
    }, error => {
      loading.dismiss();
      if (error.code == 403) {
        this._userService.logout();
        this.navCtrl.push('LoginPage')
      }
    })
  }

  createProject() {
    this.navCtrl.push('CreateProjectPage')
  }

  goToDetail(projectId) {
    this.navCtrl.push('ProjectOverviewPage', { projectId, component: 'apps' })
  }
}
