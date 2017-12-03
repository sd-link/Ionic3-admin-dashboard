import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCreatePage } from './app-create';
import { AppCreateCodeComponent } from './app-create-code';
import { AppCreateResourceComponent } from './app-create-resource';
import { AppCreateSettingComponent } from './app-create-setting';
import { AppCreateConfigureComponent } from './app-create-configure';
import { LoadingSpinnerComponentModule} from '../../components/loading-spinner/loading-spinner.module'

@NgModule({
  declarations: [
    AppCreatePage,
    AppCreateCodeComponent,
    AppCreateResourceComponent,
    AppCreateSettingComponent,
    AppCreateConfigureComponent
  ],
  imports: [
    IonicPageModule.forChild(AppCreatePage),
    LoadingSpinnerComponentModule,
    
  ],
  exports: [
    AppCreatePage,
    AppCreateCodeComponent,
    AppCreateResourceComponent,
    AppCreateSettingComponent,
    AppCreateConfigureComponent
  ]
})
export class AppCreatePageModule {}
