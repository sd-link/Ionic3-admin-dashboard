var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ModalCronjobsPageModule } from '../modal-cronjobs/modal-cronjobs.module';
import { ModalWorkersPageModule } from '../modal-workers/modal-workers.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppManageResourcesPage } from './app-manage-resources';
import { LoadingSpinnerComponentModule } from "../../components/loading-spinner/loading-spinner.module";
import { AppDeployHistoryComponentModule } from "../../components/app-deploy-history/app-deploy-history.module";
import { PageTitleComponentModule } from "../../components/page-title/page-title.module";
import { ComponentsModule } from "../../components/components.module";
var AppManageResourcesPageModule = (function () {
    function AppManageResourcesPageModule() {
    }
    return AppManageResourcesPageModule;
}());
AppManageResourcesPageModule = __decorate([
    NgModule({
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
], AppManageResourcesPageModule);
export { AppManageResourcesPageModule };
//# sourceMappingURL=app-manage-resources.module.js.map