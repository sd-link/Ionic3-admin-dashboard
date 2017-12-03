import { BuildConfigService } from '../../services/kubernetes/buildconfig.service';
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeploymentConfigService } from "../../services/kubernetes/deploymentconfig.service";

/**
 * Generated class for the AppManageSettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-app-manage-settings',
  templateUrl: 'app-manage-settings.html',
  providers: [DeploymentConfigService, BuildConfigService]
})
export class AppManageSettingsPage {
  app: any = {};
  loadingData: boolean;
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
    public _deploymentconfigService: DeploymentConfigService,
    public _buildConfigService: BuildConfigService
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }
  
  openPage(component) {
    this.navCtrl.push(component, this.navParams.data)
  }

  loadData(currentDeploymentConfig?, currentHpa?) {
    const appParam = this.navParams.data;
    const deploymentConfig$ = this.getDeploymentConfigStream(appParam.namespace, appParam.name);
    const buildConfig$ = this.getBuildConfigStream(appParam.namespace, appParam.name);

    Observable.combineLatest(deploymentConfig$, buildConfig$).subscribe(([deploymentConfig, buildConfig]) => {
      this.app = {
        deploymentConfig,
        buildConfig
      };
      this.loadingData = false;
    }, () => {
      this.loadingData = false;
    });
  }

  getBuildConfigStream(namespace, name) {
    return this._buildConfigService.detailBuildConfigs(namespace, name)
      .map(res => {
        return {
          metadata: res.metadata,
          spec: {
            limits: res.spec.resources.limits,
            output: res.spec.output
          }
        }
      })
  }
  
  getDeploymentConfigStream(namespace, name) {
    return this._deploymentconfigService.getDeploymentConfig(namespace, name);
  }

}
