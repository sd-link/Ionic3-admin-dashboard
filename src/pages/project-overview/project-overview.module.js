var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DropdownSelectModule } from '../../components/dropdown-select/dropdown-select.module';
import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';
import { ContentAddMemberPageModule } from '../content-add-member/content-add-member.module';
import { ProjectSettings } from './settings/settings';
import { ProjectResources } from './resources/resources';
import { ProjectUsage } from './usage/usage';
import { ProjectAccess } from './access/access';
import { PipeModule } from '../../pipes/pipes.module';
import { ProjectApps } from './apps/apps';
import { ProjectComponents } from './components/components';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectOverviewPage } from './project-overview';
import { SearchComponentModule } from '../../components/search/search.module';
import { PageTitleComponentModule } from '../../components/page-title/page-title.module';
import { ComponentsModule } from "../../components/components.module";
var ProjectOverviewPageModule = (function () {
    function ProjectOverviewPageModule() {
    }
    return ProjectOverviewPageModule;
}());
ProjectOverviewPageModule = __decorate([
    NgModule({
        declarations: [
            ProjectOverviewPage,
            ProjectApps,
            ProjectComponents,
            ProjectUsage,
            ProjectSettings,
            ProjectResources,
            ProjectAccess,
        ],
        imports: [
            PipeModule,
            SearchComponentModule,
            PageTitleComponentModule,
            ContentAddMemberPageModule,
            LoadingSpinnerComponentModule,
            DropdownSelectModule,
            ComponentsModule,
            IonicPageModule.forChild(ProjectOverviewPage),
        ],
        exports: [
            ProjectOverviewPage,
            ProjectApps,
            ProjectComponents,
            ProjectSettings
        ]
    })
], ProjectOverviewPageModule);
export { ProjectOverviewPageModule };
//# sourceMappingURL=project-overview.module.js.map