import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCronjobsPage } from './modal-cronjobs';

@NgModule({
  declarations: [
    ModalCronjobsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCronjobsPage),
  ],
})
export class ModalCronjobsPageModule {}
