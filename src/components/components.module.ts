import { ButtonActionComponent } from './button-action/button-action';
import { ModalComponent } from './modal/modal.component';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs/tabs';
import { CounterComponent } from './counter/counter';
import { ValidationMessage } from './validation-message/validation-message';

@NgModule({
	declarations: [
		TabsComponent,
		ButtonActionComponent,
		CounterComponent,
		ModalComponent,
		ValidationMessage
	],
	imports: [
		IonicModule
	],
	exports: [
		TabsComponent,
		ButtonActionComponent,
		CounterComponent,
		ModalComponent,
		ValidationMessage
	]
})
export class ComponentsModule { }
