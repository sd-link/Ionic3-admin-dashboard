import { CronJobsService } from '../../services/kubernetes/cronjobs.service';
import { Observable } from 'rxjs/Rx';
import { HorizontalPodAutoscalersService } from '../../services/kubernetes/hpa.service';
import { DeploymentConfigService } from '../../services/kubernetes/deploymentconfig.service';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ModalWorkersPage } from "../modal-workers/modal-workers";
import { ModalCronjobsPage } from "../modal-cronjobs/modal-cronjobs";

/**
 * Generated class for the AppManageResourcesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-app-manage-resources',
  templateUrl: 'app-manage-resources.html',
  providers: [DeploymentConfigService, HorizontalPodAutoscalersService, CronJobsService]
})
export class AppManageResourcesPage {
  app: any;
  loading: boolean;
  loadingData: boolean = true;
  resource: any = {
    limits: {},
    hpa: {},
    autoScale: 0,
    manualScaleValue: 0,
    enableWorkers: false,
    workers: {},
    enableCronJobs: false,
    cronJobs: {}
  };
  rangeObject: any = {
    lower: 1,
    upper: 10
  };
  tabMenus: any = [
    { name: 'overview', value: 'Overview', component: 'AppManageOverviewPage', icon: 'fa-bars'},
    { name: 'code', value: 'Code', component: 'AppManageCodePage', icon: 'fa-code'},
    { name: 'resources', value: 'Resources', component: 'AppManageResourcesPage', icon: 'fa-database'},
    { name: 'metrics', value: 'Metrics', component: 'AppManageMetricsPage', icon: 'fa-chart-area'},
    { name: 'logs', value: 'Logs', component: 'AppManageLogsPage', icon: 'fa-terminal'},
    { name: 'advanced', value: 'Advanced', component: 'AppManageAdvancedPage', icon: 'fa-ellipsis-h'},
    { name: 'settings', value: 'Settings', component: 'AppManageSettingsPage', icon: 'fa-cog'}
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _deploymentconfigService: DeploymentConfigService,
    public _hpaService: HorizontalPodAutoscalersService,
    public _cronJobsService: CronJobsService,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  getHpaStream(currentHpa, namespace, name) {
    if (currentHpa)
      return Observable.from([currentHpa])
    const params = `?labelSelector=app=${name}`
    return this._hpaService.getProjectHpa(namespace, params)
      .flatMap(res => {
        if (res.items.length)
          return this._hpaService.getHpa(namespace, name)
        return Observable.from([false])
      })
  }

  getDeploymentConfigStream(currentDeploymentConfig, namespace, name) {
    if (currentDeploymentConfig)
      return Observable.from([currentDeploymentConfig])
    return this._deploymentconfigService.getDeploymentConfig(namespace, name);
  }

  getWorkerStream(namespace, name) {
    return this._deploymentconfigService.getDeploymentConfigWithParams(namespace, name, `labelSelector=worker=${name}`)
      .flatMap(res => {
        if (res.items.length) {
          const workerName = res.items[0].metadata.name
          return this._deploymentconfigService.getDeploymentConfig(namespace, workerName)
        }
        return Observable.from([false])
      })
  }

  getCronJobsStream(namespace, name) {
    return this._cronJobsService.getProjectCronJobs(namespace)
      .map(res => {
        if (res.items.length)
          return res.items.filter(item => item.metadata.name == name)
        return [];
      })
      .flatMap(res => {
        if (res.length) 
          return this._cronJobsService.getCronJobs(namespace, res[0].metadata.name)
        return Observable.from([false])
      })
  }

  loadData(currentDeploymentConfig?, currentHpa?) {
    const appParam = this.navParams.data;
    const deploymentConfig$ = this.getDeploymentConfigStream(currentDeploymentConfig, appParam.namespace, appParam.name);
    const horizontalPodAutoscaler$ = this.getHpaStream(currentHpa, appParam.namespace, appParam.name);
    const workerConfig$ = this.getWorkerStream(appParam.namespace, appParam.name)
    const cronJobs$ = this.getCronJobsStream(appParam.namespace, appParam.name)

    Observable.combineLatest(deploymentConfig$, horizontalPodAutoscaler$, workerConfig$, cronJobs$).subscribe(([deploymentConfig, hpa, workers, cronJobs]) => {
      this.app = deploymentConfig;
      this.resource = {
        ...this.resource,
        autoScale: hpa ? 1 : 0,
        manualScaleValue: deploymentConfig.spec.replicas,
        hpa: hpa ? hpa : {},
        limits: this.populateResource(deploymentConfig),
        enableWorkers: workers? true : false,
        workers: this.populateWorkers(workers),
        enableCronJobs: cronJobs? true : false,
        cronJobs: this.populateCronJobs(cronJobs)
      }
      this.setRangeValue(hpa);
      this.loadingData = false;
    }, () => {
      this.loadingData = false;
    });
  }

  setRangeValue(hpa) {
    if (hpa) {
      this.rangeObject = {
        lower: hpa.spec.minReplicas,
        upper: hpa.spec.maxReplicas
      }
    }
  }

  backToProject() {
    this.navCtrl.push('ProjectOverviewPage', { projectId: this.navParams.data.namespace, component: 'apps' })
  }

  openPage(component) {
    this.navCtrl.push(component, this.navParams.data)
  }

  checkHorizontalPodAutoscalersChange(namespace, name) {
    // If HPA true and change to manual, delete HPA
    if (this.resource.hpa.spec && this.resource.autoScale == 0) {
      return this._hpaService.deleteHpa(namespace, name)
    }

    // If HPA change, patch HPA
    if (this.resource.hpa.spec) {
      if (this.rangeObject.lower != this.resource.hpa.spec.minReplicas || this.rangeObject.upper != this.resource.hpa.spec.maxReplicas) {
        this.resource.hpa.spec = {
          ...this.resource.hpa.spec,
          minReplicas: this.rangeObject.lower,
          maxReplicas: this.rangeObject.upper
        }
        return this._hpaService.patchHpa(namespace, name, this.resource.hpa)
      }
    }

    // If change to auto, create HPA
    if (!this.resource.hpa && this.resource.autoScale) {
      const hpaBodyRequest = {
        minReplicas: String(this.rangeObject.lower),
        maxReplicas: String(this.rangeObject.upper)
      }
      return this._hpaService.createHpa(namespace, name, hpaBodyRequest)
    }

    return Observable.from([false])
  }

  checkDeploymentConfigChange(namespace, name) {
    return this.getDeploymentConfigStream(null, namespace, name)
      .flatMap(deploymentConfig => {
        if (this.resource.manualScaleValue == deploymentConfig.spec.replicas && this.resource.limits.memory == this.populateResource(deploymentConfig).memory)
          return Observable.from([false])
        const body = {
          replicas: this.resource.manualScaleValue,
          limits: this.resource.limits
        }
        return this._deploymentconfigService.patchDeploymentConfig(namespace, name, body);
      })
  }

  checkWorkersChange(namespace, name) {
    return this.getWorkerStream(namespace, name)
      .flatMap(workers => {
        // if enableWorker true, do create or patch
        if (this.resource.enableWorkers) {
          if (workers) {
            // patch worker, if no change do nothing
            const populatedWorkers = this.populateWorkers(workers);
            if (populatedWorkers != this.resource.workers)
              return this._deploymentconfigService.patchDeploymentConfig(namespace, workers.metadata.name, this.resource.workers)
            return Observable.from([false])
          }
          // create worker
          return this._deploymentconfigService.createDeploymentConfig(namespace, name, this.resource.workers)
        } else {
          // if enableWorker false, do delete or nothing
          if (workers)
            return this._deploymentconfigService.deleteDeploymentConfig(namespace, workers.metadata.name)
          return Observable.from([false])
        }

      })
  }

  checkCronJobsChange(namespace, name) {
    return this.getCronJobsStream(namespace, name)
      .flatMap(cronJob => {
        if (this.resource.enableCronJobs) {
          if (cronJob) {
            // If exist, patch it or do nothing
            const populatedCronJob = this.populateCronJobs(cronJob)
            if (populatedCronJob != this.resource.cronJobs)
              return this._cronJobsService.patchCronJobs(namespace, name, this.resource.cronJobs)
            return Observable.from([false])
          }
          // if enable but empty, create it
          return this._cronJobsService.createCronJobs(namespace, name, this.resource.cronJobs)
        } else {
          // if cron exist, delete or nothing
          if (cronJob)
            return this._cronJobsService.deleteCronJobs(namespace, name)
          return Observable.from([false])
        }
      })
  }

  submitData() {
    this.loading = true;
    const appParam = this.navParams.data;
    const deploymentConfig$ = this.checkDeploymentConfigChange(appParam.namespace, appParam.name)
    const hpa$ = this.checkHorizontalPodAutoscalersChange(appParam.namespace, appParam.name);
    const workers$ = this.checkWorkersChange(appParam.namespace, appParam.name)
    const cronJobs$ = this.checkCronJobsChange(appParam.namespace, appParam.name)
    Observable.combineLatest(deploymentConfig$, hpa$, workers$, cronJobs$).subscribe(([deploymentConfig, hpa, workers, cronJobs]) => {
      this.loadData(deploymentConfig, hpa);
      this.loading = false;
      this.openToast('Data Updated')
    }, err => {
      this.loading = false;
      this.openToast('Update failed')
    })
  }
  
  openToast(value) {
    const toast = this.toastCtrl.create({
      message: value,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  updateReplicasCount(replicasVal) {
    this.resource = {
      ...this.resource,
      manualScaleValue: replicasVal
    }
  }

  populateWorkers(workers) {
    return {
      command : workers.spec ? workers.spec.template.spec.containers[0].command : [],
      replicas : workers.spec ? workers.spec.replicas : 1
    }
  }
  
  populateCronJobs(cronJob) {
    return {
      schedule: cronJob.spec ? cronJob.spec.schedule : '0 0 * * *',
      command: cronJob.spec ? cronJob.spec.jobTemplate.spec.template.spec.containers[0].command : []
    };
  }

  populateResource(deploymentConfig) {
    const limits = deploymentConfig.spec.template.spec.containers[0].resources.limits;
    return limits ? limits : { memory: '512Mi' }
  }

  modalWorkers() {
    const workersModal = this.modalCtrl.create(ModalWorkersPage, this.resource.workers);
    workersModal.onDidDismiss(data => {
      this.resource = {
        ...this.resource,
        workers: data
      }
    });
    workersModal.present();
  }

  modalCronJobs() {
    const cronJobsModal = this.modalCtrl.create(ModalCronjobsPage, this.resource.cronJobs);
    cronJobsModal.onDidDismiss(data => {
      this.resource = {
        ...this.resource,
        cronJobs: data
      }
    });
    cronJobsModal.present();
  }

}