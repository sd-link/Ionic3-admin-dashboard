import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMethodModalPage } from './payment-method-modal';

@NgModule({
  declarations: [
    PaymentMethodModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentMethodModalPage),
  ],
})
export class PaymentMethodModalPageModule {}
