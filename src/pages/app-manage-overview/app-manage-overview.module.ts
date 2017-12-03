import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';
import { AppDeployHistoryComponentModule } from '../../components/app-deploy-history/app-deploy-history.module';
import { AppSettingsComponent } from './app-settings/app-settings';
import { AppResourcesComponent } from './app-resources/app-resources';
import { AppMetricsComponent } from './app-metrics/app-metrics';
import { AppLogsComponent } from './app-logs/app-logs';
import { AppCodeComponent } from './app-code/app-code';
import { AppAdvancedComponent } from './app-advanced/app-advanced';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppManageOverviewPage } from './app-manage-overview';
import { PageTitleComponentModule } from '../../components/page-title/page-title.module';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AppManageOverviewPage,
    AppAdvancedComponent,
    AppCodeComponent,
    AppLogsComponent,
    AppMetricsComponent,
    AppResourcesComponent,
    AppSettingsComponent
  ],
  imports: [
    PageTitleComponentModule,
    AppDeployHistoryComponentModule,
    LoadingSpinnerComponentModule,
    ComponentsModule,
    IonicPageModule.forChild(AppManageOverviewPage),
  ],
  exports: [
    AppManageOverviewPage,
    AppAdvancedComponent,
    AppCodeComponent,
    AppLogsComponent,
    AppMetricsComponent,
    AppResourcesComponent,
    AppSettingsComponent
  ]
})
export class AppManageOverviewPageModule {}
