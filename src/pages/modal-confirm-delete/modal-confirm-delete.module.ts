import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalConfirmDeletePage } from './modal-confirm-delete';

@NgModule({
  declarations: [
    ModalConfirmDeletePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalConfirmDeletePage),
  ],
})
export class ModalConfirmDeletePageModule {}
