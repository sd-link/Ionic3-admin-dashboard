var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var AppManageOverviewPageModule = (function () {
    function AppManageOverviewPageModule() {
    }
    return AppManageOverviewPageModule;
}());
AppManageOverviewPageModule = __decorate([
    NgModule({
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
], AppManageOverviewPageModule);
export { AppManageOverviewPageModule };
//# sourceMappingURL=app-manage-overview.module.js.map