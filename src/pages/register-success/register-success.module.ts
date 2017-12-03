import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSuccessPage } from './register-success';

@NgModule({
    declarations: [
        RegisterSuccessPage
    ],
    imports: [
        IonicPageModule.forChild(RegisterSuccessPage),
    ],
    exports: [
        RegisterSuccessPage
    ]
})
export class RegisterPageModule { }
