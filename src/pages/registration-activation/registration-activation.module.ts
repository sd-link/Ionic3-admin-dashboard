import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationActivationPage } from './registration-activation';

@NgModule({
    declarations: [
        RegistrationActivationPage
    ],
    imports: [
        IonicPageModule.forChild(RegistrationActivationPage),
    ],
    exports: [
        RegistrationActivationPage
    ]
})
export class RegistrationActivationPageModule { }
