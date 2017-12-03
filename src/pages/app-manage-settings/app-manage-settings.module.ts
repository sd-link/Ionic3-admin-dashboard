import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppManageSettingsPage } from './app-manage-settings';
import { ComponentsModule } from "../../components/components.module";
import { LoadingSpinnerComponentModule } from "../../components/loading-spinner/loading-spinner.module";
import { PageTitleComponentModule } from "../../components/page-title/page-title.module";

@NgModule({
  declarations: [
    AppManageSettingsPage,
  ],
  imports: [
    PageTitleComponentModule,
    LoadingSpinnerComponentModule,
    ComponentsModule,
    IonicPageModule.forChild(AppManageSettingsPage),
  ],
})
export class AppManageSettingsPageModule {}
