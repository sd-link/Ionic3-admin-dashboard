import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';

import { SidebarComponentModule } from '../../components/sidebar/sidebar.module'
import { SearchComponentModule } from '../../components/search/search.module'

@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    SidebarComponentModule,
    SearchComponentModule,
    IonicPageModule.forChild(Home),
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
