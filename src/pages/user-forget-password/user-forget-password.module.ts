import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserForgetPasswordPage } from './user-forget-password';

@NgModule({
  declarations: [
    UserForgetPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(UserForgetPasswordPage),
  ],
  exports: [
    UserForgetPasswordPage
  ]
})
export class UserForgetPasswordPageModule {}
