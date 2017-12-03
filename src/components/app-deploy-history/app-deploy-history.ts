import { BuildService } from '../../services/kubernetes/build.service';
import { ActionSheetController, LoadingController } from 'ionic-angular';
import { DeploymentConfigService } from '../../services/kubernetes/deploymentconfig.service';
import { Observable } from 'rxjs/Rx';
import { ImageStreamImagesService } from '../../services/kubernetes/imagestreamimages.service';
import { FormatterService } from '../../services/formatter.service';
import { ReplicationControllerService } from '../../services/kubernetes/replicationcontroller.service';
import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * Generated class for the AppDeployHistoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-deploy-history',
  templateUrl: 'app-deploy-history.html',
  providers: [ReplicationControllerService, ImageStreamImagesService, BuildService]
})
export class AppDeployHistoryComponent implements OnChanges {
  @Input() projectId: any;
  @Input() appId: any;
  replicationControllers: any;
  toggle: number;
  onDeployProgress: boolean;

  constructor(
    private _replicationcontrollerService: ReplicationControllerService,
    private _formatterService: FormatterService,
    private _imageStreamImages: ImageStreamImagesService,
    private _deploymentConfig: DeploymentConfigService,
    public loadingCtrl: LoadingController,
    public _buildservice: BuildService,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  ngOnChanges() {
    if (this.projectId && this.appId)
      this.loadLogs(this.projectId, this.appId);
  }

  loadLogs(projectId, appId) {
    this.replicationControllers = {};
    const queryString = `?labelSelector=app=${appId}`;
    this._replicationcontrollerService.listReplicationControllers(projectId, queryString)
      .flatMap(res => {
        if (!res.items.length)
          return Observable.from([{}]);
        const populatedReversedItems$ = res.items.map((item, idx) => {
          return this.loadImagesDetail(item).map(metadata => {
            return {
              ...item, metadata,
              deployVersion: parseInt(item.metadata.annotations['openshift.io/deployment-config.latest-version']),
              statusReason: this._formatterService.capitalizeFirstLetter(item.metadata.annotations['openshift.io/deployment.status-reason']),
              phase: item.metadata.annotations['openshift.io/deployment.phase']
            }
          });
        });

        return Observable.combineLatest(populatedReversedItems$)
      })
      .subscribe((res:any) => {
        this.replicationControllers = {
          lastExecution: moment(res[0].metadata.creationTimestamp).fromNow(),
          items: _.sortBy(res, 'deployVersion').reverse()
        };
        this.onDeployProgress = (this.replicationControllers.items[0].phase == 'Running') ? true : false;
      });
  }

  loadBuildLogs(replicationController) {
    const params = `?labelSelector=app=dashboard`
    return this._buildservice.queryBuildLogs(this.projectId, params)
      .map(res => {
        debugger;
        return {
          // ...this.replicationControllers.items[index].metadata,
          commitId: _.truncate(res.spec.revision.git.commit, { 'length': 7, 'omission': '' }),
          commitAuthor: res.spec.revision.git.author,
          commitMessage: this.populateBuildMessage(res.spec.revision.git),
          sourceLocation: res.spec.source.git.uri
        }
      })
  }

  populateBuildMessage(git) {
    return `${git.message} commit by "${git.author.name}"`
  }

  loadImagesDetail(image) {
    const imageName = _.split(image.spec.template.spec.containers[0].image, '/');
    return this._imageStreamImages.getImageStreamImage(imageName[1], imageName[2]).map(detail => {
      return this.populateImageLabel(detail)
    })
  }

  rollbackConfirmation(deploymentId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Rollback to this build?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.doRollback(deploymentId)
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }

  doRollback(deploymentId) {
    const loading = this.loadingCtrl.create({ content: 'Rollback progress please wait...' });
    loading.present();
    const body = {
      "kind": "DeploymentConfigRollback",
      "apiVersion": "v1",
      "spec": {
        "from": {
          "name": deploymentId
        }, "includeTemplate": true
      }
    };
    this._deploymentConfig.createDeploymentConfigRollback(body, this.projectId)
      .flatMap(res => {
        return this._deploymentConfig.putDeploymentConfig(res, this.projectId, this.appId)
      })
      .subscribe(res => {
        this.loadLogs(this.projectId, this.appId);
        loading.dismiss();
      }, () => { })
  }

  populateImageLabel(configLabels) {
    const labels = configLabels.image.dockerImageMetadata.Config.Labels;
    const buildEnv = configLabels.image.dockerImageMetadata.ContainerConfig.Env;
    const buildName = _.without(_.filter(buildEnv).map(res => {
      return (_.includes(res, 'OPENSHIFT_BUILD_NAME=')) ? res : null;
    }), null)[0].split('=')[1]
    return {
      commitAuthor: labels['io.openshift.build.commit.author'],
      commitMessage: labels['io.openshift.build.commit.message'],
      commitRef: labels['io.openshift.build.commit.ref'],
      buildImage: labels['io.openshift.build.image'],
      sourceLocation: labels['io.openshift.build.source-location'],
      buildName: buildName
    }
  }

  instantiateDeploymentConfig() {
    const body = { "kind": "DeploymentRequest", "apiVersion": "v1", "name": this.appId, "latest": true, "force": true }
    this.onDeployProgress = true;
    this._deploymentConfig.instantiateDeploymentConfig(body, this.projectId, this.appId)
      .subscribe(res => {
        this.loadLogs(this.projectId, this.appId);
      }, () => {
        this.onDeployProgress = false;
      })
  }

}
