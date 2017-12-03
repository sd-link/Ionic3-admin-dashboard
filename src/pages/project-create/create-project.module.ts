import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProjectPage } from './create-project';

import { SidebarComponentModule } from '../../components/sidebar/sidebar.module'
import { SearchComponentModule } from '../../components/search/search.module'

@NgModule({
  declarations: [
    CreateProjectPage,
  ],
  imports: [
    SidebarComponentModule,
    SearchComponentModule,
    IonicPageModule.forChild(CreateProjectPage),
  ],
  exports: [
    CreateProjectPage
  ]
})
export class CreateProjectPageModule {}
