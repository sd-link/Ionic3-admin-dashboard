import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { createSecretDlgComponent } from './app-create-code-dlg';

@NgModule({
  declarations: [
    createSecretDlgComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    createSecretDlgComponent
  ]
})

export class createSecretDlgComponentModule {}

