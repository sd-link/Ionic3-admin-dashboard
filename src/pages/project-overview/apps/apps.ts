import { Observable } from 'rxjs/Rx';
import { ServiceService } from '../../../services/kubernetes/service.service';
import { ProjectService } from '../../../services/kubernetes/project.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'project-apps',
    templateUrl: 'apps.html',
    providers: [ServiceService]
})

export class ProjectApps implements OnInit {
    projectApps: any = [];
    project: any = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _serviceService: ServiceService,
        private _projectService: ProjectService
    ) {
    }

    ngOnInit() {
        const projectId = this.navParams.data.projectId;
        const project$ = this._projectService.getProject(projectId).map(res => {
            return { ...res, displayName: res.metadata.annotations['openshift.io/display-name'] }
        });
        const projectService$ = this._serviceService.listServices(projectId)

        Observable.combineLatest(project$, projectService$).subscribe(([detail, services]) => {
            this.projectApps = services.items;
            this.project = detail;
        })
    }

    createApp() {
        this.navCtrl.push('AppCreatePage', this.project.metadata.name)
    }

    toAppDetail(app) {
        this.navCtrl.push('AppManageOverviewPage', app.metadata)
    }
}
