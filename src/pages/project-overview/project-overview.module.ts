import { DropdownSelectModule } from '../../components/dropdown-select/dropdown-select.module';
import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';
import { ContentAddMemberPageModule } from '../content-add-member/content-add-member.module';

import { ProjectSettings } from './settings/settings';
import { ProjectResources } from './resources/resources';
import { ProjectUsage } from './usage/usage';
import { ProjectAccess } from './access/access'
import { PipeModule } from '../../pipes/pipes.module';
import { ProjectApps } from './apps/apps';
import { ProjectComponents } from './components/components';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectOverviewPage } from './project-overview';
import { SearchComponentModule } from '../../components/search/search.module'
import { PageTitleComponentModule } from '../../components/page-title/page-title.module'
import { ComponentsModule } from "../../components/components.module";

@NgModule({
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
export class ProjectOverviewPageModule {}
