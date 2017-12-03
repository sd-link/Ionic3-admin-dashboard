import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInvoicesPage } from './user-invoices';

@NgModule({
  declarations: [
    UserInvoicesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInvoicesPage),
  ],
  exports: [
    UserInvoicesPage
  ]
})
export class UserInvoicesPageModule {}
