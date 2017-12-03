var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCreatePage } from './app-create';
import { AppCreateCodeComponent } from './app-create-code';
import { AppCreateResourceComponent } from './app-create-resource';
import { AppCreateSettingComponent } from './app-create-setting';
import { AppCreateConfigureComponent } from './app-create-configure';
var AppCreatePageModule = (function () {
    function AppCreatePageModule() {
    }
    return AppCreatePageModule;
}());
AppCreatePageModule = __decorate([
    NgModule({
        declarations: [
            AppCreatePage,
            AppCreateCodeComponent,
            AppCreateResourceComponent,
            AppCreateSettingComponent,
            AppCreateConfigureComponent
        ],
        imports: [
            IonicPageModule.forChild(AppCreatePage),
        ],
        exports: [
            AppCreatePage,
            AppCreateCodeComponent,
            AppCreateResourceComponent,
            AppCreateSettingComponent,
            AppCreateConfigureComponent
        ]
    })
], AppCreatePageModule);
export { AppCreatePageModule };
//# sourceMappingURL=app-create.module.js.map