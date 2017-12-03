import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        RegisterPage
    ],
    imports: [
        IonicPageModule.forChild(RegisterPage),
        ComponentsModule
    ],
    exports: [
        RegisterPage
    ]
})
export class RegisterPageModule { }
