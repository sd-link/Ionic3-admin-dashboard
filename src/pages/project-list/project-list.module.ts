import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectListPage } from './project-list';

import { SidebarComponentModule } from '../../components/sidebar/sidebar.module'
import { SearchComponentModule } from '../../components/search/search.module'

@NgModule({
  declarations: [
    ProjectListPage,
  ],
  imports: [
    SidebarComponentModule,
    SearchComponentModule,
    IonicPageModule.forChild(ProjectListPage),
  ],
  exports: [
    ProjectListPage
  ]
})
export class ProjectListPageModule {}
