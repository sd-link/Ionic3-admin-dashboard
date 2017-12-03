import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';

import { SidebarComponentModule } from '../../components/sidebar/sidebar.module';
import { SearchComponentModule } from '../../components/search/search.module';

@NgModule({
  declarations: [
    EditProfilePage,
  ],
  imports: [
    SidebarComponentModule,
    SearchComponentModule,
    IonicPageModule.forChild(EditProfilePage),
  ],
  exports: [
    EditProfilePage
  ]
})
export class EditProfilePageModule {}
