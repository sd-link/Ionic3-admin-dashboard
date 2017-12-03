import { LoadingSpinnerComponentModule } from '../loading-spinner/loading-spinner.module';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AppDeployHistoryComponent } from './app-deploy-history';

@NgModule({
  declarations: [
    AppDeployHistoryComponent,
  ],
  imports: [
    IonicModule,
    LoadingSpinnerComponentModule
  ],
  exports: [
    AppDeployHistoryComponent
  ]
})
export class AppDeployHistoryComponentModule {}
