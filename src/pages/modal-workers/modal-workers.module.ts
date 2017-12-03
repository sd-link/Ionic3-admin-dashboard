import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalWorkersPage } from './modal-workers';

@NgModule({
  declarations: [
    ModalWorkersPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalWorkersPage),
  ],
})
export class ModalWorkersPageModule {}
