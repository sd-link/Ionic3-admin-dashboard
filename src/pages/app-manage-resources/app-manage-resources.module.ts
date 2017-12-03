import { ModalCronjobsPageModule } from '../modal-cronjobs/modal-cronjobs.module';
import { ModalWorkersPageModule } from '../modal-workers/modal-workers.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppManageResourcesPage } from './app-manage-resources';
import { LoadingSpinnerComponentModule } from "../../components/loading-spinner/loading-spinner.module";
import { AppDeployHistoryComponentModule } from "../../components/app-deploy-history/app-deploy-history.module";
import { PageTitleComponentModule } from "../../components/page-title/page-title.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AppManageResourcesPage
  ],
  imports: [
    PageTitleComponentModule,
    AppDeployHistoryComponentModule,
    LoadingSpinnerComponentModule,
    ComponentsModule,
    ModalWorkersPageModule,
    ModalCronjobsPageModule,
    IonicPageModule.forChild(AppManageResourcesPage),
  ],
  exports: [
    AppManageResourcesPage
  ]
})
export class AppManageResourcesPageModule {}
