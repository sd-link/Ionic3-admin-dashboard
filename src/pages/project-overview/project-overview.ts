import { ListenerService } from '../../services/listener.service';
import { ProjectService } from '../../services/kubernetes/project.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProjectOverviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-project-overview',
  templateUrl: 'project-overview.html',
  providers: [ListenerService]
})
export class ProjectOverviewPage {
  section: 'apps' | 'components' | 'access' | 'resources' | 'usage' | 'settings' = 'apps'
  project: any = {};
  projectApps: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _projectService: ProjectService,
    private _listenerService: ListenerService
  ) {
  }

  ionViewDidLoad() {
    this.section = this.navParams.data.component;
    const projectId = this.navParams.data.projectId;
    this.loadData(projectId);
    
    this._listenerService.listenReload().subscribe(res => {
        if (res.type == 'project' && res.action !== 'delete' && res.projectId == projectId)
          this.loadData(projectId);
    });
  }

  loadData(projectId) {
    this._projectService.getProject(projectId).map(res => {
      const displayName = res.metadata.annotations['openshift.io/display-name'];
      const name = res.metadata.name
      return { ...res, displayName, name }
    }).subscribe(res => {
      this.project = res;
    })
  }

  openPage(event) {
    this.section = event;
  }
}
