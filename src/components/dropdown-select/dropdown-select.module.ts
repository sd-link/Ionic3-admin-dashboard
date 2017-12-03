import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DropdownSelectComponent } from './dropdown-select';

@NgModule({
    declarations: [
        DropdownSelectComponent,
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        DropdownSelectComponent
    ]
})
export class DropdownSelectModule { }
