import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Generated class for the TabsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

const MENULIST = {
  'app' : [
    { name: 'overview', value: 'Overview', component: 'AppManageOverviewPage', icon: 'fa-bars'},
    { name: 'code', value: 'Code', component: 'AppManageCodePage' , icon: 'fa-code'},
    { name: 'resources', value: 'Resources', component: 'AppManageResourcesPage' , icon: 'fa-database'},
    { name: 'metrics', value: 'Metrics', component: 'AppManageMetricsPage' , icon: 'fa-chart-area'},
    { name: 'logs', value: 'Logs', component: 'AppManageLogsPage' , icon: 'fa-terminal'},
    { name: 'advanced', value: 'Advanced', component: 'AppManageAdvancedPage' , icon: 'fa-ellipsis-h'},
    { name: 'settings', value: 'Settings', component: 'AppManageSettingsPage' , icon: 'fa-cog'}
  ],
  'project' : [
    { name: 'apps', value: 'Apps', component: 'apps', icon: 'fa-cube'},
    { name: 'components', value: 'Component', component: 'components' , icon: 'fa-cubes'},
    { name: 'access', value: 'Access', component: 'access' , icon: 'fa-lock'},
    { name: 'resources', value: 'Resource', component: 'resources' , icon: 'fa-database'},
    { name: 'usage', value: 'Usage', component: 'usage' , icon: 'fa-chart-area'},
    { name: 'settings', value: 'Settings', component: 'settings' , icon: 'fa-cog'}
  ] 
}

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent implements OnInit{
  @Output() onclick = new EventEmitter<any>();
  @Input() active: string;
  @Input() type: string;
  menus: any = [];

  constructor() {}

  ngOnInit() {
    if (this.type == 'project') {
      this.menus = MENULIST.project
    } else {
      this.menus = MENULIST.app
    }
  }

  emit(menu) {
    this.onclick.emit(menu);
  }

}
