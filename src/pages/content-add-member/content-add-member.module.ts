import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentAddMemberPage } from './content-add-member';
import { DropdownSelectModule } from '../../components/dropdown-select/dropdown-select.module';
import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [
    ContentAddMemberPage,
  ],
  imports: [
    DropdownSelectModule,
    LoadingSpinnerComponentModule,
    IonicPageModule.forChild(ContentAddMemberPage),
  ],
  exports: [
    ContentAddMemberPage
  ]
})
export class ContentAddMemberPageModule {}
