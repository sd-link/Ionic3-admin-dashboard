import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserChangePasswordPage } from './user-change-password';

@NgModule({
  declarations: [
    UserChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(UserChangePasswordPage),
  ],
  exports: [
    UserChangePasswordPage
  ]
})
export class UserChangePasswordPageModule {}
